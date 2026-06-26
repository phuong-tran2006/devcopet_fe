import React from "react";
import { mascotAxolotl } from "../../users/constants/authImages";
import { useAuthStore } from "../../users/store/auth.store";

interface PetStatusProps {
  theme: "light" | "dark";
}

export const PetStatus: React.FC<PetStatusProps> = ({ theme }) => {
  const user = useAuthStore((state) => state.user);
  const level = user?.level ?? 1;
  const exp = user?.exp ?? 0;

  return (
    <div
      className={`border p-6 rounded-3xl space-y-4 shadow-xl transition-colors relative overflow-hidden ${
        theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Hàng tiêu đề + Badge trạng thái */}
      <div className="flex justify-between items-center">
        <h3
          className={`text-base font-bold tracking-wide ${theme === "dark" ? "text-white" : "text-slate-900"}`}
        >
          Pet Status
        </h3>
        <span className="text-[10px] bg-[#1a2f26] border border-[#26543c] text-[#5cdb95] px-2.5 py-0.5 rounded-md font-mono font-bold tracking-wider">
          STABLE
        </span>
      </div>

      {/* Khu vực thẻ bài Pet (Card Layout) */}
      <div
        className={`flex gap-4 p-4 border rounded-2xl items-center transition-colors ${
          theme === "dark"
            ? "bg-[#040d14] border-[#14232e]"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        {/* Khung chứa ảnh dạng thẻ bài bo góc sâu */}
        <div className="w-[84px] h-[94px] bg-[#0a1b26] border border-[#193245] rounded-xl p-1 flex items-center justify-center shrink-0 shadow-inner">
          <img
            src={mascotAxolotl}
            alt={`${user?.petName || "Axo-Script"} Card`}
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* Thông tin chi tiết của Pet */}
        <div className="space-y-0.5">
          <h4 className="text-base font-bold text-[#7fe3dd] tracking-wide">
            {user?.petName || "Axo-Script"}
          </h4>
          <p className="text-xs text-on-surface-variant font-medium">
            Type: Water / Logic
          </p>
          <p
            className={`text-sm font-bold mt-1 ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            Level {level}{" "}
            <span className="text-on-surface-variant  font-normal">
              (XP: {exp.toLocaleString()})
            </span>
          </p>
        </div>
      </div>

      {/* Khu vực các thanh chỉ số (Progress Bars) */}
      <div className="space-y-4 pt-2">
        {/* Chỉ số 1: Hydration */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span
              className={theme === "dark" ? "text-slate-300" : "text-slate-600"}
            >
              Hydration (Energy)
            </span>
            <span className="text-[#7fe3dd] font-bold">82%</span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-[#14232e]" : "bg-slate-200"}`}
          >
            <div
              className="bg-[#7fe3dd] h-2 rounded-full shadow-[0_0_10px_rgba(127,227,221,0.6)] transition-all duration-500"
              style={{ width: "82%" }}
            />
          </div>
        </div>

        {/* Chỉ số 2: Evolution Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span
              className={theme === "dark" ? "text-slate-300" : "text-slate-600"}
            >
              Evolution Progress
            </span>
            <span className="text-[#d8bfd8] font-bold">45%</span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-[#14232e]" : "bg-slate-200"}`}
          >
            <div
              className="bg-[#d8bfd8] h-2 rounded-full shadow-[0_0_10px_rgba(216,191,216,0.6)] transition-all duration-500"
              style={{ width: "45%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
