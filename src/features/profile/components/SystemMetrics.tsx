import React from "react";
import { BadgeCheck, Terminal } from "lucide-react";

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
      <h3
        className={`text-base font-bold tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
      >
        System Metrics
      </h3>

      <div className="space-y-4">
        {/* Metric 1: Lines of Logic */}
        <div
          className={`flex items-center gap-4 p-4 border rounded-2xl transition-colors ${
            theme === "dark"
              ? "bg-[#040d14] border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {/* Box chứa Icon Terminal màu xanh ngọc */}
          <div className="p-3 bg-[#13252a] text-[#7fe3dd] rounded-xl flex items-center justify-center shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant  font-bold uppercase tracking-wider">
              Lines of Logic
            </p>
            <p
              className={`text-2xl font-bold font-mono tracking-wide mt-0.5 ${
                theme === "dark" ? "text-white" : "text-slate-800"
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
              ? "bg-[#040d14] border-[#14232e]"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {/* Box chứa Icon Tích xanh đạt thử thách màu hồng */}
          <div className="p-3 bg-[#241b2c] text-[#d8bfd8] rounded-xl flex items-center justify-center shrink-0">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant  font-bold uppercase tracking-wider">
              Challenges Solved
            </p>
            <p
              className={`text-2xl font-bold font-mono tracking-wide mt-0.5 ${
                theme === "dark" ? "text-white" : "text-slate-800"
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
