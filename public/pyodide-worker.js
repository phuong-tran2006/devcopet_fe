importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReadyPromise;

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
  });
  self.postMessage({ type: 'ready' });
}

pyodideReadyPromise = loadPyodideAndPackages();

function formatPythonError(errorMsg) {
  const lines = errorMsg.split('\n');
  const cleanLines = [];
  let skipMode = false;

  for (let line of lines) {
    // Nhận diện dòng bắt đầu bằng "  File"
    if (line.startsWith('  File "')) {
      // Nếu là file nội bộ của Pyodide, bỏ qua
      if (line.includes('"/lib/python') || line.includes('_pyodide')) {
        skipMode = true;
      } else {
        skipMode = false;
        cleanLines.push(line);
      }
    } else if (line.startsWith('    ') || line.startsWith('  ^') || line.trim() === '^') {
      // Code snippet hoặc dấu ^^^ chỉ lỗi
      if (!skipMode) {
        cleanLines.push(line);
      }
    } else {
      // Traceback header hoặc Dòng thông báo lỗi chính (Exception)
      skipMode = false;
      cleanLines.push(line);
    }
  }

  return cleanLines.join('\n').trim();
}

self.onmessage = async (event) => {
  const { id, code } = event.data;

  try {
    await pyodideReadyPromise;

    // Capture stdout and stderr
    let output = "";
    pyodide.setStdout({ batched: (msg) => { output += msg + "\n"; } });
    pyodide.setStderr({ batched: (msg) => { output += msg + "\n"; } });

    await pyodide.runPythonAsync(code);

    // Truncate output if it exceeds 50KB to avoid crashing the browser
    if (output.length > 50000) {
      output = output.substring(0, 50000) + "\n...[Output truncated, exceeded 50KB limit]";
    }

    self.postMessage({ id, output, error: null });
  } catch (err) {
    self.postMessage({ id, output: null, error: formatPythonError(err.message) });
  }
};
