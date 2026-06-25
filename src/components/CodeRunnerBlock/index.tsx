// @ts-nocheck
import LucideIcon from "../ui/LucideIcon";
import React, { useState, useEffect, useRef } from "react";

const CodeRunnerBlock = ({ initialCode, title = "TRY IT YOURSELF" }) => {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("Loading Python Engine...");
  const [status, setStatus] = useState("loading"); // loading | ready | running | done | error | timeout

  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const currentRunId = useRef(0);
  const textareaRef = useRef(null);

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
    <div className="my-6 rounded-xl overflow-hidden border border-[#d8e2ec] bg-[#f5f8fb] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#edf3f8] border-b border-[#d8e2ec]">
        <div className="flex items-center gap-2">
          <LucideIcon
            name="code_blocks"
            className="text-[18px] text-[#207985]"
          />
          <span className="text-[12px] font-bold text-[#253447] tracking-widest uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={status === "running" || status === "loading"}
            className="text-[12px] font-bold text-[#637386] hover:text-[#1f2f43] transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <LucideIcon name="refresh" className="text-[16px]" />
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
              <LucideIcon name="play_arrow" className="text-[16px]" />
            )}
            {status === "loading" ? "LOADING..." : "RUN"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4 border-b border-[#d8e2ec] bg-[#f8fbfd] relative group">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className="custom-scrollbar w-full bg-transparent text-[#263447] placeholder:text-[#7b8da1] font-mono text-[14px] leading-relaxed resize-y min-h-[150px] outline-none selection:bg-[#cce7ee]"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        />
      </div>

      {/* Output Panel */}
      <div className="bg-[#eef4f8] p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold text-[#637386] uppercase tracking-widest">
            Output
          </span>
          {status === "loading" && (
            <div className="w-3 h-3 border-2 border-primary-fixed-dim border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <pre
          className={`font-mono text-[13.5px] leading-relaxed whitespace-pre-wrap ${
            status === "loading"
              ? "animate-pulse text-[#207985]"
              : output.includes("timed out")
                ? "text-amber-600"
                : status === "error"
                  ? "text-red-600"
                  : status === "done"
                    ? "text-emerald-700"
                    : "text-[#4c5e73]"
          }`}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeRunnerBlock;
