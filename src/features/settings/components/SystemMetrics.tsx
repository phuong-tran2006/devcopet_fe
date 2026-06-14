import React from "react";

interface SystemMetricsProps {
  theme: "light" | "dark";
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ theme }) => {
  return (
    <div
      className={`border p-6 rounded-3xl space-y-5 shadow-xl transition-colors ${
        theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Tiêu đề phân hệ */}
      <h3 className={`text-base font-bold tracking-wide text-on-surface`}>
        System Metrics
      </h3>

      <div className="space-y-4">
        {/* Metric 1: Lines of Logic */}
        <div
          className={`flex items-center gap-4 p-4 border rounded-2xl transition-colors ${
            theme === "dark"
              ? "bg-background border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {/* Box chứa Icon Terminal màu xanh ngọc */}
          <div className="p-3 bg-[#13252a] text-[#7fe3dd] rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant  font-bold uppercase tracking-wider">
              Lines of Logic
            </p>
            <p
              className={`text-2xl font-bold font-mono tracking-wide mt-0.5 ${
                theme === "dark" ? "text-on-surface" : "text-slate-800"
              }`}
            >
              42,890
            </p>
          </div>
        </div>

        {/* Metric 2: Challenges Solved */}
        <div
          className={`flex items-center gap-4 p-4 border rounded-2xl transition-colors ${
            theme === "dark"
              ? "bg-background border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {/* Box chứa Icon Tích xanh đạt thử thách màu hồng */}
          <div className="p-3 bg-[#241b2c] text-secondary rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant  font-bold uppercase tracking-wider">
              Challenges Solved
            </p>
            <p
              className={`text-2xl font-bold font-mono tracking-wide mt-0.5 ${
                theme === "dark" ? "text-on-surface" : "text-slate-800"
              }`}
            >
              156
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
