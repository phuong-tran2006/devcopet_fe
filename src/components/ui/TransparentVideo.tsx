import { useEffect, useRef } from "react";

interface TransparentVideoProps {
  src: string;
  className?: string;
  keyColor?: [number, number, number]; // [r, g, b]
  tolerance?: number;
}

const TransparentVideo = ({
  src,
  className = "",
  keyColor = [12, 15, 18],
  tolerance = 35,
}: TransparentVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const [kr, kg, kb] = keyColor;
    const isGreenScreen = kg > kr && kg > kb;

    const processFrame = () => {
      if (!video.paused && !video.ended && video.videoWidth > 0) {
        // Asymmetric crop: wider on left/right to remove black bars, no crop on top/bottom
        const insetX = 16; // left/right crop
        const insetY = 0; // no top/bottom crop — keep full height
        const srcW = video.videoWidth - insetX * 2;
        const srcH = video.videoHeight - insetY * 2;

        // Sync canvas dimensions to cropped size
        if (canvas.width !== srcW || canvas.height !== srcH) {
          canvas.width = srcW;
          canvas.height = srcH;
        }

        // Draw cropped region of video onto canvas
        ctx.drawImage(video, insetX, insetY, srcW, srcH, 0, 0, srcW, srcH);

        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (isGreenScreen) {
              const greenOverRed = g - r;
              const greenOverBlue = g - b;
              const minDominance = Math.min(greenOverRed, greenOverBlue);

              if (minDominance > tolerance) {
                data[i + 3] = 0;
              } else if (minDominance > tolerance * 0.4) {
                const factor =
                  (minDominance - tolerance * 0.4) / (tolerance * 0.6);
                data[i + 3] = Math.round(255 * (1 - factor));
              }
            } else {
              const diff =
                Math.abs(r - kr) + Math.abs(g - kg) + Math.abs(b - kb);
              if (diff < tolerance) {
                data[i + 3] = 0;
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
        } catch {
          // Canvas tainted — just draw without chroma key
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    // Start rendering as soon as video can play
    const startRender = () => {
      video.play().catch(() => {});
      processFrame();
    };

    if (video.readyState >= 2) {
      startRender();
    } else {
      video.addEventListener("canplay", startRender, { once: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      video.removeEventListener("canplay", startRender);
    };
  }, [keyColor, tolerance]);

  return (
    <div className={`relative ${className}`}>
      {/* Video is visually hidden but still needs to be in the layout flow for decoding */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-contain"
        style={{
          maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 85%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default TransparentVideo;
