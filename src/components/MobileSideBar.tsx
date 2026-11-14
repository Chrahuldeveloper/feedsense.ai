"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CgWebsite, CgProfile } from "react-icons/cg";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FaLink } from "react-icons/fa6";
import { IoMdHelpCircle } from "react-icons/io";
import Link from "next/link";
import useAuth from "@/hooks/CurrentUser";

interface MobileSideBarProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleLogout: (value: boolean) => void;
  Page: string;
}

const EXIT_MS = 300;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const MobileSideBar: React.FC<MobileSideBarProps> = ({
  setToggle,
  setToggleLogout,
  Page,
}) => {
  const { user } = useAuth() as {
    user: { displayName?: string; email?: string } | null;
  };

  const links = [
    { href: "/dashboard", key: "Home", label: "Home", icon: MdDashboard },
    {
      href: "/dashboard/integrate",
      key: "Integrate",
      label: "Integrate",
      icon: CgWebsite,
    },
    {
      href: "/dashboard/connected-websites",
      key: "Your websites",
      label: "Your websites",
      icon: FaLink,
    },
    {
      href: "/dashboard/profile",
      key: "My Profile",
      label: "My Profile",
      icon: CgProfile,
    },
    {
      href: "/contactUs",
      key: "Contact",
      label: "Help",
      icon: IoMdHelpCircle,
    },
  ];

  const isActive = (k: string) =>
    Page === k ||
    (k === "Contact" && Page === "Help") ||
    (k === "My Profile" && Page === "Profile");

  const [open, setOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const panelRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const close = (after?: () => void) => {
    if (timer.current) return;
    setOpen(false);
    setDragX(0);
    timer.current = setTimeout(() => {
      setToggle(false);
      after?.();
    }, EXIT_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    setDragX(Math.min(0, dx));
  };
  const onTouchEnd = () => {
    setDragging(false);
    const w = panelRef.current?.offsetWidth ?? 300;
    if (dragX < -w * 0.28) close();
    else setDragX(0);
  };

  const panelW = panelRef.current?.offsetWidth ?? 320;
  const backdropOpacity = open
    ? 1 - Math.min(1, Math.abs(dragX) / panelW) * 0.9
    : 0;

  const enter = (i: number): React.CSSProperties => ({
    transform: open ? "translate3d(0,0,0)" : "translate3d(-18px,0,0)",
    opacity: open ? 1 : 0,
    transition: `transform 560ms ${EASE_OUT}, opacity 420ms ease-out`,
    transitionDelay: open ? `${120 + i * 55}ms` : "0ms",
  });

  return (
    <div
      className="fs-root fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        onClick={() => close()}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        style={{
          opacity: backdropOpacity,
          transition: dragging ? "none" : `opacity ${open ? 420 : EXIT_MS}ms ease-out`,
        }}
      />

      <aside
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="absolute bottom-0 left-0 top-0 flex w-[84vw] max-w-[320px] touch-pan-y flex-col overflow-hidden border-r border-white/[0.08] bg-[#0b0b0d] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl shadow-black/60"
        style={{
          transform: open ? `translate3d(${dragX}px,0,0)` : "translate3d(-100%,0,0)",
          transition: dragging
            ? "none"
            : `transform ${open ? 520 : EXIT_MS}ms ${open ? EASE_OUT : "cubic-bezier(0.4, 0, 1, 1)"}`,
          willChange: "transform",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(80%_100%_at_30%_0%,rgba(129,140,248,0.12),transparent)]" />

        <div className="relative flex items-center justify-between px-1" style={enter(0)}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 text-white">
              <HiOutlineSparkles size={20} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              FeedSense<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => close()}
            className="grid h-9 w-9 place-items-center rounded-lg text-zinc-300 transition-all duration-300 hover:rotate-90 hover:bg-white/10 active:scale-90"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        {/* nav */}
        <nav className="relative mt-8 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none]">
          <p
            className="mb-3 px-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600"
            style={enter(1)}
          >
            Menu
          </p>
          <div className="flex flex-col gap-1">
            {links.map(({ href, label, icon: Icon, key }, i) => {
              const active = isActive(key);
              return (
                <div key={key} style={enter(i + 2)}>
                  <Link
                    href={href}
                    onClick={() => close()}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? "bg-indigo-400/[0.12] text-white ring-1 ring-inset ring-indigo-400/20"
                        : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute -left-4 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-400" />
                    )}
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors duration-200 ${
                        active
                          ? "bg-indigo-400/20 text-indigo-300"
                          : "bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="relative mt-4 space-y-2 border-t border-white/[0.07] pt-4">
          <div style={enter(links.length + 2)}>
            <Link
              href="/dashboard/profile"
              onClick={() => close()}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-500 text-sm font-semibold text-white ring-2 ring-white/10">
                {(user?.displayName || "U").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  {user?.displayName || "User"}
                </span>
                <span className="block truncate text-xs text-zinc-500">
                  {user?.email || "Signed in"}
                </span>
              </span>
            </Link>
          </div>

          <div style={enter(links.length + 3)}>
            <button
              onClick={() => close(() => setToggleLogout(true))}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 active:scale-[0.98] ${
                Page === "Logout" ? "bg-red-500/10" : ""
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10">
                <IoLogOut size={18} />
              </span>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSideBar;