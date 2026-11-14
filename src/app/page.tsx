"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { FiMessageSquare } from "react-icons/fi";
import { SlGraph } from "react-icons/sl";
import { VscGraph } from "react-icons/vsc";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiCheckCircle, FiTrendingUp, FiArrowRight, FiPlay } from "react-icons/fi";
import { FiPlus, FiClock, FiLifeBuoy, FiChevronRight } from "react-icons/fi";
import { BiMessageRounded } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import { CgNotes, CgWebsite, CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi2";
import { LuBrain } from "react-icons/lu";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { useRouter } from "next/navigation";

interface User {
  uid: string;
}

/* ---------- UI-only helpers ---------- */

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fsh-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fsh-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(80px,40px,0) scale(1.18)}}
@keyframes fsh-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-70px,-40px,0) scale(.95)}}
@keyframes fsh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes fsh-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes fsh-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
@keyframes fsh-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@keyframes fsh-draw{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
@keyframes fsh-spin{to{transform:rotate(360deg)}}
.fsh-spin{animation:fsh-spin 5s linear infinite}
@keyframes fsh-enter{from{opacity:0;transform:translateY(-30px) scale(.97)}}
@keyframes fsh-toast{0%{opacity:0;transform:translateY(-10px) scale(.97)}10%,80%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-6px)}}
@keyframes fsh-fade{from{opacity:0;transform:translateY(6px)}}
@keyframes fsh-blink{0%,100%{opacity:1}50%{opacity:.35}}
.fsh-enter{animation:fsh-enter .75s cubic-bezier(.22,1,.36,1) both}
.fsh-toast{animation:fsh-toast 3.4s ease both}
.fsh-fade{animation:fsh-fade .6s cubic-bezier(.22,1,.36,1) both}
.fsh-blink{animation:fsh-blink 1.8s ease-in-out infinite}
.fsh-a{animation:fsh-drift-a 16s ease-in-out infinite}
.fsh-b{animation:fsh-drift-b 20s ease-in-out infinite}
.fsh-float{animation:fsh-float 6s ease-in-out infinite}
.fsh-marquee{animation:fsh-marquee 38s linear infinite}
.fsh-sheen{background-size:200% 100%;animation:fsh-sheen 7s linear infinite}
.fsh-btn{background-size:200% 100%}
.fsh-btn:hover{animation:fsh-sheen 2.2s linear infinite}
.fsh-ping{animation:fsh-pulse 2s ease-out infinite}
.fsh-line{stroke-dasharray:300;animation:fsh-draw 2.4s ease forwards}
.fsh-frame{transform-style:preserve-3d;transform-origin:50% 0%;will-change:transform}
@media (prefers-reduced-motion:reduce){.fsh-enter,.fsh-toast,.fsh-fade,.fsh-blink,.fsh-spin,.fsh-a,.fsh-b,.fsh-float,.fsh-marquee,.fsh-sheen,.fsh-btn:hover,.fsh-ping,.fsh-line{animation:none!important}}
`}</style>
);

/* number that counts up when scrolled into view */
const CountUp = ({
  to,
  decimals = 0,
  suffix = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1600, 1);
          setVal(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/* card with a cursor-following spotlight */
const SpotCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    }}
    className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111113] p-6 transition-colors hover:border-white/20 sm:p-8 ${className}`}
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(129,140,248,0.14), transparent 60%)",
      }}
    />
    <div className="relative flex h-full flex-col">{children}</div>
  </div>
);

/* ---------- hero product preview: a live replica of the real dashboard ---------- */

type Sent = "Positive" | "Neutral" | "Negative";

const STREAM: { who: string; t: string; s: Sent }[] = [
  { who: "Priya S.", t: "Love the new dashboard, everything is so clear.", s: "Positive" },
  { who: "Daniel R.", t: "Couldn't find where to enter my promo code.", s: "Negative" },
  { who: "Aisha K.", t: "Please add a dark mode for late-night use.", s: "Neutral" },
  { who: "Marco L.", t: "App crashes when I open settings on iOS.", s: "Negative" },
  { who: "Hannah W.", t: "Support replied in minutes. Impressed!", s: "Positive" },
];

