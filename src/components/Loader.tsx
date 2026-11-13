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
      className="fsl-overlay fixed inset-0 z-[60] flex h-full items-center justify-center bg-[#09090b]/85 backdrop-blur-xl"
    >
      <style>{`
        @keyframes fsl-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fsl-rise { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes fsl-spin { to { transform: rotate(360deg); } }
        @keyframes fsl-slide { 0% { transform: translateX(-110%); } 100% { transform: translateX(360%); } }
        @keyframes fsl-breathe { 0%,100% { opacity: .9; } 50% { opacity: 1; } }
        .fsl-overlay { animation: fsl-in .25s ease-out both; }
        .fsl-stage { animation: fsl-rise .5s cubic-bezier(.2,.7,.2,1) .05s both; }
        .fsl-arc {
          position: absolute; inset: -14px; border-radius: 9999px;
          background: conic-gradient(from 0deg, rgba(129,140,248,0) 0%, rgba(129,140,248,0) 35%, rgba(165,180,252,.55) 80%, #e0e7ff 100%);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
          animation: fsl-spin 1.25s linear infinite;
        }
        .fsl-bar { animation: fsl-slide 1.4s cubic-bezier(.65,0,.35,1) infinite; }
        .fsl-mark { animation: fsl-breathe 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fsl-arc { animation-duration: 6s; }
          .fsl-bar { animation-duration: 4s; }
          .fsl-mark, .fsl-stage, .fsl-overlay { animation: none; }
        }
      `}</style>

      <div className="fsl-stage flex flex-col items-center">
        {/* mark with a hairline orbit */}
        <div className="relative h-[72px] w-[72px]">
          <span className="absolute inset-[-14px] rounded-full border border-white/[0.07]" />
          <span className="fsl-arc" />
          <div className="fsl-mark grid h-full w-full place-items-center rounded-[20px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-white">
            <HiOutlineSparkles size={28} />
          </div>
        </div>

        <p className="mt-10 text-[15px] font-medium tracking-tight text-zinc-200">
          {message || "Loading"}
        </p>

        {/* indeterminate progress hairline */}
        <div
          aria-hidden
          className="mt-5 h-[2px] w-44 overflow-hidden rounded-full bg-white/[0.08]"
        >
          <span className="fsl-bar block h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
        </div>
      </div>

      <p
        aria-hidden
        className="absolute bottom-8 text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-600"
      >
        FeedSense.ai
      </p>
    </div>
  );
};

export default Loader;