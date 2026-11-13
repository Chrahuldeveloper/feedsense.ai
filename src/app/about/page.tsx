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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.fsa-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fsa-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(80px,40px,0) scale(1.18)}}
@keyframes fsa-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-70px,-40px,0) scale(.95)}}
@keyframes fsa-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fsa-a{animation:fsa-a 16s ease-in-out infinite}.fsa-b{animation:fsa-b 20s ease-in-out infinite}
.fsa-sheen{background-size:200% 100%;animation:fsa-sheen 7s linear infinite}
.fsa-btn{background-size:200% 100%}.fsa-btn:hover{animation:fsa-sheen 2.2s linear infinite}
@media (prefers-reduced-motion:reduce){.fsa-a,.fsa-b,.fsa-sheen,.fsa-btn:hover{animation:none!important}}
`}</style>
);

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
    className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0d12] p-7 transition-colors hover:border-white/20 sm:p-8 ${className}`}
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(34,211,238,0.14), transparent 60%)",
      }}
    />
    <div className="relative">{children}</div>
  </div>
);

const Page = () => {
  const stats = [
    {
      icon: <FiUsers size={22} />,
      tone: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
      to: 500,
      decimals: 0,
      suffix: "+",
      label: "Companies Trust Us",
    },
    {
      icon: <FiMessageSquare size={22} />,
      tone: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
      to: 10,
      decimals: 0,
      suffix: "M+",
      label: "Feedback Analyzed",
    },
    {
      icon: <FiTarget size={22} />,
      tone: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
      to: 98,
      decimals: 0,
      suffix: "%",
      label: "Accuracy Rate",
    },
    {
      icon: <FiAward size={22} />,
      tone: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
      to: 4.9,
      decimals: 1,
      suffix: "/5",
      label: "Customer Rating",
    },
  ];

  const values = [
    {
      icon: <LuBrain size={26} />,
      grad: "from-cyan-400 to-sky-600",
      title: "Innovation First",
      desc: "We constantly push the boundaries of what's possible with AI to deliver cutting-edge solutions.",
    },
    {
      icon: <HiOutlineUsers size={26} />,
      grad: "from-emerald-400 to-teal-600",
      title: "Customer Success",
      desc: "Your success is our success. We're committed to helping you achieve your goals with our platform.",
    },
    {
      icon: <FiZap size={26} />,
      grad: "from-violet-400 to-fuchsia-600",
      title: "Speed & Reliability",
      desc: "We deliver fast, reliable insights you can trust to make critical business decisions.",
    },
  ];

  return (
    <div className="fsa-root relative w-full overflow-x-clip bg-[#05070a] text-white">
      <Theme />

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fsa-a absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-cyan-500/[0.16] blur-[140px]" />
        <div className="fsa-b absolute -right-40 top-20 h-[40rem] w-[40rem] rounded-full bg-violet-600/[0.18] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* hero */}
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-36 text-center sm:pt-44">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur">
            <HiOutlineSparkles className="text-cyan-300" size={15} />
            Our mission
          </span>
          <h1 className="mt-8 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            About{" "}
            <span className="fsa-sheen bg-gradient-to-r from-cyan-300 via-sky-400 via-40% to-violet-400 bg-clip-text text-transparent">
              FeedSenseAI
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base text-slate-400 sm:text-xl">
            We're on a mission to transform how businesses understand and act on
            user feedback through the power of artificial intelligence.
          </p>
        </section>

        {/* story + stats */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
            <p className="mt-8 border-l-2 border-cyan-400/50 pl-5 text-lg leading-8 text-slate-200">
              Founded in 2023, FeedSenseAI was born from a simple frustration:
              businesses were drowning in user feedback but struggling to
              extract meaningful insights that could drive real change.
            </p>
            <p className="mt-6 leading-7 text-slate-400">
              Our team of AI researchers, product managers, and engineers came
              together to solve this problem by creating the most advanced
              feedback analysis platform on the market.
            </p>
            <p className="mt-4 leading-7 text-slate-400">
              Today, we help over 500 companies worldwide turn their user
              feedback into actionable insights that improve user satisfaction
              and drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-3xl bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.03] p-px ${
                  i % 2 === 1 ? "sm:translate-y-6" : ""
                }`}
              >
                <div className="h-full rounded-[23px] bg-[#0a0d12] p-6 text-center sm:p-8">
                  <span
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ring-1 ring-inset ${s.tone}`}
                  >
                    {s.icon}
                  </span>
                  <p className="mt-5 text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl">
                    <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-sm text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* values */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Our Values
            </h2>
            <p className="mt-5 text-slate-400 sm:text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <SpotCard key={v.title}>
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${v.grad}`}
                >
                  {v.icon}
                </span>
                <h3 className="mt-7 text-xl font-bold md:text-2xl">{v.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{v.desc}</p>
              </SpotCard>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-cyan-500/40 via-sky-500/30 to-violet-600/40 blur-3xl" />
            <div className="relative rounded-[2rem] bg-gradient-to-br from-cyan-400/70 via-white/10 to-violet-500/70 p-px">
              <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#080b10] px-6 py-14 text-center sm:px-14 sm:py-20">
                <div
                  className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Ready to Transform Your{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                    User Feedback?
                  </span>
                </h2>
                <p className="relative mx-auto mt-6 max-w-2xl text-slate-400 sm:text-lg">
                  Join thousands of companies using FeedSenseAI to make
                  smarter, data‑driven decisions. Start your free trial today
                  and see the difference AI can make.
                </p>
                <div className="relative mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/plans">
                    <button className="fsa-btn group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-9 py-4 text-sm font-bold text-[#05070a] shadow-[0_18px_60px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5">
                      Start Free Trial
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
                <p className="relative mt-6 text-sm text-slate-500">
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