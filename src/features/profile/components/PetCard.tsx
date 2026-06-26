import React, { useEffect, useState } from "react";
import { mascotAxolotl } from "../../users/constants/authImages";
import { useAuthStore } from "../../users/store/auth.store";
import { api } from "../../../services/axiosClient";
import LucideIcon from "../../../components/ui/LucideIcon";

const PetCard = () => {
  const { user, updateUser } = useAuthStore();
  const petName = String(user?.petName || "Axo-Script");
  const level = Number(user?.level || 1);
  const exp = Number(user?.exp || 0);
  const nextLevelExp = 1000;
  const levelProgress = Math.min(100, Math.round((exp % nextLevelExp) / 10));
  const [nextPetName, setNextPetName] = useState(petName);
  const [saving, setSaving] = useState(false);
  const [feeding, setFeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNextPetName(petName);
  }, [petName]);

  const updatePet = async () => {
    if (!nextPetName.trim() || saving) return;

    setSaving(true);
    setMessage(null);
    try {
      const response = await api.patch("/users/profile", {
        petName: nextPetName.trim(),
      });
      const updatedUser = response.data?.user || response.data;
      updateUser({ ...updatedUser, petName: nextPetName.trim() });
      setMessage("Pet updated.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Could not update pet.");
    } finally {
      setSaving(false);
    }
  };

  const feedPet = async () => {
    if (feeding) return;

    setFeeding(true);
    setMessage(null);
    try {
      const response = await api.post("/pets/feed");
      if (response.data?.user) {
        updateUser(response.data.user);
      }
      setMessage(response.data?.message || "Pet fed.");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Feeding is unavailable.");
    } finally {
      setFeeding(false);
    }
  };

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 flex flex-col w-full transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface transition-colors duration-300">
            {petName}
          </h2>
          <p className="text-on-surface-variant text-sm transition-colors duration-300">
            Level {level} companion
          </p>
        </div>
        {user?.petProfileInitialized ? (
          <div className="bg-primary-fixed text-primary-fixed-dim text-xs font-bold px-3 py-1 rounded uppercase tracking-wider transition-colors duration-300">
            ACTIVE
          </div>
        ) : null}
      </div>

      <div className="w-full aspect-square bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 overflow-hidden transition-colors duration-300 border border-outline/10">
        <img
          src={mascotAxolotl}
          alt={petName}
          className="w-[80%] h-[80%] object-contain"
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-semibold text-on-surface-variant mb-2 transition-colors duration-300">
            <span>Experience</span>
            <span>{exp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden transition-colors duration-300">
            <div
              className="h-full bg-primary-fixed-dim rounded-full transition-colors duration-300"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="rounded-xl border border-outline/20 bg-surface-container/40 p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-fixed-dim">
            <LucideIcon name="pets" className="text-[18px]" />
            Pet Care
          </h3>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={feedPet}
              disabled={feeding}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-fixed-dim px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LucideIcon name="restaurant" className="text-[18px]" />
              {feeding ? "Feeding..." : "Feed Pet"}
            </button>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface-variant">
                Pet name
              </label>
              <div className="flex gap-2">
                <input
                  value={nextPetName}
                  onChange={(event) => {
                    setNextPetName(event.target.value);
                    setMessage(null);
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-outline/20 bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
                <button
                  type="button"
                  onClick={updatePet}
                  disabled={saving || !nextPetName.trim()}
                  className="shrink-0 rounded-lg border border-outline/20 px-3 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-on-surface/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving" : "Update"}
                </button>
              </div>
            </div>

            {message ? (
              <p className="text-xs font-semibold text-on-surface-variant">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
