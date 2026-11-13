"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/10";

const info = [
  {
    icon: <FiMail size={22} />,
    tone: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/25",
    title: "Email Us",
    desc: "Get in touch via email for detailed inquiries",
  },
  {
    icon: <FiPhone size={22} />,
    tone: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    title: "Call Us",
    desc: "Speak directly with our team",
  },
  {
    icon: <FiMapPin size={22} />,
    tone: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
    title: "Visit Us",
    desc: "Come see us at our headquarters",
  },
  {
    icon: <FiClock size={22} />,
    tone: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
    title: "Business Hours",
    desc: "We're here to help during these hours",
  },
];

const InfoCard = ({
  i,
  children,
}: {
  i: number;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 rounded-2xl border border-white/[0.08] p-5 transition-colors hover:border-white/20 bg-white/[0.03]">
    <span
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${info[i].tone}`}
    >
      {info[i].icon}
    </span>
    <div className="space-y-2">
      <h4 className="font-semibold text-white">{info[i].title}</h4>
      <p className="text-sm text-zinc-400">{info[i].desc}</p>
      {children}
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#09090b] text-white antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .fsc-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif}
        @keyframes fsc-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        .fsc-a{animation:fsc-a 18s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.fsc-a{animation:none!important}}
      `}</style>

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

      <div className="fsc-root relative z-10">
        <Navbar />
        <div className="flex flex-col items-center px-4 pt-32 text-center sm:pt-40">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Get in{" "}
            <span className=" text-indigo-300">
              Touch
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-zinc-400 sm:text-lg">
            Have questions about FeedSenseAI? We're here to help you transform
            your user feedback into actionable insights.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-5">
          {/* form */}
          <div className="rounded-3xl p-px lg:col-span-3 bg-white/10">
            <div className="h-full rounded-[23px] bg-[#111113]/95 p-6 backdrop-blur-xl md:p-10">
              <h2 className="text-2xl font-bold tracking-tight">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input placeholder="First Name" className={fieldClass} />
                <input placeholder="Last Name" className={fieldClass} />
              </div>

              <input placeholder="Email" className={`mt-4 ${fieldClass}`} />
              <input placeholder="Company" className={`mt-4 ${fieldClass}`} />

              <select className={`mt-4 [color-scheme:dark] ${fieldClass}`}>
                <option>General Inquiry</option>
                <option>Support</option>
                <option>Partnership</option>
              </select>

              <textarea
                placeholder="Tell us more about your needs..."
                className={`mt-4 min-h-[140px] resize-none ${fieldClass}`}
              />

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30 bg-indigo-500">
                Send Message
                <FiSend size={16} />
              </button>
            </div>
          </div>

          {/* info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="mb-2 space-y-2">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <p className="text-sm text-zinc-400">
                We'd love to hear from you. Choose the best way to reach out to
                us.
              </p>
            </div>

            <InfoCard i={0}>
              <a
                href="mailto:hello@feedsenseai.com"
                className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
              >
                hello@feedsenseai.com
              </a>
            </InfoCard>

            <InfoCard i={1}>
              <a
                href="tel:+15551234567"
                className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
              >
                +1 (555) 123-4567
              </a>
            </InfoCard>

            <InfoCard i={2}>
              <p className="text-sm text-violet-300">
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
              </p>
            </InfoCard>

            <InfoCard i={3}>
              <div className="space-y-1 text-sm">
                <p className="text-amber-300">
                  Monday - Friday: 9:00 AM – 6:00 PM PST
                </p>
                <p className="text-amber-300">
                  Saturday: 10:00 AM – 4:00 PM PST
                </p>
                <p className="text-rose-400">Sunday: Closed</p>
              </div>
            </InfoCard>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;