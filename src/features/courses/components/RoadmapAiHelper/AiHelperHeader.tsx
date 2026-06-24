import React from "react";
import { Zap, Ban, Minus } from "lucide-react";
import petVideo from "../../../../assets/videos/conpet.mp4";
import type { AiUsage } from "../../api/aiChat.api";

interface AiHelperHeaderProps {
  user: any;
  nodeTitle: string;
  usage: AiUsage | null;
  accentColor: string;
  aiPrimary: string;
  headerBgGradient: string;
  setPanelState: (state: "collapsed" | "expanded") => void;
  headerVideoRef: React.RefObject<HTMLVideoElement>;
}

export function AiHelperHeader({
  user,
  nodeTitle,
  usage,
  accentColor,
  aiPrimary,
  headerBgGradient,
  setPanelState,
  headerVideoRef,
}: AiHelperHeaderProps) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="green-screen-filter-panel" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1   0    0   0   0
                  0   1    0   0   0
                  0   0    1   0   0
                  1.5 -3   1.5 1  -0.1"
          />
        </filter>
      </svg>
      <div
        className="flex shrink-0 items-center gap-3 border-b px-5 py-4"
        style={{
          borderColor: `${aiPrimary}25`,
          background: headerBgGradient,
        }}
      >
        <div
          className="relative flex h-10 w-10 shrink-0 items-center justify-center cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => {
            if (headerVideoRef.current) {
              headerVideoRef.current.currentTime = 0;
              headerVideoRef.current.play().catch(() => {});
            }
          }}
        >
          <video
            ref={headerVideoRef}
            src={`${petVideo}?v=4`}
            autoPlay
            muted
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150%] w-[150%] max-w-none object-contain pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={{
              filter: "url(#green-screen-filter-panel)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 50%, transparent 80%)",
              maskImage:
                "radial-gradient(circle at center, black 50%, transparent 80%)",
            }}
          />
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <span className="text-[15px] font-extrabold text-white truncate">
            {user
              ? `${user.name || user.username || "User"}'s Pet Helper`
              : "Pet Helper"}
          </span>
          <span className="text-[11px] font-medium text-on-surface-variant truncate">
            {nodeTitle}
          </span>
        </div>

        {usage && (
          <div
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{
              borderColor:
                usage.remaining > 0
                  ? `${accentColor}40`
                  : "rgba(239,68,68,0.4)",
              backgroundColor:
                usage.remaining > 0
                  ? `${accentColor}15`
                  : "rgba(239,68,68,0.1)",
            }}
          >
            {usage.remaining > 0 ? (
              <Zap
                size={13}
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              />
            ) : (
              <Ban
                size={13}
                style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
              />
            )}
            <span
              className="text-[10px] font-bold tracking-wide"
              style={{ color: usage.remaining > 0 ? accentColor : "#ef4444" }}
            >
              {usage.remaining}/{usage.dailyLimit}
            </span>
          </div>
        )}

        <button
          onClick={() => setPanelState("collapsed")}
          className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          aria-label="Minimize Pet Helper"
        >
          <Minus size={18} />
        </button>
      </div>
    </>
  );
}
