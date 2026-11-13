"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LuBrain } from "react-icons/lu";
import {
  FiUsers,
  FiMessageSquare,
  FiTarget,
  FiAward,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi2";

/* ---------- UI-only helpers ---------- */

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fsa-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fsa-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(80px,40px,0) scale(1.18)}}
@keyframes fsa-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-70px,-40px,0) scale(.95)}}
@keyframes fsa-spin{to{transform:rotate(360deg)}}
@keyframes fsa-ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.4);opacity:0}}
@keyframes fsa-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fsa-a{animation:fsa-a 16s ease-in-out infinite}.fsa-b{animation:fsa-b 20s ease-in-out infinite}
.fsa-spin{animation:fsa-spin linear infinite}
.fsa-ping{animation:fsa-ping 3s ease-out infinite}
.fsa-sheen{background-size:200% 100%;animation:fsa-sheen 7s linear infinite}
.fsa-btn{background-size:200% 100%}.fsa-btn:hover{animation:fsa-sheen 2.2s linear infinite}
.fsa-outline{-webkit-text-stroke:1.5px rgba(255,255,255,.16);color:transparent}
@media (prefers-reduced-motion:reduce){.fsa-a,.fsa-b,.fsa-spin,.fsa-ping,.fsa-sheen,.fsa-btn:hover{animation:none!important}}
`}</style>
);

/* fade + rise when scrolled into view */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
 show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
 } ${className}`}
    >
      {children}
    </div>
  );
};

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
          const p = Math.min((now - start) / 1800, 1);
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

