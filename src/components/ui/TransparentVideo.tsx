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
  keyColor = [12, 15, 18], // Default background color of the mascot video
  tolerance = 35,
}: TransparentVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      if (canvas.width > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const [kr, kg, kb] = keyColor;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate color difference (Manhattan distance)
          const diff = Math.abs(r - kr) + Math.abs(g - kg) + Math.abs(b - kb);

          if (diff < tolerance) {
            data[i + 3] = 0; // Make alpha transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    video.addEventListener("play", render);
    if (!video.paused) {
      render();
    } else {
      // Explicitly try to play
      video
        .play()
        .catch((err) => console.warn("TransparentVideo play failed:", err));
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("play", render);
    };
  }, [keyColor, tolerance]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} className="w-full h-auto object-contain" />
    </div>
  );
};

export default TransparentVideo;