const sentStyle: Record<Sent, string> = {
  Positive: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  Neutral: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  Negative: "bg-rose-400/10 text-rose-300 ring-rose-400/25",
};

/* eased 0 -> to over time, used to animate the replica on load */
const useTween = (to: number, delay = 500, dur = 1500) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.min(Math.max((now - t0) / dur, 0), 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delay, dur]);
  return v;
};

/* --- dashboard pieces, same markup and classes as the real dashboard --- */
type DTone = "cyan" | "violet" | "emerald" | "amber";
const dTones: Record<DTone, { text: string; bar: string; dot: string }> = {
  cyan: { text: "text-indigo-300", bar: "from-indigo-400 to-indigo-500", dot: "bg-indigo-400" },
  violet: { text: "text-violet-300", bar: "from-violet-400 to-violet-500", dot: "bg-violet-400" },
  emerald: { text: "text-emerald-300", bar: "from-emerald-400 to-teal-400", dot: "bg-emerald-400" },
  amber: { text: "text-amber-300", bar: "from-amber-400 to-orange-500", dot: "bg-amber-400" },
};

const DSurface = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl p-px bg-white/10 ${className}`}>
    <div className="relative h-full overflow-hidden rounded-[15px] bg-[#111113]">
      {children}
    </div>
  </div>
);

const DKpi = ({
  label,
  value,
  hint,
  tone,
  icon,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  tone: DTone;
  icon: React.ReactNode;
  progress?: number;
}) => (
  <div className="group relative px-6 py-6">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <span className={`${dTones[tone].text} opacity-80`}>{icon}</span>
    </div>
    <p className="mt-4 text-[2.6rem] font-semibold leading-none tabular-nums tracking-tight text-white">
      {value}
    </p>
    {progress !== undefined ? (
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${dTones[tone].bar}`}
          style={{ width: `${Math.max(progress, 3)}%` }}
        />
      </div>
    ) : (
      <div className="mt-5 h-1 w-8 rounded-full bg-white/10" />
    )}
    <p className="mt-3 text-xs text-zinc-500">{hint}</p>
  </div>
);

const DGauge = ({ percent }: { percent: number }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="fsh-gauge" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#fsh-gauge)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * percent) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
          {percent}%
        </span>
        <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
          resolved
        </span>
      </div>
    </div>
  );
};

/* demo numbers (kept constant so the real Analytics chart stays stable) */
const DEMO = { websites: 3, feedback: 128, done: 42, pending: 13 };

