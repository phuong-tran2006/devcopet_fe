import React from "react";
import petVideo from "../../../../assets/videos/conpet.mp4";

interface AiHelperFabProps {
  setPanelState: (state: "collapsed" | "expanded") => void;
  aiPrimary: string;
  fabVideoRef: React.RefObject<HTMLVideoElement>;
}

export function AiHelperFab({
  setPanelState,
  aiPrimary,
  fabVideoRef,
}: AiHelperFabProps) {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="green-screen-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1   0    0   0   0
                    0   1    0   0   0
                    0   0    1   0   0
                    1.5 -3   1.5 1  -0.1"
          />
        </filter>
      </svg>
      <button
        id="ai-helper-fab"
        onClick={() => setPanelState("expanded")}
        onMouseEnter={() => {
          if (fabVideoRef.current) {
            fabVideoRef.current.currentTime = 0;
            fabVideoRef.current.play().catch(() => {});
          }
        }}
        className="ai-helper-fab group fixed bottom-24 right-8 z-[110] flex h-[100px] w-[100px] items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_8px_16px_rgba(168,85,247,0.5)]"
        aria-label="Open AI Helper"
      >
        <div
          className="absolute -top-6 -left-16 z-10 w-max origin-bottom-right rounded-2xl rounded-br-sm px-3.5 py-1.5 text-[12px] font-extrabold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `1px solid ${aiPrimary}60`,
            backdropFilter: "blur(4px)",
          }}
        >
          Ask me!
        </div>

        <video
          ref={fabVideoRef}
          src={`${petVideo}?v=4`}
          autoPlay
          muted
          playsInline
          className="h-[140%] w-[140%] max-w-none object-contain pointer-events-none"
          style={{
            filter: "url(#green-screen-filter)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 60%, transparent 95%)",
            maskImage:
              "radial-gradient(circle at center, black 60%, transparent 95%)",
          }}
        />
      </button>
    </>
  );
}
