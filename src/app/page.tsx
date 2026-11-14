"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../asserts/img1.png";
import Image from "next/image";
import { FiMessageSquare } from "react-icons/fi";
import { SlGraph } from "react-icons/sl";
import { VscGraph } from "react-icons/vsc";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiCheckCircle, FiTrendingUp, FiArrowRight, FiPlay } from "react-icons/fi";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi2";
import { LuBrain } from "react-icons/lu";
import Footer from "@/components/Footer";
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
@media (prefers-reduced-motion:reduce){.fsh-spin,.fsh-a,.fsh-b,.fsh-float,.fsh-marquee,.fsh-sheen,.fsh-btn:hover,.fsh-ping,.fsh-line{animation:none!important}}
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

const Chip = ({
  className,
  depth,
  children,
}: {
  className: string;
  depth: number;
  children: React.ReactNode;
}) => (
  <div className={`absolute z-20 hidden lg:block ${className}`}>
    <div
      className="rounded-2xl border border-white/10 bg-[#141416]/85 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl transition-transform duration-300 ease-out"
      style={{
        transform: `translate3d(calc(var(--px,0) * ${depth}px), calc(var(--py,0) * ${depth * 0.7}px), 0)`,
      }}
    >
      {children}
    </div>
  </div>
);

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

            {/* headline with a rotating subject */}
            <h1 className="mx-auto mt-8 max-w-5xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              <span className="bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              <br className="sm:hidden" />
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
              </span>{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Into Actionable Insights
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
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
            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-xs text-zinc-500 sm:flex-row sm:gap-3">
              <span className="flex gap-0.5 text-amber-300">
                {[0, 1, 2, 3, 4].map((i) => (
                  <AiOutlineStar key={i} size={14} className="fill-current" />
                ))}
              </span>
              <span>
                <span className="font-semibold text-zinc-300">4.9/5</span> from
                30+ active teams
              </span>
              <span className="hidden text-zinc-700 sm:inline">•</span>
              <span>14‑day free trial • No credit card required</span>
            </div>

            {/* product frame */}
            <div className="relative mx-auto mt-16 max-w-5xl [perspective:1800px]">
              <div aria-hidden className="absolute inset-x-12 top-12 h-3/4 rounded-[3rem] bg-indigo-500/10 blur-3xl" />

              <div className="[mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)]">
                <div ref={frameRef} className="fsh-frame relative">
                  <div className="rounded-[22px] bg-gradient-to-b from-white/30 via-white/10 to-white/[0.04] p-px">
                    <div className="relative overflow-hidden rounded-[21px] bg-[#111113]">
                      <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <span className="mx-auto hidden rounded-md bg-white/[0.05] px-10 py-1 text-xs text-zinc-500 sm:block">
                          feedsenseai.vercel.app/dashboard
                        </span>
                      </div>
                      <Image
                        src={img1}
                        alt="FeedSenseAI dashboard"
                        width={1000}
                        height={550}
                        className="h-auto w-full"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Chip className="-left-10 top-24 w-64 text-left xl:-left-20" depth={14}>
                <div className="flex items-center justify-between">
                  <span className="flex gap-0.5 text-amber-300">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <AiOutlineStar key={i} size={14} className="fill-current" />
                    ))}
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Positive
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-zinc-200">
                  Love the new dashboard, everything is so much clearer.
                </p>
              </Chip>

              <Chip className="-right-6 top-1/3 w-60 text-left xl:-right-16" depth={-18}>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <LuBrain size={16} />
                  AI insight
                </div>
                <p className="mt-2 text-sm text-zinc-200">
                  3 themes found across your newest responses.
                </p>
                <div className="mt-3 flex gap-1.5">
                  <span className="h-1.5 flex-[3] rounded-full bg-indigo-400" />
                  <span className="h-1.5 flex-[2] rounded-full bg-violet-400" />
                  <span className="h-1.5 flex-1 rounded-full bg-amber-400" />
                </div>
              </Chip>

              <Chip className="-left-6 bottom-24 w-60 text-left xl:-left-14" depth={10}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Alert
                  </span>
                  <span className="text-[10px] text-zinc-500">just now</span>
                </div>
                <p className="mt-2 text-sm text-zinc-200">
                  Checkout feels confusing. High priority bug report.
                </p>
              </Chip>
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