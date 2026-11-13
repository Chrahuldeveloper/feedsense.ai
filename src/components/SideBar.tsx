"use client";
import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import ModelLogout from "./ModelLogout";
import Link from "next/link";
import { CgWebsite } from "react-icons/cg";
import { IoMdHelpCircle } from "react-icons/io";
import { HiOutlineSparkles } from "react-icons/hi2";

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.fs-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fs-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(60px,30px,0) scale(1.15)}}
@keyframes fs-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-50px,-30px,0) scale(0.95)}}
@keyframes fs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fs-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fs-drift-a{animation:fs-drift-a 14s ease-in-out infinite}
.fs-drift-b{animation:fs-drift-b 18s ease-in-out infinite}
.fs-rise{animation:fs-rise .7s cubic-bezier(.2,.7,.2,1) both}
.fs-gradient-text{background:linear-gradient(110deg,#ffffff 15%,#67e8f9 50%,#c4b5fd 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
.fs-btn{background-image:linear-gradient(110deg,#22d3ee 0%,#818cf8 50%,#22d3ee 100%);background-size:200% 100%}
.fs-btn:hover{animation:fs-sheen 2.4s linear infinite}
.fs-grid{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:44px 44px}
@media (prefers-reduced-motion:reduce){.fs-drift-a,.fs-drift-b,.fs-rise,.fs-btn:hover{animation:none!important}}
`}</style>
);


interface props {
  page: string;
}

const SideBar: React.FC<props> = ({ page }) => {
  const [toggle, settoggle] = useState(false);

  const iconSize = 20;

  const links = [
    { href: "/dashboard", key: "Home", label: "Home", icon: MdDashboard },
    {
      href: "/dashboard/integrate",
      key: "Integrate",
      label: "Integrate",
      icon: CgWebsite,
    },
    {
      href: "/dashboard/contact",
      key: "Contact",
      label: "Help",
      icon: IoMdHelpCircle,
    },
  ];

  return (
    <>
      <Theme />
      <aside className="fs-root fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col overflow-hidden border-r border-white/[0.07] bg-[#07090d]/90 px-4 py-6 backdrop-blur-2xl md:flex">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-60 w-60 rounded-full bg-violet-600/15 blur-[80px]" />

        <Link
          href="/dashboard"
          className="relative flex items-center gap-3 px-2"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b] shadow-[0_0_30px_-4px_rgba(34,211,238,0.8)]">
            <HiOutlineSparkles size={22} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#06080b]">
            FeedSense<span className="text-cyan-400">AI</span>
          </span>
        </Link>

        <nav className="relative mt-10 flex flex-col gap-1.5">
          <p className="mb-2 px-3 text-xs font-semibold text-slate-600">
            Menu
          </p>
          {links.map(({ href, key, label, icon: Icon }) => {
            const active = page === key;
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-400/20 via-cyan-400/5 to-transparent text-[#06080b] ring-1 ring-inset ring-cyan-400/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-[#06080b]"
                }`}
              >
                {active && (
                  <span className="absolute -left-4 bottom-2 top-2 w-[3px] rounded-r-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
                )}
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg ${
                    active
                      ? "bg-cyan-400/20 text-cyan-300"
                      : "bg-white/[0.04] text-slate-400"
                  }`}
                >
                  <Icon size={iconSize} />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto space-y-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-4">
            <p className="text-sm font-bold text-[#06080b]">Need a hand?</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Our team can help you set up your integration.
            </p>
            <Link
              href="/dashboard/contact"
              className="mt-3 inline-block rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#06080b] transition hover:bg-white/20"
            >
              Contact support
            </Link>
          </div>

          <button
            onClick={() => settoggle(true)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 ${
              page === "Logout" ? "bg-red-500/10 text-red-400" : ""
            }`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
              <IoLogOut size={iconSize} />
            </span>
            Logout
          </button>
        </div>
      </aside>
      {toggle ? <ModelLogout settoggle={settoggle} /> : null}
    </>
  );
};

export default SideBar;