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
    <div className="my-6 rounded-xl overflow-hidden border border-outline/20 bg-surface-container shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high border-b border-outline/20">
        <div className="flex items-center gap-2">
          <LucideIcon
            name="code_blocks"
            className="text-[18px] text-primary-fixed-dim"
          />
          <span className="text-[12px] font-bold text-on-surface tracking-widest uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={status === "running" || status === "loading"}
            className="flex items-center gap-1 rounded-lg border border-outline/40 bg-surface-container-lowest px-3 py-1.5 text-[12px] font-bold text-on-surface shadow-sm transition-colors hover:border-primary hover:bg-surface-container disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <LucideIcon name="refresh" className="text-[16px]" />
            RESET
          </button>

          <button
            onClick={handleRun}
            disabled={status === "running" || status === "loading"}
            className="flex items-center gap-1 bg-primary hover:bg-primary/85 text-on-primary text-[13px] font-bold px-4 py-1.5 rounded-lg border border-primary shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-high"
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
      <div className="p-4 border-b border-outline/20 bg-surface-container-low relative group">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className="custom-scrollbar code-runner-editor w-full bg-transparent text-on-surface placeholder:text-on-surface-variant font-mono text-[14px] leading-relaxed resize-y min-h-[150px] outline-none selection:bg-primary-fixed-dim/30"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        />
      </div>

      {/* Output Panel */}
      <div className="bg-surface-container-high p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            Output
          </span>
          {status === "loading" && (
            <div className="w-3 h-3 border-2 border-primary-fixed-dim border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <pre
          className={`font-mono text-[13.5px] leading-relaxed whitespace-pre-wrap ${
            status === "loading"
              ? "animate-pulse text-primary-fixed-dim"
              : output.includes("timed out")
                ? "text-amber-500"
                : status === "error"
                  ? "text-error"
                  : status === "done"
                    ? "text-emerald-500"
                    : "text-on-surface-variant"
          }`}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeRunnerBlock;
