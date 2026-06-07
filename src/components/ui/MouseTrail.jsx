import React, { useEffect, useRef } from 'react';

const MouseTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const themeColors = [
      { rgb: '77, 182, 172', hex: '#4db6ac' },  // Primary (bright teal)
      { rgb: '216, 191, 216', hex: '#D8BFD8' }, // Secondary (thistle)
      { rgb: '135, 169, 107', hex: '#87A96B' }  // Tertiary (sage green)
    ];

    const handleMouseMove = (e) => {
      const randomColor = themeColors[Math.floor(Math.random() * themeColors.length)];
      particles.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: Math.random() * 2 + 1,
        color: randomColor,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.alpha -= 0.02; // Fading speed
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.rgb}, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color.hex;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

export default MouseTrail;
