import React, { useEffect, useMemo, useState } from "react";
import LucideIcon from "../../../components/ui/LucideIcon";
import { api } from "../../../services/axiosClient";
import { useAuthStore } from "../../users/store/auth.store";

interface ProfileFormState {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

interface RankSnapshot {
  globalRank: number | null;
  arenaRank: string | null;
}

const getInitialProfileForm = (user: Record<string, unknown> | null) => ({
  name: String(user?.name || ""),
  username: String(user?.username || ""),
  bio: String(user?.bio || ""),
  avatarUrl: String(user?.avatarUrl || ""),
});

const getResponseList = (data: any) =>
  Array.isArray(data) ? data : data?.data || data?.items || [];

const getUserId = (value: any) =>
  value?.id || value?._id || value?.userId
    ? String(value.id || value._id || value.userId)
    : "";

const findCurrentUserIndex = (items: any[], user: any) => {
  const currentUserId = getUserId(user);
  return items.findIndex((item) => {
    const itemUserId = getUserId(item);
    return (
      (currentUserId && itemUserId === currentUserId) ||
      (user?.username && item.username === user.username)
    );
  });
};

const ProfileHeader = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState<ProfileFormState>(() =>
    getInitialProfileForm(user),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(!user);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rankSnapshot, setRankSnapshot] = useState<RankSnapshot>({
    globalRank: null,
    arenaRank: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/users/me");
        if (!mounted) return;
        const freshUser = response.data;
        updateUser(freshUser);
        setForm(getInitialProfileForm(freshUser));
        setError(null);

        const [leaderboardResponse, arenaLeaderboardResponse] =
          await Promise.allSettled([
            api.get("/users/leaderboard"),
            api.get("/arena/leaderboard?limit=100"),
          ]);

        if (!mounted) return;

        const leaderboard =
          leaderboardResponse.status === "fulfilled"
            ? getResponseList(leaderboardResponse.value.data)
            : [];
        const arenaLeaderboard =
          arenaLeaderboardResponse.status === "fulfilled"
            ? getResponseList(arenaLeaderboardResponse.value.data)
            : [];

        const globalIndex = findCurrentUserIndex(leaderboard, freshUser);
        const arenaIndex = findCurrentUserIndex(arenaLeaderboard, freshUser);
        const arenaEntry =
          arenaIndex >= 0 ? arenaLeaderboard[arenaIndex] : freshUser;

        setRankSnapshot({
          globalRank:
            globalIndex >= 0
              ? Number(leaderboard[globalIndex]?.rank || globalIndex + 1)
              : null,
          arenaRank:
            arenaEntry?.arenaRank ||
            (arenaIndex >= 0
              ? `#${arenaLeaderboard[arenaIndex]?.rank || arenaIndex + 1}`
              : null),
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        if (mounted) setError("Could not load your latest profile.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [updateUser]);

  useEffect(() => {
    if (!isEditing) {
      setForm(getInitialProfileForm(user));
    }
  }, [isEditing, user]);

  const displayName = useMemo(
    () => user?.name || user?.username || user?.email || "Architect",
    [user],
  );
  const displayRank =
    rankSnapshot.globalRank || Number(user?.rank || user?.leaderboardRank || 0);
  const arenaRank =
    rankSnapshot.arenaRank || String(user?.arenaRank || "Unranked");

  const handleInputChange =
    (field: keyof ProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setMessage(null);
      setError(null);
    };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim(),
      };
      const response = await api.patch("/users/profile", payload);
      const updatedUser = response.data?.user || response.data;
      updateUser(updatedUser);
      setForm(getInitialProfileForm(updatedUser));
      setIsEditing(false);
      setMessage("Profile updated.");
    } catch (err: any) {
      const rawMessage = err?.response?.data?.message || err?.message;
      setError(
        Array.isArray(rawMessage)
          ? rawMessage[0]
          : rawMessage || "Could not update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mb-8 rounded-2xl border border-outline/20 bg-surface p-5 md:p-6 shadow-sm transition-colors duration-300">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold transition-colors duration-300">
            WELCOME BACK, {String(displayName).toUpperCase()}
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3 transition-colors duration-300">
            Ready for the next{" "}
            <span className="text-primary-fixed-dim">evolution?</span>
          </h1>
          {user?.bio ? (
            <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">
              {String(user.bio)}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-medium text-sm border border-outline/20 transition-colors duration-300">
            <LucideIcon name="workspace_premium" className="text-[18px]" />
            Global Rank: {displayRank ? `#${displayRank}` : "Unranked"}
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-medium text-sm border border-outline/20 transition-colors duration-300">
            <LucideIcon name="swords" className="text-[18px]" />
            Arena Rank: {arenaRank}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditing((current) => !current);
              setMessage(null);
              setError(null);
            }}
            className="flex items-center gap-2 rounded-lg border border-outline/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-on-surface/5"
          >
            <LucideIcon
              name={isEditing ? "close" : "edit"}
              className="text-[18px]"
            />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm font-medium text-on-surface-variant">
          Loading profile...
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 text-sm font-semibold text-primary">{message}</p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm font-semibold text-error">{error}</p>
      ) : null}

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-on-surface">
            Full name
            <input
              value={form.name}
              onChange={handleInputChange("name")}
              className="rounded-lg border border-outline/20 bg-surface-container-low px-3 py-2.5 text-sm font-normal text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="Your name"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-on-surface">
            Username
            <input
              value={form.username}
              onChange={handleInputChange("username")}
              className="rounded-lg border border-outline/20 bg-surface-container-low px-3 py-2.5 text-sm font-normal text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="dev_hero"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-on-surface md:col-span-2">
            Avatar URL
            <input
              value={form.avatarUrl}
              onChange={handleInputChange("avatarUrl")}
              className="rounded-lg border border-outline/20 bg-surface-container-low px-3 py-2.5 text-sm font-normal text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="https://..."
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-on-surface md:col-span-2">
            Bio
            <textarea
              value={form.bio}
              onChange={handleInputChange("bio")}
              rows={3}
              className="resize-none rounded-lg border border-outline/20 bg-surface-container-low px-3 py-2.5 text-sm font-normal text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="A short note about your coding journey"
            />
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LucideIcon name="save" className="text-[18px]" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="rounded-lg border border-outline/20 px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-on-surface/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Discard
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default ProfileHeader;