const LiveDemo = () => {
  const k = useTween(1);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setN((x) => x + 1);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const cur = STREAM[n % STREAM.length];
  const all = DEMO.done + DEMO.pending;
  const rate = Math.round((DEMO.done / all) * 100 * k);
  const avg = (DEMO.feedback / DEMO.websites).toFixed(1);
  const num = (v: number) => String(Math.round(v * k));

  return (
    <div className="overflow-hidden rounded-[21px] bg-[#0e0e11] text-left">
      {/* window chrome */}
      <div className="relative flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="mx-auto hidden rounded-md bg-white/[0.05] px-10 py-1 text-xs text-zinc-500 sm:block">
          feedsenseai.vercel.app/dashboard
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25 sm:ml-0">
          <span className="fsh-blink h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live demo
        </span>
      </div>

      <div className="flex max-h-[46rem] overflow-hidden bg-[#09090b]">
        {/* sidebar: same markup and classes as the real SideBar */}
        <aside className="hidden w-64 shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#07090d]/90 px-4 py-6 lg:flex">
          <div className="relative flex items-center gap-3 px-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 text-white">
              <HiOutlineSparkles size={22} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              FeedSense<span className="text-indigo-400">AI</span>
            </span>
          </div>

          <nav className="relative mt-10 flex flex-col gap-1.5">
            <p className="mb-2 px-3 text-xs font-semibold text-zinc-600">Menu</p>
            {[
              { label: "Home", icon: MdDashboard },
              { label: "Integrate", icon: CgWebsite },
              { label: "Help", icon: IoMdHelpCircle },
              { label: "Your websites", icon: FaLink },
              { label: "My Profile", icon: CgProfile },
            ].map(({ label, icon: Icon }, i) => {
              const active = i === 0;
              return (
                <div
                  key={label}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-indigo-400/20 text-white ring-1 ring-inset ring-indigo-400/20"
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute -left-4 bottom-2 top-2 w-[3px] rounded-r-full bg-indigo-400" />
                  )}
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg ${
                      active
                        ? "bg-indigo-400/20 text-indigo-300"
                        : "bg-white/[0.04] text-zinc-400"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  {label}
                </div>
              );
            })}
          </nav>

          <div className="relative mt-auto space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white ring-2 ring-white/10">
                A
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Alex Morgan
                </p>
                <p className="truncate text-xs text-zinc-500">alex@acme.com</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
                <IoLogOut size={20} />
              </span>
              Logout
            </div>
          </div>
        </aside>

        {/* dashboard */}
        <div className="relative min-w-0 flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]"
          />

          {/* new feedback toast */}
          <div
            key={n}
            className="fsh-toast pointer-events-none absolute right-4 top-3 z-20 hidden w-72 items-center gap-3 rounded-xl border border-white/10 bg-[#111113]/95 p-3 shadow-xl shadow-black/40 backdrop-blur sm:flex"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.07] text-xs font-semibold text-zinc-300">
              {cur.who.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-zinc-200">
                  {cur.who}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sentStyle[cur.s]}`}
                >
                  {cur.s}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">{cur.t}</p>
            </div>
          </div>

          {/* top bar */}
          <header className="relative z-10 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2.5 md:hidden">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
                  <HiOutlineSparkles size={18} />
                </span>
                <h1 className="text-base font-semibold tracking-tight text-white">
                  FeedSense.ai
                </h1>
              </div>
              <p className="hidden items-center gap-1.5 text-sm text-zinc-500 md:flex">
                Workspace
                <FiChevronRight size={14} className="text-zinc-700" />
                <span className="text-zinc-200">Dashboard</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-semibold capitalize text-indigo-200 ring-1 ring-inset ring-indigo-400/30 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                  Pro
                </span>
                <div className="hidden items-center gap-3 border-l border-white/[0.08] pl-4 md:flex">
                  <span className="max-w-[10rem] truncate text-sm text-zinc-300">
                    Alex Morgan
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white ring-2 ring-white/10">
                    A
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="relative z-10 space-y-6 px-4 py-8 sm:px-6">
            {/* heading row */}
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-300">
                  Good morning, Alex
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Dashboard Overview
                </h1>
                <p className="mt-2 text-zinc-400">
                  AI-powered insights from your user feedback
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400 sm:self-auto">
                <FiPlus size={16} />
                Connect a website
              </span>
            </section>

            {/* KPI strip */}
            <section>
              <DSurface>
                <div className="grid grid-cols-2 divide-white/[0.07] lg:grid-cols-4 lg:divide-x [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-white/[0.07] lg:[&>div:nth-child(n+3)]:border-t-0 [&>div:nth-child(even)]:border-l [&>div:nth-child(even)]:border-white/[0.07] lg:[&>div:nth-child(even)]:border-l-0">
                  <DKpi
                    label="Websites"
                    value={num(DEMO.websites)}
                    hint="Connected to FeedSense"
                    tone="cyan"
                    icon={<BiMessageRounded size={20} />}
                  />
                  <DKpi
                    label="Feedbacks"
                    value={num(DEMO.feedback)}
                    hint={`About ${avg} per website`}
                    tone="violet"
                    icon={<CgNotes size={19} />}
                  />
                  <DKpi
                    label="Completed"
                    value={num(DEMO.done)}
                    hint="Tasks resolved"
                    tone="emerald"
                    icon={<GoGraph size={18} />}
                    progress={(DEMO.done / all) * 100 * k}
                  />
                  <DKpi
                    label="Pending"
                    value={num(DEMO.pending)}
                    hint="Tasks waiting on you"
                    tone="amber"
                    icon={<FiClock size={18} />}
                    progress={(DEMO.pending / all) * 100 * k}
                  />
                </div>
              </DSurface>
            </section>

            {/* analytics + gauge + quick actions */}
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Analytics
                  totalWebsites={String(DEMO.websites)}
                  totalFeedback={String(DEMO.feedback)}
                  totalTasksFinished={String(DEMO.done)}
                  totalIncompleteTasks={String(DEMO.pending)}
                  loading={false}
                />
              </div>

              <div className="grid gap-6">
                <DSurface>
                  <div className="p-6">
                    <h2 className="text-sm font-semibold text-white">
                      Resolution rate
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {DEMO.done} of {all} tasks completed
                    </p>
                    <div className="mt-5">
                      <DGauge percent={rate} />
                    </div>
                  </div>
                </DSurface>

                <DSurface>
                  <div className="p-2">
                    {[
                      {
                        icon: <FiPlus size={16} />,
                        t: "Connect a website",
                        d: "Add the snippet to a new site",
                        c: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/25",
                      },
                      {
                        icon: <FiLifeBuoy size={16} />,
                        t: "Get help",
                        d: "Talk to the FeedSense team",
                        c: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
                      },
                    ].map((a) => (
                      <div
                        key={a.t}
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ring-inset ${a.c}`}
                        >
                          {a.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-white">
                            {a.t}
                          </span>
                          <span className="block truncate text-xs text-zinc-500">
                            {a.d}
                          </span>
                        </span>
                        <FiChevronRight
                          size={16}
                          className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300"
                        />
                      </div>
                    ))}
                  </div>
                </DSurface>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  const words = [
    "User Feedback",
    "Customer Reviews",
    "Bug Reports",
    "Feature Requests",
  ];
  const [wi, setWi] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWi((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const el = e.currentTarget;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };

  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const tilt = Math.max(0, 18 - y / 20);
      const scale = 0.93 + Math.min(y / 2800, 0.07);
      if (frameRef.current)
        frameRef.current.style.transform = `rotateX(${tilt}deg) scale(${scale})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const benefits = [
    {
      icon: <FiCheckCircle size={20} color="#22c55e" />,
      big: 31,
      title: "Increase User Satisfaction by 31%",
      desc: "Our AI identifies pain points before they become problems, leading to happier users.",
      tone: "from-emerald-300 to-teal-400",
    },
    {
      icon: <FiCheckCircle size={20} color="#818cf8" />,
      big: 18,
      title: "Reduce Support Tickets by 18%",
      desc: "Proactive insights help you fix issues before users need to contact support.",
      tone: "from-indigo-300 to-indigo-400",
    },
    {
      icon: <FiCheckCircle size={20} color="#facc15" />,
      big: 42,
      title: "Boost Feature Adoption by 42%",
      desc: "Understand what users really want and deliver features they'll actually use.",
      tone: "from-amber-300 to-orange-400",
    },
  ];

  const stats = [
    {
      icon: <AiOutlineStar size={26} color="#facc15" />,
      to: 4.9,
      decimals: 1,
      suffix: "/5",
      label: "Customer Rating",
    },
    {
      icon: <HiOutlineUsers size={26} color="#818cf8" />,
      to: 30,
      decimals: 0,
      suffix: "+",
      label: "Active Users",
    },
    {
      icon: <FiTrendingUp size={26} color="#22c55e" />,
      to: 89,
      decimals: 0,
      suffix: "%",
      label: "Accuracy Rate",
    },
    {
      icon: <AiOutlineThunderbolt size={26} color="#a855f7" />,
      to: 2.5,
      decimals: 1,
      suffix: "x",
      label: "Faster Insights",
    },
  ];

  const steps = [
    {
      title: "Connect your website",
      desc: "Save your site and paste one snippet. Your feedback widget goes live in minutes.",
    },
    {
      title: "Collect feedback",
      desc: "Ratings, bug reports and feature requests land in one place, from every user.",
    },
    {
      title: "Act on AI insights",
      desc: "FeedSenseAI turns the noise into clear tasks, so you know what to fix first.",
    },
  ];

  const ticker = [
    "Sentiment analysis",
    "Predictive insights",
    "Real-time alerts",
    "Bug reports",
    "Feature requests",
    "Visual dashboards",
    "Actionable recommendations",
    "One-snippet setup",
  ];

  const [userSession, setUserSession] = useState<string | null>(null);
  useEffect(() => {
    const token = Cookies.get("auth-token");
    setUserSession(token ?? null);
  }, []);

  const navigate = useRouter();

  const iconTile = (node: React.ReactNode) => (
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-inset ring-white/10">
      {node}
    </span>
  );

  return (
    <div className="fsh-root relative w-full overflow-x-clip bg-[#09090b] text-white">
      <Theme />

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ================= HERO ================= */}
        <section onMouseMove={onHeroMove} className="relative overflow-hidden">
          {/* light cone, grid and cursor spotlight */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[46rem] w-[96rem] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(129,140,248,0.30)_0deg,transparent_26deg,transparent_334deg,rgba(129,140,248,0.30)_360deg)] opacity-60 blur-2xl [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
            <div
              className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
            <div className="absolute left-1/2 top-[52%] h-[30rem] w-[84rem] -translate-x-1/2 rounded-[100%] bg-indigo-500/[0.07] blur-3xl" />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "radial-gradient(560px circle at var(--mx,50%) var(--my,30%), rgba(129,140,248,0.08), transparent 60%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-32 text-center sm:px-6 sm:pt-40 lg:px-10">
            {/* announcement pill with a travelling highlight */}
            <a
              href="#how"
              className="group relative inline-flex overflow-hidden rounded-full p-px"
            >
              <span aria-hidden className="absolute left-1/2 top-1/2 h-0 w-0">
                <span className="fsh-spin absolute -left-[220px] -top-[220px] h-[440px] w-[440px] bg-[conic-gradient(from_0deg,transparent_0_72%,#818cf8_92%,transparent_100%)]" />
              </span>
              <span className="relative inline-flex items-center gap-2.5 rounded-full bg-[#0d0d10] py-1.5 pl-1.5 pr-4 text-xs font-medium text-zinc-300">
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  New
                </span>
                Real-time AI insights are live
                <FiArrowRight
                  size={13}
                  className="text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300"
                />
              </span>
            </a>

            {/* headline: three stacked lines, rotating subject in a tinted capsule */}
            <h1 className="mx-auto mt-8 max-w-4xl text-[2.2rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
              <span className="block bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
                Transform
              </span>
              <span className="my-2 block sm:my-3">
                <span className="relative inline-block rounded-2xl bg-indigo-500/[0.10] px-4 py-1 ring-1 ring-inset ring-indigo-400/25 sm:rounded-3xl sm:px-7 sm:py-2">
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent"
                  />
                  <span className="relative inline-grid align-bottom">
                    <span className="sr-only">User Feedback</span>
                    {words.map((w, i) => {
                      const active = i === wi;
                      const justLeft = i === (wi - 1 + words.length) % words.length;
                      return (
                        <span
                          key={w}
                          aria-hidden
                          className="col-start-1 row-start-1 whitespace-nowrap text-indigo-300"
                          style={{
                            opacity: active ? 1 : 0,
                            transform: active
                              ? "translateY(0)"
                              : justLeft
                              ? "translateY(-0.3em)"
                              : "translateY(0.3em)",
                            filter: active ? "blur(0px)" : "blur(8px)",
                            transition:
                              "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1), filter 700ms ease-out",
                          }}
                        >
                          {w}
                        </span>
                      );
                    })}
                  </span>
                </span>
              </span>
              <span className="block bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                into actionable insights
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Harness the power of artificial intelligence to understand your users
              better, make data-driven decisions, and boost your product's success
              with real-time feedback analytics.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href={`${userSession === null ? "/login" : "/dashboard"}`}>
                <button className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#09090b] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 active:translate-y-0">
                  Get Started
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a
                href="#how"
                className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-2 pr-6 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:bg-white/10"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-indigo-500">
                  <FiPlay size={14} className="ml-0.5" />
                </span>
                See how it works
              </a>
            </div>

            {/* social proof */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <div className="flex -space-x-2">
                {["P", "D", "A", "M", "H"].map((c, i) => (
                  <span
                    key={c}
                    className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold text-white ring-2 ring-[#09090b] ${
                      [
                        "bg-indigo-500",
                        "bg-violet-500",
                        "bg-emerald-500",
                        "bg-amber-500",
                        "bg-rose-500",
                      ][i]
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-center gap-1 sm:items-start">
                <span className="flex gap-0.5 text-amber-300">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <AiOutlineStar key={i} size={14} className="fill-current" />
                  ))}
                </span>
                <span className="text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-300">4.9/5</span> from
                  30+ active teams · 14‑day free trial · No credit card required
                </span>
              </div>
            </div>

            {/* live product stage */}
            <div className="relative mx-auto mt-20 max-w-6xl [perspective:1800px]">
              <div aria-hidden className="absolute inset-x-8 top-10 h-4/5 rounded-[3rem] bg-indigo-500/[0.12] blur-3xl" />

              <div className="[mask-image:linear-gradient(to_bottom,black_62%,transparent_100%)]">
                <div ref={frameRef} className="fsh-frame relative">
                  <div className="rounded-[22px] bg-gradient-to-b from-white/30 via-white/10 to-white/[0.04] p-px shadow-2xl shadow-black/60">
                    <LiveDemo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TICKER ================= */}
        <section className="border-y border-white/[0.06] bg-white/[0.015] py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="fsh-marquee flex w-max items-center gap-12 pr-12">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-12 whitespace-nowrap text-sm font-medium text-zinc-400"
              >
                {t}
                <HiOutlineSparkles className="text-indigo-400/70" size={16} />
              </span>
            ))}
          </div>
        </section>

        {/* ================= FEATURES (bento) ================= */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Powerful Features for{" "}
              <span className=" text-indigo-300">
                Smart Analytics
              </span>
            </h2>
            <p className="mt-5 text-zinc-400 sm:text-lg">
              Everything you need to understand, analyze, and act on user
              feedback in real-time
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* AI-powered analysis */}
            <SpotCard className="md:col-span-2">
              {iconTile(<LuBrain size={26} color="#818cf8" />)}
              <h3 className="mt-6 text-xl font-semibold">AI-Powered Analysis</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Advanced machine learning algorithms analyze sentiment, trends,
                and patterns in real-time
              </p>
              <div className="mt-8 space-y-3.5">
                {[
                  { l: "Positive", v: 68, c: "from-emerald-400 to-teal-400" },
                  { l: "Neutral", v: 21, c: "from-amber-400 to-orange-400" },
                  { l: "Negative", v: 11, c: "from-rose-400 to-rose-500" },
                ].map((r) => (
                  <div key={r.l} className="flex items-center gap-4 text-xs">
                    <span className="w-16 text-zinc-400">{r.l}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${r.c}`}
                        style={{ width: `${r.v}%` }}
                      />
                    </div>
                    <span className="w-8 text-right tabular-nums text-zinc-300">
                      {r.v}%
                    </span>
                  </div>
                ))}
              </div>
            </SpotCard>

            {/* Smart collection */}
            <SpotCard>
              {iconTile(<FiMessageSquare size={26} color="#818cf8" />)}
              <h3 className="mt-6 text-xl font-semibold">Smart Feed Collection</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Seamlessly integrate with your website to collect feedback
                through multiple channels
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Feedback", "Bug reports", "Feature requests"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </SpotCard>

            {/* Predictive */}
            <SpotCard>
              {iconTile(<SlGraph size={24} color="#ffc107" />)}
              <h3 className="mt-6 text-xl font-semibold">Predictive Insights</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Get ahead of issues with predictive analytics and trend
                forecasting
              </p>
              <svg viewBox="0 0 240 70" className="mt-6 h-16 w-full">
                <defs>
                  <linearGradient id="fsh-g" x1="0" x2="1">
                    <stop offset="0" stopColor="#818cf8" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <path
                  className="fsh-line"
                  d="M0 55 C30 50 40 30 70 36 S110 52 140 28 S175 12 200 10"
                  fill="none"
                  stroke="url(#fsh-g)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M200 10 L240 4"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                />
              </svg>
            </SpotCard>

            {/* Dashboards */}
            <SpotCard className="md:col-span-2">
              {iconTile(<VscGraph size={26} color="#a259ff" />)}
              <h3 className="mt-6 text-xl font-semibold">Visual Dashboards</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Beautiful, interactive charts and graphs that make complex data
                easy to understand
              </p>
              <div className="mt-8 flex h-24 items-end gap-2">
                {[35, 55, 40, 70, 52, 85, 62, 95, 74, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-indigo-400/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </SpotCard>

            {/* Alerts */}
            <SpotCard>
              {iconTile(<AiOutlineThunderbolt size={26} color="#ff5e5e" />)}
              <h3 className="mt-6 text-xl font-semibold">Real-time Alerts</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Instant notifications when critical feedback patterns are
                detected
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-xs text-rose-200">
                <span className="relative flex h-2.5 w-2.5">
                  
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
                </span>
                Negative feedback spike detected
              </div>
            </SpotCard>

            {/* Recommendations */}
            <SpotCard className="md:col-span-2">
              {iconTile(<BsGraphUpArrow size={24} color="#ff9900" />)}
              <h3 className="mt-6 text-xl font-semibold">
                Actionable Recommendations
              </h3>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                AI-generated suggestions to improve user experience and
                satisfaction
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Simplify the checkout form",
                  "Add a dark mode toggle",
                  "Speed up the first page load",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
                  >
                    <FiCheckCircle className="text-emerald-400" size={18} />
                    {t}
                  </li>
                ))}
              </ul>
            </SpotCard>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Live in three steps
            </h2>
            <p className="mt-5 text-zinc-400 sm:text-lg">
              From first snippet to first insight, in the time it takes to make
              coffee.
            </p>
          </div>

          <div className="relative mt-16 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px md:block bg-white/10" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center" data-aos="fade-up" data-aos-delay={i * 120}>
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl text-xl font-semibold text-white bg-indigo-500">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHY CHOOSE ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Why Choose{" "}
              <span className=" text-indigo-300">
                FeedSenseAI?
              </span>
            </h2>
            <p className="mt-5 text-zinc-400 sm:text-lg">
              Join hundreds of companies that trust FeedSenseAI to transform
              their user feedback into business growth.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map((b, idx) => (
              <SpotCard key={idx}>
                <p
                  className={`text-7xl font-semibold tracking-tight text-white`}
                >
                  <CountUp to={b.big} suffix="%" />
                </p>
                <div className="mt-6 flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">{b.icon}</span>
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{b.desc}</p>
                  </div>
                </div>
              </SpotCard>
            ))}
          </div>

          {/* stats */}
          <div className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/[0.08] p-6 text-center sm:p-8 bg-white/[0.03]"
              >
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-inset ring-white/10">
                  {s.icon}
                </div>
                <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mt-1.5 text-sm text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="relative">
            
            <div className="relative rounded-[2rem] p-px bg-white/10">
              <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#111113] px-6 py-14 text-center sm:px-14 sm:py-20">
                
                <h2 className="relative text-3xl font-semibold tracking-tight sm:text-5xl">
                  Ready to Transform Your{" "}
                  <span className=" text-indigo-300">
                    User Feedback?
                  </span>
                </h2>

                <p className="relative mx-auto mt-6 max-w-2xl text-zinc-400 sm:text-lg">
                  Join thousands of companies using FeedSenseAI to make smarter,
                  data‑driven decisions. Start your free trial today and see the
                  difference AI can make.
                </p>

                <div className="relative mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => {
                      navigate.push("/plans");
                    }}
                    className=" group inline-flex items-center justify-center gap-2 rounded-2xl px-9 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 bg-indigo-500 hover:bg-indigo-400"
                  >
                    Start Now
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <p className="relative mt-6 text-sm text-zinc-500">
                  No credit card required • 14‑day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Page;