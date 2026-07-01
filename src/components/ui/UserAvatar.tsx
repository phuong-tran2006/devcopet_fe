import { useState, type ImgHTMLAttributes } from "react";

export type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  /** The URL of the avatar image. */
  avatarUrl?: string | null;
  /** The name used for the fallback initial. */
  name?: string;
  /** Predefined size preset. Only applied if className doesn't specify size. */
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
 * Shared avatar component that ensures the same user always renders the same
 * avatar across the entire application.
 *
 * - Shows the `avatarUrl` image when available and valid.
 * - Filters out known placeholder URLs (e.g. pravatar.cc).
 * - Falls back to the first letter of the user's name/email.
 * - If image fails to load, gracefully falls back to the initial.
 */
export default function UserAvatar({
  avatarUrl,
  name,
  size = "md",
  className = "",
  imgProps,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidUrl =
    avatarUrl &&
    typeof avatarUrl === "string" &&
    !avatarUrl.includes("pravatar.cc");

  const displayName = name || "User";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  const hasCustomWidth = className.includes("w-") || className.includes("size-");
  const sizeClass = hasCustomWidth ? "" : SIZE_CLASSES[size];

  const showImage = hasValidUrl && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold rounded-full overflow-hidden shrink-0 select-none ${sizeClass} ${className}`}
    >
      {showImage ? (
        <img
          src={avatarUrl || undefined}
          alt={displayName}
          {...imgProps}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
