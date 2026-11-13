import React from "react";
import Link from "next/link";
import { LuBrain } from "react-icons/lu";
import { FiArrowUpRight } from "react-icons/fi";

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#05070a] text-slate-300">
      {/* top hairline + glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 pb-16 pt-20 sm:px-8 lg:grid-cols-5 lg:px-10">
        {/* Brand */}
        <div className="col-span-2 flex flex-col items-start">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a] shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)]">
              <LuBrain size={24} />
            </span>
            <h3 className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              FeedSenseAI
            </h3>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Transform user feedback into actionable insights with the power of
            AI.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Product
          </h4>
          <ul className="space-y-3">
            {["Dashboard", "Feedback", "Insights", "Integration"].map((item) => (
              <li key={item}>
                <a href="#" className={linkClass}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Company
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className={linkClass}>
                About
                <FiArrowUpRight
                  size={14}
                  className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </li>
            <li>
              <Link href="/contactUs" className={linkClass}>
                Contact
                <FiArrowUpRight
                  size={14}
                  className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Support
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/contactUs" className={linkClass}>
                Help Center
                <FiArrowUpRight
                  size={14}
                  className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* giant wordmark */}
      <div
        aria-hidden
        className="pointer-events-none relative -mb-[3.5vw] select-none overflow-hidden px-4 text-center [mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]"
      >
        <span className="block bg-gradient-to-b from-white/[0.14] to-transparent bg-clip-text text-[17vw] font-extrabold leading-[0.9] tracking-tighter text-transparent">
          FeedSenseAI
        </span>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/[0.07] py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} FeedSenseAI. All rights reserved.
      </div>
    </footer>
  );
}