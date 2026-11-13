import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CgWebsite } from "react-icons/cg";
import { HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";

interface MobileSideBarProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleLogout: (value: boolean) => void;
  Page: string;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({
  setToggle,
  setToggleLogout,
  Page,
}) => {
  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: MdDashboard,
      active: Page === "Home",
    },
    {
      href: "/dashboard/integrate",
      label: "Integrate",
      icon: CgWebsite,
      active: Page === "Integrate",
    },
    {
      href: "/dashboard/contact",
      label: "Help",
      icon: IoIosCall,
      active: Page === "Help",
    },
  ];

  return (
    <div
      className="fs-root fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden"
      onClick={() => setToggle(false)}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-0 left-0 top-0 flex w-[82vw] max-w-xs flex-col overflow-hidden border-r border-white/[0.1] bg-[#080a0f] px-4 py-5"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-violet-600/20 blur-[70px]" />

        <div className="relative flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b] shadow-[0_0_26px_-4px_rgba(34,211,238,0.8)]">
              <HiOutlineSparkles size={20} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#06080b]">
              FeedSense<span className="text-cyan-400">AI</span>
            </span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setToggle(false)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        <nav className="relative mt-8 flex flex-col gap-1.5">
          {links.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                active
                  ? "bg-gradient-to-r from-cyan-400/20 to-transparent text-[#06080b] ring-1 ring-inset ring-cyan-400/20"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-lg ${
                  active
                    ? "bg-cyan-400/20 text-cyan-300"
                    : "bg-white/[0.05] text-slate-400"
                }`}
              >
                <Icon size={18} />
              </span>
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setToggleLogout(true)}
          className={`relative mt-auto flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 ${
            Page === "Logout" ? "bg-red-500/10" : ""
          }`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10">
            <IoLogOut size={18} />
          </span>
          Logout
        </button>
      </aside>
    </div>
  );
};

export default MobileSideBar;