import React from "react";
import { HiOutlineSparkles } from "react-icons/hi2";

interface Props {
  message?: string;
}

const Loader: React.FC<Props> = ({ message }) => {
  const label = message || "Loading";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="fsl-root fixed inset-0 z-[60] flex h-full items-center justify-center bg-[#05070a]/75 backdrop-blur-xl"
    >
      <style>{`
        @keyframes fsl-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fsl-rise { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes fsl-spin { to { transform: rotate(360deg); } }
        @keyframes fsl-morph {
          0%, 100% { border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
          25%      { border-radius: 42% 58% 38% 62% / 60% 40% 62% 38%; }
          50%      { border-radius: 52% 48% 63% 37% / 40% 62% 38% 60%; }
          75%      { border-radius: 38% 62% 46% 54% / 55% 38% 62% 45%; }
        }
        @keyframes fsl-breathe { 0%, 100% { transform: scale(.94); } 50% { transform: scale(1.06); } }
        @keyframes fsl-glow { 0%, 100% { opacity: .5; transform: scale(.95); } 50% { opacity: .9; transform: scale(1.12); } }
        @keyframes fsl-ripple { 0% { transform: scale(1); opacity: .45; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes fsl-twinkle { 0%, 100% { transform: scale(.9) rotate(-8deg); opacity: .9; } 50% { transform: scale(1.12) rotate(8deg); opacity: 1; } }
        @keyframes fsl-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes fsl-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }
        @keyframes fsl-swap { from { opacity: 0; transform: translateY(6px); filter: blur(4px); } to { opacity: 1; transform: none; filter: blur(0); } }

        .fsl-root { animation: fsl-in .3s ease-out both; }
        .fsl-stage { animation: fsl-rise .5s cubic-bezier(.2,.8,.2,1) both; }

        .fsl-glow {
          position: absolute; inset: -28px; border-radius: 9999px; filter: blur(36px);
          background: radial-gradient(circle, rgba(34,211,238,.55), rgba(139,92,246,.4) 55%, transparent 72%);
          animation: fsl-glow 3.2s ease-in-out infinite;
        }

        .fsl-ripple {
          position: absolute; inset: 34px; border-radius: 9999px;
          border: 1px solid rgba(34,211,238,.5);
          animation: fsl-ripple 3s cubic-bezier(.2,.6,.3,1) infinite;
        }
        .fsl-ripple.b { animation-delay: 1.5s; border-color: rgba(167,139,250,.5); }

        .fsl-orbit { position: absolute; border-radius: 9999px; border: 1px solid rgba(148,163,184,.14); }
        .fsl-orbit::before {
          content: ""; position: absolute; inset: -1px; border-radius: 9999px;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
        }
        .fsl-orbit.a { inset: 0; animation: fsl-spin 2.8s linear infinite; }
        .fsl-orbit.a::before { background: conic-gradient(from 0deg, transparent 0 55%, rgba(34,211,238,.9) 100%); }
        .fsl-orbit.b { inset: 14px; animation: fsl-spin 4.4s linear infinite reverse; }
        .fsl-orbit.b::before { background: conic-gradient(from 0deg, transparent 0 65%, rgba(167,139,250,.9) 100%); }

        .fsl-comet {
          position: absolute; top: -4px; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 9999px;
          background: #fff; box-shadow: 0 0 10px 2px rgba(34,211,238,.9), 0 0 22px 6px rgba(34,211,238,.45);
        }
        .fsl-orbit.b .fsl-comet {
          width: 6px; height: 6px; margin-left: -3px; top: -3px;
          box-shadow: 0 0 10px 2px rgba(167,139,250,.9), 0 0 20px 5px rgba(167,139,250,.45);
        }

        .fsl-core { position: absolute; inset: 34px; animation: fsl-breathe 3.2s ease-in-out infinite; }
        .fsl-blob {
          position: absolute; inset: 0;
          background: conic-gradient(from 0deg, #22d3ee, #6366f1, #a78bfa, #22d3ee);
          box-shadow: 0 0 36px rgba(34,211,238,.55), inset 0 0 18px rgba(255,255,255,.25);
          animation: fsl-morph 6s ease-in-out infinite, fsl-spin 9s linear infinite;
        }
        .fsl-gloss {
          position: absolute; inset: 0; border-radius: 9999px; pointer-events: none;
          background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.65), rgba(255,255,255,0) 42%);
        }
        .fsl-icon { animation: fsl-twinkle 2.6s ease-in-out infinite; }

        .fsl-text {
          background: linear-gradient(110deg, #8b9bb4 30%, #ffffff 50%, #8b9bb4 70%);
          background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: fsl-sheen 3s linear infinite, fsl-swap .45s ease-out both;
        }

        .fsl-bar { position: relative; overflow: hidden; width: 7rem; height: 2px; border-radius: 9999px; background: rgba(148,163,184,.15); }
        .fsl-bar::after {
          content: ""; position: absolute; inset: 0; width: 38%; border-radius: 9999px;
          background: linear-gradient(90deg, transparent, #22d3ee, #a78bfa, transparent);
          animation: fsl-slide 1.6s cubic-bezier(.6,.1,.4,.9) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fsl-orbit.a { animation-duration: 12s; }
          .fsl-orbit.b { animation-duration: 18s; }
          .fsl-blob { animation: none; }
          .fsl-glow, .fsl-ripple, .fsl-core, .fsl-icon, .fsl-text, .fsl-bar::after { animation: none; }
          .fsl-text { color: #cbd5e1; background: none; -webkit-text-fill-color: #cbd5e1; }
          .fsl-bar::after { transform: translateX(110%); }
        }
      `}</style>

      <div className="fsl-stage flex flex-col items-center">
        <div className="relative h-32 w-32">
          <div className="fsl-glow" />
          <span className="fsl-ripple" />
          <span className="fsl-ripple b" />

          <div className="fsl-orbit a">
            <span className="fsl-comet" />
          </div>
          <div className="fsl-orbit b">
            <span className="fsl-comet" />
          </div>

          <div className="fsl-core">
            <div className="fsl-blob" />
            <div className="fsl-gloss" />
            <div className="absolute inset-0 grid place-items-center text-white">
              <span className="fsl-icon drop-shadow-[0_0_8px_rgba(255,255,255,.8)]">
                <HiOutlineSparkles size={26} />
              </span>
            </div>
          </div>
        </div>

        <p
          key={label}
          className="fsl-text mt-10 text-lg font-semibold tracking-tight"
        >
          {label}
        </p>
        <div className="fsl-bar mt-4" aria-hidden />
      </div>
    </div>
  );
};

export default Loader;