/* feedback chips orbiting an AI core */
const chipTones: Record<string, string> = {
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

const rings = [
  {
    inset: "0%",
    duration: 46,
    chips: [
      { a: 20, l: "Love it", t: "emerald" },
      { a: 140, l: "Bug on login", t: "rose" },
      { a: 255, l: "Dark mode?", t: "violet" },
    ],
  },
  {
    inset: "17%",
    duration: 32,
    chips: [
      { a: 70, l: "Too slow", t: "amber" },
      { a: 200, l: "Great support", t: "emerald" },
      { a: 320, l: "Confusing", t: "rose" },
    ],
  },
];

const Orbit = () => (
  <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
    

    {rings.map((r, ri) => (
      <div
        key={ri}
        className="absolute rounded-full border border-white/10"
        style={{ inset: r.inset }}
      >
        <div
          className="fsa-spin absolute inset-0"
          style={{ animationDuration: `${r.duration}s` }}
        >
          {r.chips.map((c) => (
            <div
              key={c.l}
              className="absolute inset-0"
              style={{ transform: `rotate(${c.a}deg)` }}
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div style={{ transform: `rotate(${-c.a}deg)` }}>
                  <div
                    className="fsa-spin"
                    style={{
                      animationDuration: `${r.duration}s`,
                      animationDirection: "reverse",
                    }}
                  >
                    <span
                      className={`block whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md sm:text-xs ${chipTones[c.t]}`}
                    >
                      {c.l}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* inner ring */}
    <div className="absolute inset-[34%] rounded-full border border-indigo-400/30" />

    {/* core */}
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative">
        
        
        <div className="relative grid h-24 w-24 place-items-center rounded-full text-white sm:h-28 sm:w-28 bg-indigo-500">
          <LuBrain size={42} />
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [activeValue, setActiveValue] = useState(0);

  /* scroll progress bar */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chapters = [
    {
      tag: "2023",
      title: "Born from frustration",
      body: "Founded in 2023, FeedSenseAI was born from a simple frustration: businesses were drowning in user feedback but struggling to extract meaningful insights that could drive real change.",
    },
    {
      tag: "The team",
      title: "Researchers, managers, engineers",
      body: "Our team of AI researchers, product managers, and engineers came together to solve this problem by creating the most advanced feedback analysis platform on the market.",
    },
    {
      tag: "Today",
      title: "Signal over noise, worldwide",
      body: "Today, we help over 500 companies worldwide turn their user feedback into actionable insights that improve user satisfaction and drive business growth.",
    },
  ];

  const stats = [
    { icon: <FiUsers size={20} />, to: 500, decimals: 0, suffix: "+", label: "Companies Trust Us", c: "text-indigo-300" },
    { icon: <FiMessageSquare size={20} />, to: 10, decimals: 0, suffix: "M+", label: "Feedback Analyzed", c: "text-emerald-300" },
    { icon: <FiTarget size={20} />, to: 98, decimals: 0, suffix: "%", label: "Accuracy Rate", c: "text-amber-300" },
    { icon: <FiAward size={20} />, to: 4.9, decimals: 1, suffix: "/5", label: "Customer Rating", c: "text-violet-300" },
  ];

  const values = [
    {
      n: "01",
      icon: <LuBrain size={28} />,
      grad: "from-indigo-500 to-indigo-600",
      glow: "bg-indigo-500/25",
      title: "Innovation First",
      desc: "We constantly push the boundaries of what's possible with AI to deliver cutting-edge solutions.",
    },
    {
      n: "02",
      icon: <HiOutlineUsers size={28} />,
      grad: "from-emerald-500 to-emerald-600",
      glow: "bg-emerald-500/25",
      title: "Customer Success",
      desc: "Your success is our success. We're committed to helping you achieve your goals with our platform.",
    },
    {
      n: "03",
      icon: <FiZap size={28} />,
      grad: "from-violet-500 to-violet-600",
      glow: "bg-violet-500/25",
      title: "Speed & Reliability",
      desc: "We deliver fast, reliable insights you can trust to make critical business decisions.",
    },
  ];

  return (
    <div className="fsa-root relative w-full overflow-x-clip bg-[#09090b] text-white">
      <Theme />

      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-indigo-500"
        />
      </div>

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
          }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              background:
                "radial-gradient(500px circle at var(--mx,70%) var(--my,40%), rgba(129,140,248,0.10), transparent 60%)",
            }}
          />
          <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-16 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-10">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur">
                <HiOutlineSparkles className="text-indigo-300" size={15} />
                Our mission
              </span>
              <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl xl:text-8xl">
                About{" "}
                <span className=" block text-indigo-300">
                  FeedSenseAI
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-base text-zinc-400 sm:text-xl lg:mx-0">
                We're on a mission to transform how businesses understand and
                act on user feedback through the power of artificial
                intelligence.
              </p>
              <a
                href="#story"
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                Read our story <FiArrowRight />
              </a>
            </div>

            <Orbit />
          </div>
        </section>

        {/* ================= STORY TIMELINE ================= */}
        <section id="story" className="mx-auto max-w-5xl px-6 py-24 sm:px-8 lg:py-32">
          <Reveal className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Our Story
            </h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-indigo-500" />
          </Reveal>

          <div className="relative mt-20">
            <div className="absolute bottom-0 left-4 top-0 w-px md:left-1/2 bg-white/10" />

            <div className="space-y-16 md:space-y-24">
              {chapters.map((c, i) => (
                <div key={c.tag} className="relative md:grid md:grid-cols-2 md:gap-20">
                  <span className="absolute left-4 top-3 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center md:left-1/2">
                    <span className="h-4 w-4 rounded-full ring-4 ring-[#09090b] bg-indigo-500" />
                  </span>
                  <Reveal
                    className={`pl-12 md:pl-0 ${
 i % 2 === 0
 ? "md:col-start-1 md:pr-4 md:text-right"
 : "md:col-start-2 md:pl-4"
 }`}
                  >
                    <p className=" text-5xl font-semibold tracking-tight sm:text-6xl text-indigo-300">
                      {c.tag}
                    </p>
                    <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                      {c.title}
                    </h3>
                    <p className="mt-3 leading-7 text-zinc-400">{c.body}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HUGE STATS ================= */}
        <section className="relative border-y border-white/[0.07] bg-white/[0.03]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.08),transparent_70%)]" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 100}
                className={`px-4 py-14 text-center sm:py-20 ${
 i % 2 === 1 ? "border-l border-white/[0.07]" : ""
 } ${i > 0 ? "lg:border-l lg:border-white/[0.07]" : ""} ${
 i > 1 ? "border-t border-white/[0.07] lg:border-t-0" : ""
 }`}
              >
                <span className={`mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-inset ring-white/10 ${s.c}`}>
                  {s.icon}
                </span>
                <p className="mt-6 text-5xl font-semibold tabular-nums tracking-tight sm:text-7xl text-white">
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm text-zinc-400 sm:text-base">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= VALUES (expanding panels) ================= */}
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Our Values
            </h2>
            <p className="mt-5 text-zinc-400 sm:text-lg">
              The principles that guide everything we do
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-4 lg:h-[30rem] lg:flex-row">
            {values.map((v, i) => (
              <div
                key={v.title}
                onMouseEnter={() => setActiveValue(i)}
                onClick={() => setActiveValue(i)}
                className={`relative flex min-h-[18rem] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border p-7 transition-all duration-500 ease-out sm:p-9 ${
 activeValue === i
 ? "border-white/25 bg-[#141416] lg:flex-[2.2]"
 : "border-white/[0.08] bg-[#111113] lg:flex-1"
 }`}
              >
                
                <span className="fsa-outline absolute right-6 top-2 text-8xl font-semibold leading-none sm:text-9xl">
                  {v.n}
                </span>

                <div className="relative">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${v.grad}`}
                  >
                    {v.icon}
                  </span>
                  <h3 className="mt-6 whitespace-nowrap text-2xl font-bold sm:text-3xl">
                    {v.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-md leading-7 text-zinc-400 transition-all duration-500 ${
 activeValue === i
 ? "opacity-100 lg:max-h-40"
 : "opacity-100 lg:max-h-0 lg:opacity-0"
 } overflow-hidden`}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <div className="relative">
              
              <div className="relative rounded-[2rem] p-px bg-white/10">
                <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#111113] px-6 py-16 text-center sm:px-14 sm:py-24">
                  
                  <h2 className="relative text-4xl font-semibold tracking-tight sm:text-6xl">
                    Ready to Transform Your{" "}
                    <span className=" text-indigo-300">
                      User Feedback?
                    </span>
                  </h2>
                  <p className="relative mx-auto mt-6 max-w-2xl text-zinc-400 sm:text-lg">
                    Join thousands of companies using FeedSenseAI to make
                    smarter, data‑driven decisions. Start your free trial today
                    and see the difference AI can make.
                  </p>
                  <div className="relative mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/plans">
                      <button className=" group inline-flex items-center justify-center gap-2 rounded-2xl px-10 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 bg-indigo-500 hover:bg-indigo-400">
                        Start Free Trial
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                  <p className="relative mt-6 text-sm text-zinc-500">
                    No credit card required • 14‑day free trial • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Page;