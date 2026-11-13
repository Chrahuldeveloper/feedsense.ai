import React from "react";
import { HiOutlineSparkles } from "react-icons/hi2";

interface props {
  message: string;
}

const Loader: React.FC<props> = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex h-full items-center justify-center bg-[#05070a]/70 backdrop-blur-md"
    >
      <style>{`
        @keyframes fsl-spin { to { transform: rotate(360deg); } }
        @keyframes fsl-pulse { 0%,100% { transform: scale(.92); opacity:.75; } 50% { transform: scale(1.08); opacity:1; } }
        @keyframes fsl-halo { 0%,100% { transform: scale(.9); opacity:.45; } 50% { transform: scale(1.15); opacity:.85; } }
        @keyframes fsl-dot { 0%,80%,100% { transform: translateY(0); opacity:.35; } 40% { transform: translateY(-5px); opacity:1; } }
        @keyframes fsl-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .fsl-ring, .fsl-ring2 {
          position:absolute; border-radius:9999px;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
        }
        .fsl-ring { inset:0; background: conic-gradient(from 0deg, transparent 0 30%, #22d3ee 62%, #a78bfa 88%, transparent); animation: fsl-spin 1.4s linear infinite; }
        .fsl-ring2 { inset:14px; background: conic-gradient(from 180deg, transparent 0 35%, #a78bfa 65%, #22d3ee 90%, transparent); animation: fsl-spin 2.2s linear infinite reverse; opacity:.75; }
        .fsl-halo { animation: fsl-halo 2.4s ease-in-out infinite; }
        .fsl-orb { animation: fsl-pulse 2.4s ease-in-out infinite; }
        .fsl-text { background: linear-gradient(110deg,#94a3b8 30%,#ffffff 50%,#94a3b8 70%); background-size:200% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation: fsl-sheen 3s linear infinite; }
        .fsl-dot { animation: fsl-dot 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fsl-ring { animation-duration: 6s; } .fsl-ring2 { animation-duration: 9s; }
          .fsl-halo, .fsl-orb, .fsl-text, .fsl-dot { animation: none; }
        }
      `}</style>

      <div className="flex flex-col items-center">
        <div className="relative h-28 w-28">
          <div className="fsl-halo absolute -inset-6 rounded-full bg-gradient-to-br from-cyan-400/40 to-violet-500/40 blur-2xl" />
          <div className="fsl-ring" />
          <div className="fsl-ring2" />
          <div className="fsl-orb absolute inset-[32px] grid place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-[0_0_40px_rgba(34,211,238,0.6)]">
            <HiOutlineSparkles size={22} />
          </div>
        </div>

        <p className="fsl-text mt-9 text-lg font-semibold tracking-tight">
          {message || "Loading"}
        </p>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="fsl-dot h-1.5 w-1.5 rounded-full bg-cyan-300"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;