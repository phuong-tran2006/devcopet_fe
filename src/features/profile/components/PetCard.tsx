import React, { useEffect, useState } from "react";
import { mascotAxolotl } from "../../users/constants/authImages";
import { useAuthStore } from "../../users/store/auth.store";
import { profileApi } from "../api/profile.api";
import LucideIcon from "../../../components/ui/LucideIcon";
import { useTheme } from "../../../contexts/ThemeContext";
import petVideo from "../../../assets/videos/conpet.webm";

const PetCard = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuthStore();
  const [videoError, setVideoError] = useState(false);

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
  const petAvatar = pet?.avatar;
  const availableXp = Number(user?.currentXp || 0);

  const levelProgress = petNextLevelExp > 0
    ? Math.min(100, Math.round((petExp / petNextLevelExp) * 100))
    : 0;

  const [nextPetName, setNextPetName] = useState(petName);
  const [saving, setSaving] = useState(false);
  const [feeding, setFeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNextPetName(petName);
  }, [petName]);

  useEffect(() => {
    if (message === "Pet fed successfully!") {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const updatePetName = async () => {
    if (!nextPetName.trim() || saving) return;

    setSaving(true);
    setMessage(null);
    try {
      const { api } = await import("../../../services/axiosClient");
      const response = await api.patch("/users/profile", {
        petName: nextPetName.trim(),
      });
      const updatedUser = response.data?.user || response.data;
      updateUser({ ...updatedUser, petName: nextPetName.trim() });
      setMessage("Pet name updated successfully!");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Could not update pet.");
    } finally {
      setSaving(false);
    }
  };

  const feedPet = async () => {
    if (feeding || availableXp < 100) return;

    setFeeding(true);
    setMessage(null);
    try {
      const response = await profileApi.feedPet();
      if (response.data?.user) {
        updateUser(response.data.user);
      }
      setMessage("Pet fed successfully!");

      // Refetch profile to get updated currentXp, pet data, and rank
      try {
        const profileResponse = await profileApi.getMe();
        updateUser(profileResponse.data);
      } catch {
        // Profile refetch failed silently — store already has feed response data
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorMessage = err?.response?.data?.message || "";
      if (status === 404) {
        setMessage("Pet feed is not available yet.");
      } else if (
        status === 400 ||
        errorMessage.toLowerCase().includes("insufficient") ||
        errorMessage.toLowerCase().includes("not enough")
      ) {
        setMessage("Not enough XP to feed your pet.");
      } else {
        setMessage(errorMessage || "Feeding is unavailable.");
      }
    } finally {
      setFeeding(false);
    }
  };

  // 1. Profile loading state
  if (!user) {
    return (
      <div
        className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors ${theme === "dark"
            ? "bg-[#09141c] border-[#14232e]"
            : "bg-white border-slate-200"
          }`}
      >
        <h2 className="text-sm font-bold tracking-widest uppercase text-[#76d6d5] flex items-center gap-2">
          🐾 Pet Companion
        </h2>
        <div className="py-8 text-center text-sm font-medium text-on-surface-variant animate-pulse">
          Loading Pet Companion...
        </div>
      </div>
    );
  }

  // 3. Pet data missing state
  if (!pet) {
    return (
      <div
        className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors ${theme === "dark"
            ? "bg-[#09141c] border-[#14232e]"
            : "bg-white border-slate-200"
          }`}
      >
        <h2 className="text-sm font-bold tracking-widest uppercase text-[#76d6d5] flex items-center gap-2">
          🐾 Pet Companion
        </h2>
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-outline/30 rounded-xl bg-surface-container/20">
          <LucideIcon name="pets" className="text-4xl text-on-surface-variant/40 mb-3" />
          <p className="text-sm font-semibold text-on-surface text-center mb-1">
            Pet companion data missing
          </p>
          <p className="text-xs text-on-surface-variant text-center">
            Please complete your onboarding or initialize your pet profile.
          </p>
        </div>
      </div>
    );
  }

  const cost = 100;
  const isFeedDisabled = feeding || availableXp < cost;

  let buttonText = `Feed Pet - Cost: ${cost} XP`;
  if (feeding) {
    buttonText = "Feeding...";
  } else if (availableXp < cost) {
    buttonText = `Not enough XP - Need ${cost} XP`;
  }

  return (
    <div
      className={`border p-6 rounded-2xl space-y-6 shadow-xl transition-colors ${theme === "dark"
          ? "bg-[#09141c] border-[#14232e]"
          : "bg-white border-slate-200"
        }`}
    >
      <div className="flex justify-between items-center">
        <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 ${theme === "dark" ? "text-[#76d6d5]" : "text-teal-600"}`}>
          🐾 Pet Companion
        </h2>
        {user?.petProfileInitialized ? (
          <span className={`text-[10px] border px-2.5 py-0.5 rounded-md font-mono font-bold tracking-wider ${
            theme === "dark"
              ? "bg-[#1a2f26] border-[#26543c] text-[#5cdb95]"
              : "bg-teal-50 border-teal-200 text-teal-700"
          }`}>
            ACTIVE
          </span>
        ) : null}
      </div>

      <div
        className={`flex gap-4 p-4 border rounded-2xl items-center transition-colors ${theme === "dark"
            ? "bg-[#040d14] border-[#14232e]"
            : "bg-slate-50 border-slate-100"
          }`}
      >
        <div className={`w-[84px] h-[94px] border rounded-xl p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden ${
          theme === "dark" ? "bg-[#0a1b26] border-[#193245]" : "bg-slate-100 border-slate-200"
        }`}>
          {!videoError ? (
            <video
              src={petVideo}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center rounded-lg font-bold text-lg ${
              theme === "dark" ? "bg-[#0a1b26] text-[#7fe3dd]" : "bg-slate-200 text-teal-600"
            }`}>
              {petName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-on-surface-variant">
            Pet Name: <span className={`font-bold ${theme === "dark" ? "text-[#7fe3dd]" : "text-teal-600"}`}>{petName}</span>
          </p>
          <p className="text-sm font-semibold text-on-surface-variant">
            Pet Level: <span className="font-bold text-on-surface">{petLevel}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
              Pet EXP
            </span>
            <span className={`font-bold ${theme === "dark" ? "text-[#7fe3dd]" : "text-teal-600"}`}>
              {petExp.toLocaleString()} / {petNextLevelExp.toLocaleString()} XP ({levelProgress}%)
            </span>
          </div>
          <div
            className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-[#14232e]" : "bg-slate-200"
              }`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                theme === "dark" 
                  ? "bg-[#7fe3dd] shadow-[0_0_10px_rgba(127,227,221,0.6)]" 
                  : "bg-teal-500"
              }`}
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        <div className={`flex justify-between items-center py-2 px-4 rounded-xl border ${
          theme === "dark" ? "border-outline/10 bg-surface-container/20" : "border-slate-200 bg-slate-50"
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Available XP
          </span>
          <span className={`text-base font-extrabold font-mono ${
            theme === "dark" ? "text-primary-fixed-dim" : "text-teal-600"
          }`}>
            {availableXp.toLocaleString()} XP
          </span>
        </div>
      </div>

      <div className={`rounded-xl border p-4 space-y-4 ${
        theme === "dark" ? "border-outline/20 bg-surface-container/40" : "border-slate-200 bg-slate-50"
      }`}>
        <h3 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
          theme === "dark" ? "text-[#76d6d5]" : "text-teal-600"
        }`}>
          <LucideIcon name="pets" className="text-[16px]" />
          Pet Care
        </h3>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={feedPet}
            disabled={isFeedDisabled}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 ${
              isFeedDisabled
                ? theme === "dark"
                  ? "bg-[#14232e] text-on-surface-variant/40 cursor-not-allowed opacity-60 border border-outline/10"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 border border-slate-300"
                : theme === "dark"
                  ? "bg-[#7fe3dd] hover:bg-[#5bc2bc] text-[#09141c] text-on-primary"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
          >
            <LucideIcon name="restaurant" className="text-[18px]" />
            {buttonText}
          </button>

          <p className="text-[11px] text-center text-on-surface-variant leading-relaxed font-medium">
            Feeding pet spends Available XP. Your level will not go down.
          </p>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-outline/10">
            <label className="text-xs font-semibold text-on-surface-variant">
              Update Pet Name
            </label>
            <div className="flex gap-2">
              <input
                value={nextPetName}
                onChange={(event) => {
                  setNextPetName(event.target.value);
                  setMessage(null);
                }}
                className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm text-on-surface outline-none transition-colors ${theme === "dark"
                    ? "bg-[#040d14] border-[#14232e] focus:border-[#76d6d5]"
                    : "bg-white border-slate-200 focus:border-teal-500"
                  }`}
              />
              <button
                type="button"
                onClick={updatePetName}
                disabled={saving || !nextPetName.trim()}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${theme === "dark"
                    ? "border-[#14232e] text-slate-300 hover:bg-white/5"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {saving ? "Saving" : "Update"}
              </button>
            </div>
          </div>

          {message ? (
            <div className="relative flex flex-col items-center justify-center">
              <p className={`text-xs font-semibold text-center mt-1 ${
                message === "Pet fed successfully!"
                  ? `${theme === "dark" ? "text-cyan-300" : "text-teal-600"} animate-pet-glow-pulse`
                  : message.includes("successfully") || message.includes("updated")
                  ? "text-success"
                  : "text-error"
              }`}>
                {message}
              </p>
              {message === "Pet fed successfully!" && (
                <span className={`absolute -top-5 text-[11px] font-extrabold tracking-wider pointer-events-none select-none animate-pet-exp-float ${
                  theme === "dark" ? "text-cyan-300" : "text-teal-600"
                }`}>
                  + Pet EXP
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
