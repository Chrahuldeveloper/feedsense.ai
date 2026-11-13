"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import Cookies from "js-cookie";
import { RxCross2 } from "react-icons/rx";
import {
  FiHome,
  FiInfo,
  FiCreditCard,
  FiLogIn,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userSession, setUserSession] = useState<string | null>(null);

  const [toogle, settoogle] = useState<boolean>(false);

  const [paid, setPaid] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const getsubstatus = localStorage.getItem("paid");
    setPaid(getsubstatus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const token = Cookies.get("auth-token");
    setUserSession(token ?? null);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/plans", label: "Plans" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-white/[0.08] bg-[#05070a]/70 backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a] shadow-[0_0_28px_-4px_rgba(34,211,238,0.7)]">
              <HiOutlineSparkles size={20} />
            </span>
            <h1 className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              FeedSense.ai
            </h1>
          </Link>

          {/* desktop links */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-sm backdrop-blur-xl md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-full px-5 py-2 font-semibold transition-colors ${
                    isActive(l.href)
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* desktop action */}
          <div className="hidden items-center md:flex">
            {userSession === null ? (
              <Link href="/login">
                <span className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-bold text-[#05070a] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 hover:brightness-110">
                  Login
                  <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-bold text-[#05070a] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 hover:brightness-110">
                  Your Account
                  <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            )}
          </div>

          {/* mobile trigger */}
          <button
            aria-label="Open menu"
            onClick={() => {
              settoogle(true);
            }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/10 md:hidden"
          >
            <CiMenuFries size={22} />
          </button>
        </div>
      </nav>

      {toogle ? (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md md:hidden"
          onClick={() => settoogle(false)}
        >
          <nav
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 top-3 rounded-3xl bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/20 p-px shadow-[0_30px_80px_-20px_rgba(34,211,238,0.35)]"
          >
            <div className="rounded-[23px] bg-[#0a0d12]/95 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between px-2 pb-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a]">
                    <HiOutlineSparkles size={20} />
                  </span>
                  <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-lg font-bold text-transparent">
                    FeedSense.ai
                  </span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => {
                    settoogle(false);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10"
                >
                  <RxCross2 size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <Link href="/" onClick={() => settoogle(false)}>
                  <div
                    className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      isActive("/")
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    <FiHome size={20} />
                    Home
                  </div>
                </Link>

                <Link href="/about" onClick={() => settoogle(false)}>
                  <div
                    className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      isActive("/about")
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    <FiInfo size={20} />
                    About
                  </div>
                </Link>

                {paid !== "true" ? (
                  <Link href="/plans" onClick={() => settoogle(false)}>
                    <div
                      className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                        isActive("/plans")
                          ? "bg-cyan-400/10 text-cyan-300"
                          : "text-slate-200 hover:bg-white/[0.06]"
                      }`}
                    >
                      <FiCreditCard size={20} />
                      Plans
                    </div>
                  </Link>
                ) : null}
              </div>

              <div className="mt-3 border-t border-white/[0.07] pt-3">
                {userSession === null ? (
                  <Link href="/login" onClick={() => settoogle(false)}>
                    <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3.5 text-sm font-bold text-[#05070a] shadow-[0_12px_30px_-10px_rgba(34,211,238,0.8)]">
                      <FiLogIn size={20} />
                      Login
                    </button>
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => settoogle(false)}>
                    <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3.5 text-sm font-bold text-[#05070a] shadow-[0_12px_30px_-10px_rgba(34,211,238,0.8)]">
                      <FiUser size={20} />
                      Your Account
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default Navbar;