import React, { useState, useEffect, useRef } from "react";

const CodeRunnerBlock = ({ initialCode, title = "TRY IT YOURSELF" }) => {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("Loading Python Engine...");
  const [status, setStatus] = useState("loading"); // loading | ready | running | done | error | timeout

  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const currentRunId = useRef(0);

  // Initialize the worker on component mount
  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const initWorker = (isRestart = false) => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    workerRef.current = new Worker("/pyodide-worker.js");
    setStatus("loading");

    if (!isRestart) {
      setOutput("Loading Python Engine...");
    }

    workerRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.type === "ready") {
        setStatus("ready");
        // Only set "Ready!" text if it's the first load (not a timeout recovery)
        setOutput((prev) => {
          if (prev === "Loading Python Engine..." || prev === "Running...") {
            return "Ready! Click Run to execute...";
          }
          return prev;
        });
        return;
      }

      const { id, output: runOutput, error } = data;

      // Ensure we only process the result of the current run
      if (id !== currentRunId.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (error) {
        setOutput(error);
        setStatus("error");
      } else {
        setOutput(runOutput === "" ? "(no output)" : runOutput);
        setStatus("done");
      }
    };
  };

  const handleRun = () => {
    if (status === "running" || status === "loading") return;

    if (code.length > 10240) {
      // 10KB limit
      setOutput("Error: Code length exceeds the 10KB limit.");
      setStatus("error");
      return;
    }

    setStatus("running");
    setOutput("Running...");

    const runId = Date.now();
    currentRunId.current = runId;

    workerRef.current.postMessage({ id: runId, code });

    // 5 seconds timeout
    timeoutRef.current = setTimeout(() => {
      // If it takes more than 5s, terminate the worker
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      setOutput("Execution timed out.");
      setStatus("timeout");

      // Re-initialize the worker for future runs
      initWorker(true);
    }, 5000);
  };

  const handleReset = () => {
    if (status === "running" || status === "loading") return; // Do not allow reset while running
    setCode(initialCode || "");
    setOutput("Ready! Click Run to execute...");
    setStatus("ready");
  };

  const handleKeyDown = (e) => {
    // Basic tab support for indentation (2 spaces)
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      // Move cursor right after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[#1E293B] bg-[#0b1118]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">
            code_blocks
          </span>
          <span className="text-[12px] font-bold text-white tracking-widest uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={status === "running" || status === "loading"}
            className="text-[12px] font-bold text-on-surface-variant hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              refresh
            </span>
            RESET
          </button>

          <button
            onClick={handleRun}
            disabled={status === "running" || status === "loading"}
            className="flex items-center gap-1 bg-primary-fixed-dim hover:bg-primary-fixed text-on-primary-fixed text-[13px] font-bold px-4 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "running" || status === "loading" ? (
              <div className="w-3.5 h-3.5 border-2 border-on-primary-fixed/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[16px]">
                play_arrow
              </span>
            )}
            {status === "loading" ? "LOADING..." : "RUN"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4 border-b border-[#1E293B] relative group">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className="w-full bg-transparent text-[#e2e8f0] font-mono text-[14px] leading-relaxed resize-y min-h-[120px] outline-none"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        />
      </div>

      {/* Output Panel */}
      <div className="bg-[#121c25] p-4">
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
          Output
        </div>
        <pre
          className={`font-mono text-[13.5px] leading-relaxed whitespace-pre-wrap ${
            output.includes("timed out")
              ? "text-[#FBBF24]"
              : status === "error"
                ? "text-[#F87171]"
                : status === "done"
                  ? "text-[#10B981]"
                  : "text-[#94A3B8]"
          }`}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeRunnerBlock;
