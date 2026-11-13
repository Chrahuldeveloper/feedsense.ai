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
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#09090b] text-white antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .fsp-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif}
        @keyframes fsp-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        @keyframes fsp-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
        .fsp-a{animation:fsp-a 18s ease-in-out infinite}
        @keyframes fsp-border{0%{background-position:0% 50%}100%{background-position:300% 50%}}
        .fsp-border{background:linear-gradient(120deg,#818cf8,#a78bfa,#818cf8,#a78bfa);background-size:300% 100%;animation:fsp-border 8s linear infinite}
        .fsp-btn{background-size:200% 100%}.fsp-btn:hover{animation:fsp-sheen 2.2s linear infinite}
        @media (prefers-reduced-motion:reduce){.fsp-a,.fsp-btn:hover,.fsp-border{animation:none!important}}
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

      <div className="fsp-root relative z-10">
        <Navbar />
        <section className="px-6 pb-14 pt-32 text-center sm:pt-40 md:px-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            About{" "}
            <span className=" text-indigo-300">
              FeedSenseAI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            We're on a mission to transform how businesses understand and act on
            user feedback through the power of artificial intelligence.
          </p>
          <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-indigo-300 backdrop-blur">
            <HiOutlineSparkles size={14} />
            Choose your plan
          </div>
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
              <div
                className={`relative h-full rounded-3xl p-px ${
 plan.highlight
 ? "bg-indigo-500"
 : " bg-white/10"
 }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg bg-indigo-500 hover:bg-indigo-400">
                    <HiOutlineSparkles size={14} />
                    Most Popular
                  </div>
                )}
                <div className="flex h-full flex-col space-y-6 rounded-[23px] bg-[#111113] p-7 sm:p-9">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {plan.name.toUpperCase()}
                    </h3>
                    <p className="text-sm text-zinc-400">{plan.desc}</p>
                    <p className="pt-2 text-5xl font-semibold tracking-tight text-white">
                      {plan.price}
                      <span className="ml-1 text-base font-medium text-zinc-500">
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
 ? " text-white bg-indigo-500"
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
 f.available ? "text-zinc-200" : "text-zinc-600 line-through"
 }`}
                      >
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
 f.available
 ? "bg-emerald-400/15 text-emerald-300"
 : "bg-white/5 text-zinc-600"
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
        <section className="mx-auto max-w-3xl px-6 pb-28">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-10 space-y-3">
            {[
              {
                q: "Is there a free trial?",
                a: "Yes. Start with a 14-day free trial. No credit card required.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. You can cancel anytime, with no long-term commitment.",
              },
              {
                q: "Which plan should I pick?",
                a: "Basic suits small teams getting started with up to 3 websites. Pro adds unlimited websites and feedback, advanced analytics and priority support.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 transition-colors open:border-indigo-400/30 open:bg-white/[0.05]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-lg leading-none text-indigo-300 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}