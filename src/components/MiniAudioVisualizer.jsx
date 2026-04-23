import React, { useRef, useEffect } from "react";

/**
 * MiniAudioVisualizer
 *
 * A compact, inline frequency-bar visualizer that only renders while
 * the song is playing.  It uses a plain <canvas> — no WebGL / R3F
 * dependency required — so it fits neatly inside the music-player card.
 *
 * Props
 * ─────
 * analyser  – Web Audio AnalyserNode (null when not yet initialised)
 * isPlaying – boolean that controls visibility
 */
export const MiniAudioVisualizer = ({ analyser, isPlaying }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // ── DPI-aware sizing ───────────────────────────────────────────────
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const BAR_COUNT = 40;
    const GAP = 2;
    const barW = (W - GAP * (BAR_COUNT - 1)) / BAR_COUNT;

    // Smoothed values so bars glide rather than snap
    const smoothed = new Float32Array(BAR_COUNT).fill(0);
    const SMOOTHING = 0.72; // 0 = instant, 1 = never moves

    // Colour gradient – cyan → purple matching the site palette
    const gradient = ctx.createLinearGradient(0, 0, W, 0);
    gradient.addColorStop(0, "#22d3ee");   // cyan-400
    gradient.addColorStop(0.5, "#a855f7"); // purple-500
    gradient.addColorStop(1, "#ec4899");   // pink-500

    let dataArray = analyser
      ? new Uint8Array(analyser.frequencyBinCount)
      : null;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (!analyser || !isPlaying) {
        // Draw silent flat bars when paused / not initialised
        const silentH = 2;
        ctx.fillStyle = "rgba(100,116,139,0.25)"; // slate-500 dim
        for (let i = 0; i < BAR_COUNT; i++) {
          const x = i * (barW + GAP);
          const y = H / 2 - silentH / 2;
          ctx.beginPath();
          ctx.roundRect(x, y, barW, silentH, 1);
          ctx.fill();
        }
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      // Map FFT bins → bar count (focus on lower 60 % of spectrum)
      const usableBins = Math.floor(dataArray.length * 0.6);
      const binPerBar = usableBins / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        const start = Math.floor(i * binPerBar);
        const end = Math.floor((i + 1) * binPerBar);
        for (let j = start; j < end; j++) sum += dataArray[j];
        const avg = sum / (end - start);

        // Smooth
        smoothed[i] = smoothed[i] * SMOOTHING + avg * (1 - SMOOTHING);

        const bH = Math.max(2, (smoothed[i] / 255) * H);
        const x = i * (barW + GAP);
        const y = H - bH;

        // Glow
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = smoothed[i] > 80 ? 8 : 3;

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, bH, [2, 2, 0, 0]);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isPlaying]);

  // Only take up space in the layout when playing
  if (!isPlaying && !analyser) return null;

  return (
    <div
      style={{
        width: "100%",
        height: 70,
        borderRadius: 30,
        overflow: "hidden",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(34,211,238,0.15)",
        boxShadow: isPlaying
          ? "0 0 12px rgba(34,211,238,0.12), inset 0 0 8px rgba(168,85,247,0.08)"
          : "none",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
