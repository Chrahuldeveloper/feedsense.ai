"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CiGlobe, CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ModelLogout from "./ModelLogout";
import { IoCodeOutline } from "react-icons/io5";
import { BsTrash2 } from "react-icons/bs";
import {
  FiArrowUpRight,
  FiLink,
  FiType,
  FiCheck,
  FiPlus,
  FiLayers,
  FiChevronDown,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fs-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.fs-rise{animation:fs-rise .7s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.fs-rise{animation:none!important}}
`}</style>
);

/* Card with a thin hairline border */
const GlowCard = ({
  children,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) => (
  <div className={`relative rounded-2xl bg-white/10 p-px ${className}`}>
    <div
      className={`relative h-full overflow-hidden rounded-[15px] bg-[#111113]/95 backdrop-blur-xl ${innerClassName}`}
    >
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

interface Website {
  id: string;
  name: string;
  url?: string;
  type?: string;
  image?: string;
}

interface WebsiteDataInput {
  name: string;
  url: string;
  type: string;
  logo?: File | null;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
}

/* UI-only class tokens */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/60 focus:bg-black/60 focus:ring-4 focus:ring-indigo-400/10";
const labelClass = "mb-2 block text-sm font-semibold text-zinc-300";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500";
const avatarGradients = [
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-sky-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
];

/* =====================================================================
   WIDGET STUDIO
   Each widget is plain HTML + scoped CSS (no scripts, no dependencies).
   The preview renders it as-is, and "Copy code" turns the same markup into
   a paste-ready React snippet. Accent colour and screen side are live.
   ===================================================================== */
type Side = "left" | "right";

interface Widget {
  id: string;
  name: string;
  desc: string;
  css: string;
  html: string;
}

const ACCENTS = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Mono", hex: "#e4e4e7" },
];

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const mix = (h: string, to: string, t: number) => {
  const a = hexToRgb(h);
  const b = hexToRgb(to);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `#${[c(a.r, b.r), c(a.g, b.g), c(a.b, b.b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
};

/* custom properties every widget reads, derived from one accent colour */
const palette = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return [
    `--fw:${hex}`,
    `--fw2:${mix(hex, "#ffffff", 0.38)}`,
    `--fw-dark:${mix(hex, "#000000", 0.32)}`,
    `--fw3:rgba(${r},${g},${b},.5)`,
    `--fw-soft:rgba(${r},${g},${b},.22)`,
    `--fw-ink:${lum > 0.6 ? "#0a0a0a" : "#ffffff"}`,
  ].join(";");
};

const CHAT = (size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 6.6l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="currentColor" stroke="none"/></svg>`;

const ARROW = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

const STAR = `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>`;

/* shared: isolation from the host site, entrance animation, reduced motion */
const base = (p: string, pos: string, vars: string) =>
  `@keyframes ${p}-in{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.${p}{all:initial;position:fixed;${pos};${vars};z-index:2147483000;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;animation:${p}-in .7s cubic-bezier(.22,1,.36,1) .4s both}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} a{text-decoration:none;color:inherit;cursor:pointer}
@media (prefers-reduced-motion:reduce){.${p},.${p} *,.${p} *::before,.${p} *::after{animation:none!important;transition:none!important}}`;

const A = (cls: string, label = "Open feedback form") =>
  `<a href="__URL__" target="_blank" rel="noopener noreferrer" class="${cls}" aria-label="${label}">`;

const makeWidgets = (side: Side, accent: string): Widget[] => {
  const v = palette(accent);
  const corner = `${side}:24px;bottom:24px`;
  const rtl = side === "right";

  return [
    /* 1 ─ Aurora: glass pill with a travelling light border */
    {
      id: "aurora",
      name: "Aurora",
      desc: "Glass pill with a travelling light border",
      css:
        base("fwa", corner, v) +
        `
@keyframes fwa-spin{to{transform:rotate(360deg)}}
.fwa-btn{position:relative;display:inline-flex;padding:1px;border-radius:999px;overflow:hidden;isolation:isolate;background:rgba(255,255,255,.1);box-shadow:0 18px 40px -14px rgba(0,0,0,.65);transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s}
.fwa-btn::before{content:"";position:absolute;left:50%;top:50%;width:320px;height:320px;margin:-160px 0 0 -160px;background:conic-gradient(from 0deg,transparent 0 60%,var(--fw) 80%,var(--fw2) 92%,transparent 100%);animation:fwa-spin 3.4s linear infinite}
.fwa-in{position:relative;display:flex;align-items:center;gap:10px;height:46px;padding:0 18px 0 8px;border-radius:999px;color:#fff;background:linear-gradient(180deg,#1b1b21,#0d0d10)}
.fwa-ico{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;color:var(--fw-ink);background:linear-gradient(135deg,var(--fw2),var(--fw));box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 4px 14px -2px var(--fw3)}
.fwa-ico svg{display:block;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fwa-label{font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1}
.fwa-arrow{display:grid;place-items:center;width:0;margin-left:-6px;opacity:0;transition:width .35s cubic-bezier(.22,1,.36,1),opacity .3s,margin .35s}
.fwa-btn:hover{transform:translateY(-2px);box-shadow:0 22px 48px -14px rgba(0,0,0,.7),0 0 0 5px var(--fw-soft)}
.fwa-btn:hover .fwa-arrow{width:14px;margin-left:0;opacity:1}
.fwa-btn:hover .fwa-ico svg{transform:rotate(-10deg) scale(1.1)}
.fwa-btn:active{transform:scale(.97)}
.fwa-btn:focus-visible{outline:2px solid var(--fw);outline-offset:4px}
@media (max-width:640px){.fwa-label,.fwa-arrow{display:none}.fwa-in{width:50px;height:50px;padding:0;justify-content:center}}`,
      html: `<div class="fwa">${A("fwa-btn")}<span class="fwa-in"><span class="fwa-ico">${CHAT(16)}</span><span class="fwa-label">Feedback</span><span class="fwa-arrow">${ARROW}</span></span></a></div>`,
    },

    /* 2 ─ Orb: glossy sphere with a double ripple */
    {
      id: "orb",
      name: "Pulse orb",
      desc: "Glossy sphere with a soft double ripple",
      css:
        base("fwb", corner, v) +
        `
@keyframes fwb-ring{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.9);opacity:0}}
.fwb-btn{position:relative;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;color:var(--fw-ink);background:radial-gradient(120% 120% at 30% 18%,var(--fw2),var(--fw) 55%,var(--fw-dark));box-shadow:0 16px 36px -10px var(--fw3),inset 0 1px 0 rgba(255,255,255,.5),inset 0 -8px 14px rgba(0,0,0,.18);transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s}
.fwb-btn::before,.fwb-btn::after{content:"";position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--fw);opacity:0;animation:fwb-ring 3s ease-out infinite}
.fwb-btn::after{animation-delay:1.5s}
.fwb-btn svg{display:block;position:relative;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fwb-btn:hover{transform:scale(1.07);box-shadow:0 22px 44px -10px var(--fw3),inset 0 1px 0 rgba(255,255,255,.6),inset 0 -8px 14px rgba(0,0,0,.18)}
.fwb-btn:hover svg{transform:rotate(-10deg) scale(1.08)}
.fwb-btn:active{transform:scale(.94)}
.fwb-btn:focus-visible{outline:2px solid var(--fw);outline-offset:4px}
.fwb-tip{position:absolute;${rtl ? "right" : "left"}:calc(100% + 14px);top:50%;transform:translateY(-50%) translateX(${rtl ? 6 : -6}px);opacity:0;padding:8px 13px;border-radius:11px;color:#fafafa;background:#18181b;border:1px solid rgba(255,255,255,.1);box-shadow:0 12px 28px -10px rgba(0,0,0,.6);font-size:12.5px;font-weight:600;white-space:nowrap;pointer-events:none;transition:opacity .25s,transform .35s cubic-bezier(.22,1,.36,1)}
.fwb-btn:hover .fwb-tip,.fwb-btn:focus-visible .fwb-tip{opacity:1;transform:translateY(-50%)}`,
      html: `<div class="fwb">${A("fwb-btn")}<span class="fwb-tip">Share feedback</span>${CHAT(25)}</a></div>`,
    },

    /* 3 ─ Dock: a circle that unfolds on hover */
    {
      id: "dock",
      name: "Unfold dock",
      desc: "Compact circle that unfolds into a pill",
      css:
        base("fwc", corner, v) +
        `
.fwc-dock{display:flex;align-items:center;gap:10px;height:52px;width:52px;padding:0 9px;border-radius:999px;overflow:hidden;color:#fff;background:rgba(18,18,22,.78);backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);border:1px solid rgba(255,255,255,.12);box-shadow:0 16px 38px -14px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.1);transition:width .55s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .4s}
.fwc-ico{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;color:var(--fw-ink);background:linear-gradient(135deg,var(--fw2),var(--fw));box-shadow:0 4px 14px -2px var(--fw3)}
.fwc-ico svg{display:block}
.fwc-txt{flex:none;white-space:nowrap;font-size:13.5px;font-weight:600;letter-spacing:-.01em;opacity:0;transform:translateX(${rtl ? 8 : -8}px);transition:opacity .35s .12s,transform .5s .06s cubic-bezier(.22,1,.36,1)}
.fwc-dock:hover,.fwc-dock:focus-visible{width:184px;border-color:rgba(255,255,255,.24);box-shadow:0 20px 44px -14px rgba(0,0,0,.75),0 0 0 5px var(--fw-soft),inset 0 1px 0 rgba(255,255,255,.14)}
.fwc-dock:hover .fwc-txt,.fwc-dock:focus-visible .fwc-txt{opacity:1;transform:none}
.fwc-dock:focus-visible{outline:2px solid var(--fw);outline-offset:4px}`,
      html: `<div class="fwc">${A("fwc-dock")}<span class="fwc-ico">${CHAT(16)}</span><span class="fwc-txt">Give feedback</span></a></div>`,
    },

    /* 4 ─ Rating card: one-tap stars */
    {
      id: "rating",
      name: "Rating card",
      desc: "One-tap stars with a gentle fill effect",
      css:
        base("fwd", corner, v) +
        `
.fwd-card{width:292px;padding:16px;border-radius:20px;color:#fafafa;background:rgba(17,17,20,.9);backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5);border:1px solid rgba(255,255,255,.1);box-shadow:0 28px 64px -22px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.08)}
.fwd-top{display:flex;align-items:center;gap:11px}
.fwd-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;color:var(--fw-ink);background:linear-gradient(135deg,var(--fw2),var(--fw));box-shadow:0 6px 16px -4px var(--fw3)}
.fwd-mark svg{display:block}
.fwd-h{font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1.2}
.fwd-sub{margin-top:3px;font-size:12px;color:#a1a1aa;line-height:1.2}
.fwd-stars{display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:4px;margin:16px 0 4px}
.fwd-s{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;color:#3f3f46;background:rgba(255,255,255,.03);transition:color .2s,background .2s,transform .35s cubic-bezier(.34,1.56,.64,1)}
.fwd-s svg{display:block}
.fwd-s:hover,.fwd-s:hover ~ .fwd-s{color:#fbbf24;background:rgba(251,191,36,.12)}
.fwd-s:hover{transform:translateY(-3px) scale(1.12)}
.fwd-s:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}
.fwd-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07);font-size:11px;color:#71717a}
@media (max-width:640px){.fwd-card{width:calc(100vw - 32px);max-width:292px}}`,
      html: `<div class="fwd"><div class="fwd-card"><div class="fwd-top"><span class="fwd-mark">${CHAT(16)}</span><div><div class="fwd-h">How&#39;s your experience?</div><div class="fwd-sub">Tap a star to tell us</div></div></div><div class="fwd-stars">${[5, 4, 3, 2, 1]
        .map((n) => `${A("fwd-s", `${n} star${n > 1 ? "s" : ""}`)}${STAR}</a>`)
        .join("")}</div><div class="fwd-foot"><span>Takes 30 seconds</span><span>Powered by FeedSenseAI</span></div></div></div>`,
    },

    /* 5 ─ Edge tab */
    {
      id: "tab",
      name: "Edge tab",
      desc: "Slim tab that hugs the screen edge",
      css:
        base("fwe", `${side}:0;top:calc(50% - 64px)`, v) +
        `
.fwe-tab{display:flex;flex-direction:column;align-items:center;gap:12px;width:42px;padding:18px 0;border-radius:${rtl ? "14px 0 0 14px" : "0 14px 14px 0"};color:var(--fw-ink);background:linear-gradient(180deg,var(--fw2),var(--fw) 55%,var(--fw-dark));box-shadow:${rtl ? "-8px" : "8px"} 12px 30px -12px var(--fw3),inset 1px 1px 0 rgba(255,255,255,.35);transition:width .4s cubic-bezier(.22,1,.36,1),box-shadow .4s}
.fwe-tab:hover{width:52px;box-shadow:${rtl ? "-14px" : "14px"} 14px 36px -12px var(--fw3),inset 1px 1px 0 rgba(255,255,255,.5)}
.fwe-tab:focus-visible{outline:2px solid #fff;outline-offset:-4px}
.fwe-ico{display:grid;place-items:center}
.fwe-ico svg{display:block}
.fwe-txt{writing-mode:vertical-rl;${rtl ? "transform:rotate(180deg);" : ""}font-size:13px;font-weight:700;letter-spacing:.08em;line-height:1}`,
      html: `<div class="fwe">${A("fwe-tab")}<span class="fwe-ico">${CHAT(16)}</span><span class="fwe-txt">Feedback</span></a></div>`,
    },

    /* 6 ─ Light pill */
    {
      id: "light",
      name: "Clean light",
      desc: "Crisp white pill that pops on dark sites",
      css:
        base("fwf", corner, v) +
        `
.fwf-btn{display:flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 8px;border-radius:999px;color:#0a0a0a;background:#fff;border:1px solid rgba(0,0,0,.06);box-shadow:0 16px 34px -12px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.14);font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1;transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s}
.fwf-ico{position:relative;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;color:#fff;background:#0a0a0a}
.fwf-ico svg{display:block;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fwf-ico::after{content:"";position:absolute;top:-1px;right:-1px;width:10px;height:10px;border-radius:50%;background:var(--fw);border:2px solid #fff}
.fwf-btn:hover{transform:translateY(-2px);box-shadow:0 22px 44px -14px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.16),0 0 0 5px var(--fw-soft)}
.fwf-btn:hover .fwf-ico svg{transform:rotate(-10deg) scale(1.1)}
.fwf-btn:active{transform:scale(.97)}
.fwf-btn:focus-visible{outline:2px solid #0a0a0a;outline-offset:3px}
@media (max-width:640px){.fwf-btn{padding:0 8px}.fwf-lbl{display:none}}`,
      html: `<div class="fwf">${A("fwf-btn")}<span class="fwf-ico">${CHAT(16)}</span><span class="fwf-lbl">Give feedback</span></a></div>`,
    },

    /* 7 ─ Prompt bar */
    {
      id: "bar",
      name: "Prompt bar",
      desc: "Centered bar with a confident call to action",
      css:
        base("fwg", "bottom:24px;left:0;right:0;margin:0 auto;width:max-content;max-width:calc(100vw - 32px)", v) +
        `
.fwg-bar{display:flex;align-items:center;gap:14px;padding:6px 6px 6px 18px;border-radius:999px;background:rgba(20,20,24,.9);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid rgba(255,255,255,.1);box-shadow:0 18px 40px -14px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.08)}
.fwg-dot{width:8px;height:8px;border-radius:50%;background:var(--fw);box-shadow:0 0 12px var(--fw)}
.fwg-txt{font-size:13.5px;font-weight:500;color:#e4e4e7;white-space:nowrap;letter-spacing:-.005em}
.fwg-btn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;border-radius:999px;color:var(--fw-ink);background:linear-gradient(135deg,var(--fw2),var(--fw));font-size:13px;font-weight:700;white-space:nowrap;box-shadow:0 8px 18px -8px var(--fw3),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
.fwg-btn svg{display:block;transition:transform .35s cubic-bezier(.22,1,.36,1)}
.fwg-btn:hover{transform:translateY(-1px);box-shadow:0 12px 24px -8px var(--fw3),inset 0 1px 0 rgba(255,255,255,.45)}
.fwg-btn:hover svg{transform:translateX(3px)}
.fwg-btn:focus-visible{outline:2px solid var(--fw);outline-offset:3px}`,
      html: `<div class="fwg"><div class="fwg-bar"><span class="fwg-dot"></span><span class="fwg-txt">Got feedback?</span>${A("fwg-btn")}Share it${ARROW}</a></div></div>`,
    },

    /* 8 ─ Emoji bar */
    {
      id: "emoji",
      name: "Quick reactions",
      desc: "One-tap emoji row with a springy hover",
      css:
        base("fwh", corner, v) +
        `
.fwh-bar{display:flex;align-items:center;gap:6px;padding:7px 8px 7px 18px;border-radius:999px;background:rgba(20,20,24,.9);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid var(--fw-soft);box-shadow:0 18px 40px -14px rgba(0,0,0,.7),0 0 0 4px var(--fw-soft),inset 0 1px 0 rgba(255,255,255,.08)}
.fwh-txt{margin-right:6px;font-size:13.5px;font-weight:600;color:#fafafa;white-space:nowrap;letter-spacing:-.01em}
.fwh-e{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.06);font-size:19px;line-height:1;transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .25s}
.fwh-e:hover{transform:scale(1.25) translateY(-3px);background:var(--fw-soft)}
.fwh-e:focus-visible{outline:2px solid var(--fw);outline-offset:2px}`,
      html: `<div class="fwh"><div class="fwh-bar"><span class="fwh-txt">How was it?</span>${A("fwh-e", "Loved it")}😍</a>${A("fwh-e", "It was okay")}🙂</a>${A("fwh-e", "Not great")}😕</a></div></div>`,
    },
  ];
};

/* turn the widget's HTML into a dependency-free React snippet */
const buildSnippet = (w: Widget, url: string) => {
  const jsx = w.html
    .replace(/__URL__/g, url)
    .replace(/\bclass=/g, "className=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=");
  return `// FeedSenseAI widget: ${w.name}. No dependencies, no scripts.
// Paste it anywhere in your React / Next.js layout (for example app/layout.tsx).
<>
  <style>{\`${w.css}\`}</style>
  ${jsx}
</>`;
};

/* a tiny website wireframe, so every widget is previewed in context */
const FakeSite = () => (
  <div aria-hidden className="absolute inset-0 p-4">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-white/15" />
        <span className="h-2 w-10 rounded bg-white/10" />
      </span>
      <span className="flex gap-2">
        <span className="h-1.5 w-7 rounded bg-white/[0.07]" />
        <span className="h-1.5 w-7 rounded bg-white/[0.07]" />
        <span className="h-1.5 w-7 rounded bg-white/[0.07]" />
        <span className="h-4 w-10 rounded bg-white/10" />
      </span>
    </div>
    <span className="mt-6 block h-3.5 w-3/5 rounded bg-white/[0.14]" />
    <span className="mt-2 block h-3.5 w-2/5 rounded bg-white/[0.14]" />
    <span className="mt-3 block h-1.5 w-3/5 rounded bg-white/[0.06]" />
    <span className="mt-1.5 block h-1.5 w-1/2 rounded bg-white/[0.06]" />
    <div className="mt-4 flex gap-2">
      <span className="h-5 w-16 rounded-md bg-white/[0.16]" />
      <span className="h-5 w-14 rounded-md bg-white/[0.06]" />
    </div>
    <div className="mt-5 grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-9 rounded-lg bg-white/[0.04]" />
      ))}
    </div>
  </div>
);

