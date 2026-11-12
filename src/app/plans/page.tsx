"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { TiTickOutline } from "react-icons/ti";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function page() {
  const navigate = useRouter();
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#05070a] text-white antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fsp-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif}
        @keyframes fsp-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        @keyframes fsp-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
        .fsp-a{animation:fsp-a 18s ease-in-out infinite}
        .fsp-btn{background-size:200% 100%}.fsp-btn:hover{animation:fsp-sheen 2.2s linear infinite}
        @media (prefers-reduced-motion:reduce){.fsp-a,.fsp-btn:hover{animation:none!important}}
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fsp-a absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-cyan-500/[0.16] blur-[140px]" />
        <div className="fsp-a absolute -right-40 top-40 h-[40rem] w-[40rem] rounded-full bg-violet-600/[0.18] blur-[150px]" style={{ animationDelay: "-8s" }} />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="fsp-root relative z-10">
        <Navbar />
        <section className="px-6 pb-14 pt-32 text-center sm:pt-40 md:px-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            About{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              FeedSenseAI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            We're on a mission to transform how businesses understand and act on
            user feedback through the power of artificial intelligence.
          </p>
          <p className="mt-10 text-sm font-semibold text-cyan-300">
            Choose your plan
          </p>
        </section>

        <div className="mx-auto flex max-w-5xl flex-col items-stretch justify-center gap-8 px-6 pb-28 md:flex-row">
          {[
            {
              name: "Basic",
              price: "₹499",
              desc: "Perfect for small teams getting started with AI feedback analysis",
              features: [
                { label: "Simple dashboard", available: true },
                { label: "Email support", available: true },
                { label: "3 website integration", available: true },
                { label: "Basic reporting", available: true },
              ],
              highlight: false,
            },
            {
              name: "Pro",
              price: "₹1499",
              desc: "Advanced features for growing businesses and teams",
              features: [
                { label: "Unlimited feedback entries", available: true },
                { label: "Email support", available: true },
                { label: "Advanced sentiment analysis", available: true },
                { label: "Unlimited website integrations", available: true },
                { label: "Advanced feedback analytics", available: true },
                { label: "Priority support", available: true },
                { label: "Add Developers Email", available: true },
              ],
              highlight: true,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative w-full md:max-w-md md:flex-1 ${
                plan.highlight ? "md:-my-3" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-500/40 to-violet-600/40 blur-2xl" />
              )}
              <div
                className={`relative h-full rounded-3xl p-px ${
                  plan.highlight
                    ? "bg-gradient-to-b from-cyan-300 via-white/10 to-violet-500"
                    : "bg-gradient-to-b from-white/20 via-white/[0.05] to-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-1.5 text-xs font-bold text-[#05070a] shadow-lg">
                    <HiOutlineSparkles size={14} />
                    Most Popular
                  </div>
                )}
                <div className="flex h-full flex-col space-y-6 rounded-[23px] bg-[#0a0d12] p-7 sm:p-9">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {plan.name.toUpperCase()}
                    </h3>
                    <p className="text-sm text-slate-400">{plan.desc}</p>
                    <p className="pt-2 text-5xl font-extrabold tracking-tight text-white">
                      {plan.price}
                      <span className="ml-1 text-base font-medium text-slate-500">
                        /month
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      navigate.push(`/subscription/${plan.name}`);
                    }}
                    className={`group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5 ${
                      plan.highlight
                        ? "fsp-btn bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 text-[#05070a] shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)]"
                        : "border border-white/15 bg-white/[0.05] text-white hover:bg-white/10"
                    }`}
                  >
                    Grab Now
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <ul className="space-y-3.5 border-t border-white/[0.07] pt-6 text-sm">
                    {plan.features.map((f, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 ${
                          f.available ? "text-slate-200" : "text-slate-600 line-through"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                            f.available
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-white/5 text-slate-600"
                          }`}
                        >
                          <TiTickOutline size={14} />
                        </span>
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}