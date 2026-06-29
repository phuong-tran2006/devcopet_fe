import type { ImgHTMLAttributes } from "react";

/**
 * Flexible user type accepted by `UserAvatar`.
 * Covers auth-store `User`, leaderboard entries, arena players, etc.
 */
export type UserAvatarUser = {
  id?: string;
  userId?: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string | null;
  avatar?: string | null;
  picture?: string | null;
  photoUrl?: string | null;
  profileImage?: string | null;
};

export type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  /** User-like object from any data source. */
  user: UserAvatarUser;
  /** Predefined size preset. Defaults to `"md"`. */
  size?: UserAvatarSize;
  /** Extra classes applied to the outer wrapper element. */
  className?: string;
  /** Extra `<img>` attributes forwarded when an avatar image is rendered. */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}

const SIZE_CLASSES: Record<UserAvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-[12px]",
  md: "w-10 h-10 text-[14px]",
  lg: "w-16 h-16 text-[20px]",
  xl: "w-20 h-20 text-[24px]",
};

/**
 * Resolve a canonical avatar URL from a user-like object.
 *
 * Priority: `avatarUrl` → `avatar` → `picture` → `photoUrl` → `profileImage`
 *
 * URLs containing `pravatar.cc` are treated as placeholder/random images and
 * are therefore excluded.
 */
export function resolveAvatarUrl(user: UserAvatarUser): string | undefined {
  const raw =
    user.avatarUrl ??
    user.avatar ??
    user.picture ??
    user.photoUrl ??
    user.profileImage ??
    undefined;

  if (!raw) return undefined;
  if (typeof raw === "string" && raw.includes("pravatar.cc")) return undefined;
  return raw;
}

/**
 * Derive the display name from a user-like object.
 */
export function resolveDisplayName(user: UserAvatarUser): string {
  return (
    user.displayName || user.name || user.username || "User"
  );
}

/**
 * Return the uppercased first character of the user's display name.
 */
export function resolveInitial(user: UserAvatarUser): string {
  const name = resolveDisplayName(user);
  return name.trim().charAt(0).toUpperCase() || "?";
}

/**
 * Shared avatar component that ensures the same user always renders the same
 * avatar across the entire application.
 *
 * - Shows the `avatarUrl` image when available.
 * - Falls back to the first letter of the user's display name.
 * - Filters out known placeholder URLs (e.g. pravatar.cc).
 */
export default function UserAvatar({
  user,
  size = "md",
  className = "",
  imgProps,
}: UserAvatarProps) {
  const avatarUrl = resolveAvatarUrl(user);
  const displayName = resolveDisplayName(user);
  const initial = resolveInitial(user);
  const sizeClass = SIZE_CLASSES[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        {...imgProps}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onError={(e) => {
          // On load failure, replace with the initial letter
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerText = initial;
          }
        }}
      />
    );
  }

  return (
    <span className={`${sizeClass} inline-flex items-center justify-center font-bold ${className}`}>
      {initial}
    </span>
  );
}