const AddIntegration: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [websitedata, setWebsiteData] = useState<Website[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const { user, loading: userLoading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [deleting, setDeleting] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [websiteDataInput, setWebsiteDataInput] = useState<WebsiteDataInput>({
    name: "",
    url: "",
    type: "",
  });
  /* non-empty once a website has been saved */
  const [highlightedCode1, setHighlightedCode1] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [lastWebsiteId, setLastWebsiteId] = useState<string | null>(null);

  /* UI state for the widget studio */
  const [targetSite, setTargetSite] = useState("");
  const [side, setSide] = useState<Side>("right");
  const [accent, setAccent] = useState(ACCENTS[0].hex);
  const studioRef = useRef<HTMLDivElement>(null);

  console.log(showCode);

  const db = useMemo(() => new dbService(), []);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!userLoading && user) {
        setFetchingData(true);
        const data = (await db.fetchWebsites(user)) as Website[];
        setWebsiteData(Array.isArray(data) ? data : []);
        setFetchingData(false);
      }
    };

    fetchWebsites();
  }, [userLoading, user, db]);

  const codeToCopy = (websiteId: string) => {
    console.log(websiteId);
    setHighlightedCode1("ready");
    setShowCode(true);
  };

  const handleDeleteWebsite = async (websiteName: string) => {
    try {
      setDeleting(true);
      await db.deleteWebsite(user!.uid, websiteName);
      setWebsiteData((prev) =>
        prev.filter((site) => site.name !== websiteName)
      );
      setTargetSite((prev) => (prev === websiteName ? "" : prev));
    } catch (error) {
      console.log("Error deleting website:", error);
    } finally {
      setDeleting(false);
    }
  };

  const saveData = async () => {
    try {
      if (Object.values(websiteDataInput).every((i) => i !== "")) {
        if (!userLoading && user) {
          setSavingData(true);

          const newWebsiteData = {
            name: websiteDataInput.name,
            url: websiteDataInput.url,
            type: websiteDataInput.type,
          };

          const res = await db.saveWebsite(user, newWebsiteData);

          if (res === "WebsiteFull") {
            toast("Upgrade your plan");
          } else {
            setLastWebsiteId(websiteDataInput.name);
            setTargetSite(websiteDataInput.name);
            codeToCopy(websiteDataInput.name);
            setWebsiteDataInput({ name: "", url: "", type: "" });

            await db.fetchWebsites(user);
            const data = (await db.fetchWebsites(user)) as Website[];
            setWebsiteData(Array.isArray(data) ? (data as Website[]) : []);
            studioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          console.log("User is loading or not authenticated");
        }
      } else {
        toast("Fill in all the details.");
      }
    } catch (error) {
      console.log("Error saving website:", error);
    } finally {
      setSavingData(false);
    }
  };

  /* which website the code is generated for */
  const activeSite = targetSite || lastWebsiteId || websitedata[0]?.name || "";

  const copyCode = async (w: Widget) => {
    try {
      if (activeSite) {
        await navigator.clipboard.writeText(
          buildSnippet(
            w,
            `https://feedsenseai.vercel.app/integrate/${user!.uid}/${activeSite}`
          )
        );
        setCopiedId(w.id);
        setTimeout(() => setCopiedId(null), 2000);
        toast("Code Copied!");
      } else {
        toast("Save a website first to copy the code.");
      }
    } catch (error) {
      console.log("Error copying code:", error);
    }
  };

  const [toggleLogout, setToggleLogout] = useState(false);

  const initial = (user?.displayName || "U").charAt(0).toUpperCase();

  const widgets = useMemo(() => makeWidgets(side, accent), [side, accent]);

  const filled =
    websiteDataInput.name !== "" &&
    websiteDataInput.url !== "" &&
    websiteDataInput.type !== "";
  const stage = highlightedCode1.length !== 0 || websitedata.length > 0 ? 2 : filled ? 1 : 0;
  const steps = [
    { title: "Add details", desc: "Name, URL and type" },
    { title: "Save website", desc: "Register it with FeedSense" },
    { title: "Paste the code", desc: "Drop it into your site" },
  ];

  return (
    <>
      <Theme />
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        {/* ambient background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
        </div>

        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-semibold tracking-tight text-white">
                FeedSense.ai
              </h1>
            </div>
            <p className="hidden text-sm text-zinc-500 md:block">
              Workspace <span className="mx-1.5 text-zinc-700">/</span>
              <span className="text-zinc-200">Integrate</span>
            </p>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-zinc-300">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white ring-2 ring-white/10">
                  {initial}
                </span>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setToggle(true)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10 md:hidden"
              >
                <CiMenuFries size={20} />
              </button>
            </div>
          </div>
        </header>

        {toggle && (
          <MobileSideBar
            Page="Integrate"
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {/* ---------- Heading + progress ---------- */}
          <section className="fs-rise">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-indigo-300">Integrate</p>
                <h1 className="mt-2 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
                  Integrate Website
                </h1>
                <p className="mt-3 text-zinc-400">
                  Add FeedSenseAI to your website in minutes
                </p>
              </div>
              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur lg:self-auto">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                  <FiLayers size={18} />
                </span>
                <div>
                  <p className="text-2xl font-bold tabular-nums leading-none text-white">
                    {websitedata.length}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">websites connected</p>
                </div>
              </div>
            </div>

            <ol className="relative mt-9 grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <li
                    key={s.title}
                    className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
                      active
                        ? "border-indigo-400/40 bg-indigo-400/[0.07]"
                        : done
                        ? "border-emerald-400/25 bg-emerald-400/[0.05]"
                        : "border-white/[0.08] bg-white/[0.02]"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-emerald-400 text-[#09090b]"
                          : active
                          ? "bg-indigo-500 text-white"
                          : "bg-white/[0.06] text-zinc-500"
                      }`}
                    >
                      {done ? <FiCheck size={18} /> : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          done || active ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---------- Studio: form + widgets ---------- */}
          <section className="fs-rise grid items-start gap-6 xl:grid-cols-12" style={{ animationDelay: "0.1s" }}>
            {/* connect form */}
            <div className="xl:sticky xl:top-24 xl:col-span-4">
              <GlowCard>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                      <CiGlobe size={28} />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-white">Website Details</h2>
                      <p className="text-sm text-zinc-500">Configure your integration</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    <div>
                      <label htmlFor="site-name" className={labelClass}>
                        Website name
                      </label>
                      <div className="relative">
                        <FiType size={17} className={iconClass} />
                        <input
                          id="site-name"
                          type="text"
                          placeholder="Website Name"
                          className={inputClass}
                          value={websiteDataInput.name}
                          onChange={(e) =>
                            setWebsiteDataInput((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="site-url" className={labelClass}>
                        Website URL
                      </label>
                      <div className="relative">
                        <FiLink size={17} className={iconClass} />
                        <input
                          id="site-url"
                          type="text"
                          placeholder="Website URL"
                          className={inputClass}
                          value={websiteDataInput.url}
                          onChange={(e) =>
                            setWebsiteDataInput((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <span className={labelClass}>Type</span>
                      <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5">
                        {[
                          { v: "personal", l: "Personal" },
                          { v: "business", l: "Business" },
                        ].map((o) => (
                          <button
                            key={o.v}
                            type="button"
                            onClick={() =>
                              setWebsiteDataInput((prev) => ({
                                ...prev,
                                type: o.v,
                              }))
                            }
                            className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                              websiteDataInput.type === o.v
                                ? "bg-indigo-400/25 text-white ring-1 ring-inset ring-indigo-400/40"
                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                            }`}
                          >
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={saveData}
                      className="w-full rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30"
                    >
                      Save website
                    </button>

                    {highlightedCode1 && lastWebsiteId && (
                      <div className="flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-200">
                        <FiCheck size={16} className="mt-0.5 shrink-0" />
                        <span>
                          <span className="font-semibold">{lastWebsiteId}</span> is
                          saved. Pick a widget on the right and copy its code.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* widget studio */}
            <div ref={studioRef} className="scroll-mt-24 xl:col-span-8">
              <GlowCard>
                {/* studio header */}
                <div className="border-b border-white/[0.07] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/25">
                        <IoCodeOutline size={26} />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-white">Widget studio</h2>
                        <p className="text-sm text-zinc-500">
                          Pick a style, make it yours, copy the code
                        </p>
                      </div>
                    </div>
                    <div className="hidden flex-wrap justify-end gap-2 sm:flex">
                      {["No scripts", "Zero dependencies", "Accessible"].map((x) => (
                        <span
                          key={x}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-400"
                        >
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* toolbar */}
                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div>
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Install for
                      </span>
                      <div className="relative">
                        <select
                          value={activeSite}
                          onChange={(e) => setTargetSite(e.target.value)}
                          disabled={websitedata.length === 0}
                          className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-10 text-sm text-white outline-none transition hover:border-white/20 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/10 disabled:cursor-not-allowed disabled:text-zinc-600 [color-scheme:dark]"
                        >
                          {websitedata.length === 0 && (
                            <option value="">Save a website first</option>
                          )}
                          {websitedata.map((s) => (
                            <option key={s.name} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Accent colour
                      </span>
                      <div className="flex h-[46px] items-center gap-2.5">
                        {ACCENTS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            aria-label={c.name}
                            title={c.name}
                            onClick={() => setAccent(c.hex)}
                            className={`h-7 w-7 rounded-full transition-all duration-200 ${
                              accent === c.hex
                                ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#111113]"
                                : "ring-1 ring-white/15 hover:scale-110"
                            }`}
                            style={{ background: c.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Position
                      </span>
                      <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
                        {(["left", "right"] as Side[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSide(s)}
                            className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition ${
                              side === s
                                ? "bg-white/10 text-white"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* gallery */}
                <div className="p-4 sm:p-6">
                  <style>{widgets.map((w) => w.css).join("\n")}</style>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {widgets.map((w) => (
                      <div
                        key={w.id}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
                      >
                        {/* live preview on a mini website */}
                        <div className="relative h-52 overflow-hidden bg-[#0b0b0e]">
                          <FakeSite />
                          <div
                            className="absolute inset-0"
                            style={{ transform: "translateZ(0)" }}
                            onClick={(e) => e.preventDefault()}
                            dangerouslySetInnerHTML={{
                              __html: w.html.replace(/__URL__/g, "#"),
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ background: accent }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {w.name}
                              </p>
                              <p className="truncate text-xs text-zinc-500">{w.desc}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyCode(w)}
                            className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              copiedId === w.id
                                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                                : "border-white/10 bg-white/[0.05] text-zinc-200 hover:border-indigo-400/40 hover:bg-indigo-400/10 hover:text-indigo-200"
                            }`}
                          >
                            {copiedId === w.id ? <FiCheck size={13} /> : <FaRegCopy size={13} />}
                            {copiedId === w.id ? "Copied" : "Copy code"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </div>
          </section>

          {/* ---------- Connected websites: card grid ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.2s" }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Connected websites
              </h2>
              <span className="rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/25">
                {websitedata.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {websitedata.map((site, idx) => (
                <GlowCard key={idx}>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-bold text-white ${
                          avatarGradients[idx % avatarGradients.length]
                        }`}
                      >
                        {(site.name || "?").charAt(0).toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {"Active"}
                      </span>
                    </div>

                    <h3 className="mt-5 truncate text-base font-semibold text-white">
                      {site.name}
                    </h3>

                    <button
                      type="button"
                      className="group mt-1 flex max-w-full items-center gap-1.5 text-left text-sm text-indigo-300 transition hover:text-indigo-200"
                      onClick={() => {
                        const url = site.url!.match(/^https?:\/\//)
                          ? site.url
                          : `https://${site.url}`;

                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <span className="truncate">{site.url}</span>
                      <FiArrowUpRight
                        size={14}
                        className="shrink-0 opacity-60 transition group-hover:opacity-100"
                      />
                    </button>

                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-4">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium capitalize text-zinc-300">
                        {site.type || "Website"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTargetSite(site.name);
                            studioRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-400/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-400/20"
                        >
                          <IoCodeOutline size={14} />
                          Get code
                        </button>
                        <button
                          aria-label={`Delete ${site.name}`}
                          onClick={() => {
                            handleDeleteWebsite(site.name);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <BsTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex min-h-[13rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-zinc-400 transition hover:border-indigo-400/40 hover:bg-indigo-400/[0.04] hover:text-indigo-200"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-inset ring-white/10 transition group-hover:bg-indigo-400/10 group-hover:ring-indigo-400/30">
                  <FiPlus size={22} />
                </span>
                <span className="text-sm font-semibold">
                  {websitedata.length === 0 && !fetchingData
                    ? "Save your first website above"
                    : "Add another website"}
                </span>
              </button>
            </div>
          </section>
        </main>
      </div>

      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default AddIntegration;