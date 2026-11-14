"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EXIT_MS = 260;

type NavLink = { href: string; label: string; icon: React.ReactNode };

/* ---------- animated mobile menu ---------- */
const MobileMenu = ({
  links,
  userSession,
  isActive,
  onClose,
}: {
  links: NavLink[];
  userSession: string | null;
  isActive: (href: string) => boolean | undefined;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setOpen(true));
    });
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
      document.body.style.overflow = prev;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const close = () => {
    if (timer.current) return;
    setOpen(false);
    setDragY(0);
    timer.current = setTimeout(onClose, EXIT_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = (i: number): React.CSSProperties => ({
    transform: open ? "translate3d(0,0,0)" : "translate3d(0,14px,0)",
    opacity: open ? 1 : 0,
    transition: `transform 540ms ${EASE}, opacity 380ms ease-out`,
    transitionDelay: open ? `${90 + i * 60}ms` : "0ms",
  });

  return (
    <div
      className="fixed inset-0 z-[70] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        style={{
          opacity: open ? Math.max(0.2, 1 - Math.abs(dragY) / 260) : 0,
          transition: dragging ? "none" : `opacity ${open ? 400 : EXIT_MS}ms ease-out`,
        }}
      />

      <nav
        onTouchStart={(e) => {
          startY.current = e.touches[0].clientY;
          setDragging(true);
        }}
        onTouchMove={(e) =>
          setDragY(Math.min(0, e.touches[0].clientY - startY.current))
        }
        onTouchEnd={() => {
          setDragging(false);
          if (dragY < -70) close();
          else setDragY(0);
        }}
        className="absolute inset-x-3 top-3 touch-pan-x rounded-3xl bg-white/10 p-px shadow-2xl shadow-black/60"
        style={{
          transform: open
            ? `translate3d(0,${dragY}px,0) scale(1)`
            : "translate3d(0,-18px,0) scale(0.97)",
          opacity: open ? 1 : 0,
          transformOrigin: "top center",
          transition: dragging
            ? "none"
            : `transform ${open ? 520 : EXIT_MS}ms ${open ? EASE : "ease-in"}, opacity ${
                open ? 320 : EXIT_MS
              }ms ease-out`,
        }}
      >
        <div className="relative overflow-hidden rounded-[23px] bg-[#111113]/95 p-4 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(80%_100%_at_30%_0%,rgba(129,140,248,0.12),transparent)]" />

          {/* header */}
          <div
            className="relative flex items-center justify-between px-2 pb-3 pt-1"
            style={enter(0)}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-white">
                <HiOutlineSparkles size={20} />
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">
                FeedSense<span className="text-indigo-400">.ai</span>
              </span>
            </div>
            <button
              aria-label="Close menu"
              onClick={close}
              className="grid h-10 w-10 place-items-center rounded-xl text-zinc-300 transition-all duration-300 hover:rotate-90 hover:bg-white/10 active:scale-90"
            >
              <RxCross2 size={24} />
            </button>
          </div>

          {/* links */}
          <div className="relative flex flex-col gap-1">
            {links.map((l, i) => {
              const active = isActive(l.href);
              return (
                <div key={l.href} style={enter(i + 1)}>
                  <Link
                    href={l.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-4 rounded-xl px-3.5 py-3.5 text-[15px] font-medium transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? "bg-indigo-400/[0.12] text-white ring-1 ring-inset ring-indigo-400/20"
                        : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                        active
                          ? "bg-indigo-400/20 text-indigo-300"
                          : "bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {l.icon}
                    </span>
                    <span className="flex-1">{l.label}</span>
                    <FiChevronRight
                      size={16}
                      className={`transition-all duration-300 ${
                        active
                          ? "text-indigo-300"
                          : "text-zinc-700 group-hover:translate-x-0.5 group-hover:text-zinc-400"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* action */}
          <div
            className="relative mt-3 border-t border-white/[0.07] pt-3"
            style={enter(links.length + 1)}
          >
            {userSession === null ? (
              <Link href="/login" onClick={close}>
                <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.98]">
                  <FiLogIn size={20} />
                  Login
                </button>
              </Link>
            ) : (
              <Link href="/dashboard" onClick={close}>
                <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.98]">
                  <FiUser size={20} />
                  Your Account
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

/* ---------- navbar ---------- */
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

  const mobileLinks: NavLink[] = [
    { href: "/", label: "Home", icon: <FiHome size={18} /> },
    { href: "/about", label: "About", icon: <FiInfo size={18} /> },
    ...(paid !== "true"
      ? [{ href: "/plans", label: "Plans", icon: <FiCreditCard size={18} /> }]
      : []),
  ];

  /* ---------- sliding hover pill (desktop) ---------- */
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });

  const activeIdx = links.findIndex((l) => isActive(l.href));
  const shownIdx = hover ?? activeIdx;

  useEffect(() => {
    const place = () => {
      const el = shownIdx >= 0 ? itemRefs.current[shownIdx] : null;
      const list = listRef.current;
      if (!el || !list) {
        setPill((p) => ({ ...p, show: false }));
        return;
      }
      const lr = list.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setPill({ x: r.left - lr.left, w: r.width, show: true });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [shownIdx, pathname]);

  return (
    <>
      <style>{`
        @keyframes fsn-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
        .fsn-in { animation: fsn-in .6s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .fsn-in { animation: none; } }
      `}</style>

      <nav
        className={`fsn-in fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "border-white/[0.08] bg-[#09090b]/75 backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-sm"
        }`}
      >
        <div
          className={`relative mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8 lg:px-10 ${
            isScrolled ? "h-16" : "h-[4.5rem]"
          }`}
        >
          {/* logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-white transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-105">
              <HiOutlineSparkles size={20} />
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              FeedSense<span className="text-indigo-400">.ai</span>
            </h1>
          </Link>

          {/* desktop links */}
          <ul
            ref={listRef}
            onMouseLeave={() => setHover(null)}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-sm backdrop-blur-xl md:flex"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-1.5 left-0 top-1.5 rounded-full bg-white/10"
              style={{
                width: pill.w,
                transform: `translateX(${pill.x}px)`,
                opacity: pill.show ? 1 : 0,
                transition: `transform 380ms ${EASE}, width 380ms ${EASE}, opacity 200ms ease-out`,
              }}
            />
            {links.map((l, i) => (
              <li
                key={l.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onMouseEnter={() => setHover(i)}
                className="relative z-10"
              >
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-full px-5 py-2 font-medium transition-colors duration-200 ${
                    shownIdx === i ? "text-white" : "text-zinc-400"
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
                <span className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 active:translate-y-0">
                  Login
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 active:translate-y-0">
                  Your Account
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
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
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition active:scale-95 hover:bg-white/10 md:hidden"
          >
            <CiMenuFries size={22} />
          </button>
        </div>
      </nav>

      {toogle ? (
        <MobileMenu
          links={mobileLinks}
          userSession={userSession}
          isActive={isActive}
          onClose={() => settoogle(false)}
        />
      ) : null}
    </>
  );
};

export default Navbar;