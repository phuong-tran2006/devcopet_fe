import React from "react";
import { mascotAxolotl } from "../../users/constants/authImages";
import { useAuthStore } from "../../users/store/auth.store";

interface PetStatusProps {
  theme: "light" | "dark";
}

export const PetStatus: React.FC<PetStatusProps> = ({ theme }) => {
  const user = useAuthStore((state) => state.user);
  const pet = user?.pet;
  const petName = pet?.name || String(user?.petName || "Axo-Script");
  const petLevel = Number(pet?.level || 1);
  const petExp = Number(pet?.exp || 0);

  const getPetLevelRequiredExp = (level: number) => {
    let total = 0;
    for (let n = 1; n <= level; n++) {
      total += Math.pow(n, n) * 100;
    }
    return total;
  };

  const petNextLevelExp = Number(pet?.levelRequiredExp || getPetLevelRequiredExp(petLevel));
  const evolutionStage = Number(pet?.evolutionStage || 1);
  const petAvatar = pet?.avatar;

  const expProgress = petNextLevelExp > 0
    ? Math.min(100, Math.round((petExp / petNextLevelExp) * 100))
    : 0;

  const maxEvolutionStage = 5;
  const evolutionProgress = Math.min(
    100,
    Math.round((evolutionStage / maxEvolutionStage) * 100),
  );

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
            src={petAvatar || mascotAxolotl}
            alt={`${petName} Card`}
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* Thông tin chi tiết của Pet */}
        <div className="space-y-0.5">
          <h4 className="text-base font-bold text-[#7fe3dd] tracking-wide">
            {petName}
          </h4>
          <p className="text-xs text-on-surface-variant font-medium">
            Evolution Stage: {evolutionStage}
          </p>
          <p
            className={`text-sm font-bold mt-1 ${theme === "dark" ? "text-white" : "text-slate-800"}`}
          >
            Level {petLevel}{" "}
            <span className="text-on-surface-variant  font-normal">
              (XP: {petExp.toLocaleString()} / {petNextLevelExp.toLocaleString()})
            </span>
          </p>
        </div>
      </div>

      {/* Khu vực các thanh chỉ số (Progress Bars) */}
      <div className="space-y-4 pt-2">
        {/* Chỉ số 1: Experience Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span
              className={theme === "dark" ? "text-slate-300" : "text-slate-600"}
            >
              Experience Progress
            </span>
            <span className="text-[#7fe3dd] font-bold">{expProgress}%</span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-[#14232e]" : "bg-slate-200"}`}
          >
            <div
              className="bg-[#7fe3dd] h-2 rounded-full shadow-[0_0_10px_rgba(127,227,221,0.6)] transition-all duration-500"
              style={{ width: `${expProgress}%` }}
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
            <span className="text-[#d8bfd8] font-bold">Stage {evolutionStage} / {maxEvolutionStage}</span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-[#14232e]" : "bg-slate-200"}`}
          >
            <div
              className="bg-[#d8bfd8] h-2 rounded-full shadow-[0_0_10px_rgba(216,191,216,0.6)] transition-all duration-500"
              style={{ width: `${evolutionProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

