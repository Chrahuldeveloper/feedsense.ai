import React from "react";
import Link from "next/link";
import { LuBrain } from "react-icons/lu";
import { FiArrowUpRight } from "react-icons/fi";

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#09090b] text-zinc-300">
      {/* top hairline + glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      
      

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 pb-16 pt-20 sm:px-8 lg:grid-cols-5 lg:px-10">
        {/* Brand */}
        <div className="col-span-2 flex flex-col items-start">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl text-white bg-indigo-500">
              <LuBrain size={24} />
            </span>
            <h3 className=" text-2xl font-bold tracking-tight text-indigo-300">
              FeedSenseAI
            </h3>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">
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
        <span className="block text-[17vw] font-semibold leading-[0.9] tracking-tighter text-white/[0.05]">
          FeedSenseAI
        </span>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/[0.07] py-5 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} FeedSenseAI. All rights reserved.
      </div>
    </footer>
  );
}