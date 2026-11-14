"use client";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiPlus,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiX,
  FiGlobe,
  FiMessageSquare,
  FiBarChart2,
  FiAward,
} from "react-icons/fi";
import { CiGlobe, CiMenuFries } from "react-icons/ci";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { HiOutlineSparkles } from "react-icons/hi2";
import MobileSideBar from "./MobileSideBar";
import ModelLogout from "./ModelLogout";

interface Plan {
  subscription: string;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

interface WebsiteData {
  name: string;
  url: string;
  type: string;
  image: string;
  feedback?: string[];
}

/* ---------- UI-only helpers ---------- */

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fs-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fs-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(60px,30px,0) scale(1.15)}}
@keyframes fs-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-50px,-30px,0) scale(0.95)}}
@keyframes fs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fs-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fs-drift-a{animation:fs-drift-a 14s ease-in-out infinite}
.fs-drift-b{animation:fs-drift-b 18s ease-in-out infinite}
.fs-rise{animation:fs-rise .7s cubic-bezier(.2,.7,.2,1) both}
.fs-gradient-text{background:linear-gradient(110deg,#ffffff 15%,#67e8f9 50%,#c4b5fd 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
.fs-btn{background-image:linear-gradient(110deg,#818cf8 0%,#818cf8 50%,#818cf8 100%);background-size:200% 100%}
.fs-btn:hover{animation:fs-sheen 2.4s linear infinite}
.fs-grid{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:44px 44px}
@media (prefers-reduced-motion:reduce){.fs-drift-a,.fs-drift-b,.fs-rise,.fs-btn:hover{animation:none!important}}
`}</style>
);


const avatarGradients = [
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-sky-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
];

const PAGE_SIZE = 8;

type SortKey = "name" | "type" | "feedback";
type Tone = "indigo" | "violet" | "emerald" | "amber";

const tones: Record<Tone, string> = {
  indigo: "text-indigo-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
};

const Surface = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-2xl bg-white/10 p-px ${className}`}>
    <div className="relative h-full overflow-hidden rounded-[15px] bg-[#111113]">
      {children}
    </div>
  </div>
);

const SortIcon = ({ dir }: { dir: "asc" | "desc" | null }) => (
  <span className="ml-1.5 inline-flex flex-col leading-none">
    <FiChevronUp
      size={11}
      className={dir === "asc" ? "text-indigo-300" : "text-zinc-700"}
    />
    <FiChevronDown
      size={11}
      className={`-mt-0.5 ${dir === "desc" ? "text-indigo-300" : "text-zinc-700"}`}
    />
  </span>
);

const cleanUrl = (u: string) =>
  (u || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

const thClass =
  "px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500";

export default function Showwebsites() {
  const [toggle, setToggle] = useState(false);

  const db1 = useMemo(() => new dbService(), []);
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [plan, setPlan] = useState<Plan | null>(null);
  const [websitedata, setWebsitedata] = useState<WebsiteData[]>([]);
  const [toggleLogout, setToggleLogout] = useState(false);

  useEffect(() => {
    const checkPlan = async () => {
      if (!loading && user) {
        const userDocRef = doc(db, "USERS", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userPlan = docSnap.data()?.subscription;
        console.log(userPlan);
        setPlan({ subscription: userPlan });
      }
    };
    checkPlan();
  }, [loading, user]);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!user || loading) return;

      try {
        const data = await db1.fetchWebsites(user);
        console.log("Fetched Websites Data from Firestore:", data);

        const transformedData = data.map((item: any) => ({
          name: item.name || "",
          url: item.url || "",
          type: item.type || "",
          image: item.image || "",
          feedback: item.feedback || [],
        }));

        setWebsitedata(transformedData);
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
    };

    fetchWebsites();
  }, [loading, user, db1]);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "personal" | "business">("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageNo, setPageNo] = useState(0);

  const maxFeedback = Math.max(
    1,
    ...websitedata.map((s) => s?.feedback?.length ?? 0)
  );

  const initial = (user?.displayName || "U").charAt(0).toUpperCase();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = websitedata.filter(
      (s) =>
        (typeFilter === "all" || s.type.toLowerCase() === typeFilter) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q))
    );
    if (sortKey) {
      list = [...list].sort((a, b) => {
        let r = 0;
        if (sortKey === "feedback")
          r = (a.feedback?.length ?? 0) - (b.feedback?.length ?? 0);
        else r = a[sortKey].localeCompare(b[sortKey]);
        return sortDir === "asc" ? r : -r;
      });
    }
    return list;
  }, [websitedata, query, typeFilter, sortKey, sortDir]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(pageNo, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = rows.slice(start, end);

  const toggleSort = (k: SortKey) => {
    if (sortKey !== k) {
      setSortKey(k);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
    setPageNo(0);
  };

  const sortable = (k: SortKey, label: string) => (
    <th
      className={thClass}
      aria-sort={
        sortKey === k ? (sortDir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className="inline-flex items-center uppercase tracking-[0.14em] transition hover:text-zinc-300"
      >
        {label}
        <SortIcon dir={sortKey === k ? sortDir : null} />
      </button>
    </th>
  );

  const typeTabs: { k: "all" | "personal" | "business"; l: string }[] = [
    { k: "all", l: "All" },
    { k: "personal", l: "Personal" },
    { k: "business", l: "Business" },
  ];

  return (
    <>
      <Theme />
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
        </div>

        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-semibold tracking-tight text-white">
                FeedSense.ai
              </h1>
            </div>
            <p className="hidden text-sm text-zinc-500 md:block">
              Workspace <span className="mx-1.5 text-zinc-700">/</span>
              <span className="text-zinc-200">Your Websites</span>
            </p>
            <div className="flex items-center gap-3">
              {plan?.subscription && (
                <span className="hidden items-center gap-1.5 rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-semibold capitalize text-indigo-200 ring-1 ring-inset ring-indigo-400/30 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                  {plan.subscription}
                </span>
              )}
              <div className="hidden items-center gap-3 border-l border-white/[0.08] pl-4 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-zinc-300">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white ring-2 ring-white/10">
                  {initial}
                </span>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setToggle(true)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10 md:hidden"
              >
                <CiMenuFries size={20} />
              </button>
            </div>
          </div>
        </header>

        {toggle && (
          <MobileSideBar
            Page="Your websites"
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {/* ---------- Heading row ---------- */}
          <section className="fs-rise flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">Websites</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your Websites
              </h1>
              <p className="mt-2 text-zinc-400">
                Every site collecting feedback with FeedSenseAI
              </p>
            </div>
            <Link
              href="/dashboard/integrate"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400 sm:self-auto"
            >
              <FiPlus size={16} />
              Connect a website
            </Link>
          </section>

          {/* ---------- Websites table ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.1s" }}>
            {loading ? (
              <Surface>
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="h-5 w-36 animate-pulse rounded-md bg-white/[0.07]" />
                  <div className="h-9 w-56 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>
                <div className="divide-y divide-white/[0.05] border-t border-white/[0.06]">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-40 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-3 w-28 animate-pulse rounded bg-white/[0.04]" />
                      </div>
                      <div className="hidden h-2 w-32 animate-pulse rounded-full bg-white/[0.06] md:block" />
                      <div className="h-8 w-24 animate-pulse rounded-lg bg-white/[0.05]" />
                    </div>
                  ))}
                </div>
              </Surface>
            ) : websitedata?.length === 0 ? (
              <div className="relative flex min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                  <CiGlobe size={30} />
                </span>
                <p className="relative mt-5 text-lg font-semibold text-white">
                  No websites connected yet
                </p>
                <p className="relative mt-1.5 text-sm text-zinc-400">
                  Add your first website to get started
                </p>
                <Link
                  href="/dashboard/integrate"
                  className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  <FiPlus size={16} />
                  Connect a website
                </Link>
              </div>
            ) : (
              <Surface>
                {/* toolbar */}
                <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-white">
                        All websites
                      </h2>
                      <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-zinc-300">
                        {websitedata.length}
                      </span>
                    </div>

                    <div
                      role="tablist"
                      className="flex gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1"
                    >
                      {typeTabs.map((x) => (
                        <button
                          key={x.k}
                          role="tab"
                          aria-selected={typeFilter === x.k}
                          onClick={() => {
                            setTypeFilter(x.k);
                            setPageNo(0);
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            typeFilter === x.k
                              ? "bg-white/10 text-white"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {x.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full lg:w-72">
                    <FiSearch
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPageNo(0);
                      }}
                      placeholder="Search websites"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-zinc-600 outline-none transition hover:border-white/20 focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-400/15"
                    />
                    {query && (
                      <button
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery("");
                          setPageNo(0);
                        }}
                        className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* table */}
                <div className="max-h-[34rem] overflow-auto border-t border-white/[0.06] [scrollbar-color:#27272a_transparent] [scrollbar-width:thin]">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-[#141416]/95 backdrop-blur">
                      <tr className="border-b border-white/[0.06]">
                        {sortable("name", "Website")}
                        {sortable("type", "Type")}
                        {sortable("feedback", "Feedback")}
                        <th className={thClass}>Status</th>
                        <th className={`${thClass} text-right`}>Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.05]">
                      {visible.length === 0 && (
                        <tr>
                          <td colSpan={5}>
                            <div className="flex flex-col items-center gap-3 py-16 text-center">
                              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.04] text-zinc-500 ring-1 ring-inset ring-white/10">
                                <FiSearch size={20} />
                              </span>
                              <p className="text-sm font-medium text-zinc-300">
                                {query ? `No websites match “${query}”` : "No websites in this view"}
                              </p>
                              <button
                                onClick={() => {
                                  setQuery("");
                                  setTypeFilter("all");
                                }}
                                className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                              >
                                Clear filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {visible.map((site, i) => {
                        const idx = websitedata.indexOf(site);
                        const count = site?.feedback?.length ?? 0;
                        const isTop = count > 0 && count === maxFeedback;
                        const href = /^https?:\/\//.test(site.url)
                          ? site.url
                          : `https://${site.url}`;
                        return (
                          <tr
                            key={`${site.name}-${idx}`}
                            className="group transition-colors hover:bg-white/[0.035]"
                          >
                            <td className="px-6 py-4">
                              <div className="flex min-w-0 items-center gap-3.5">
                                <span
                                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white ${
                                    avatarGradients[(start + i) % avatarGradients.length]
                                  }`}
                                >
                                  {(site?.name || "?").charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="truncate text-sm font-semibold text-white">
                                      {site?.name}
                                    </h3>
                                    {isTop && (
                                      <span className="shrink-0 rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-400/25">
                                        Top
                                      </span>
                                    )}
                                  </div>
                                  {site.url ? (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex max-w-[16rem] items-center gap-1 text-xs text-zinc-500 transition hover:text-indigo-300"
                                    >
                                      <span className="truncate">{cleanUrl(site.url)}</span>
                                      <FiExternalLink
                                        size={11}
                                        className="shrink-0 opacity-0 transition group-hover:opacity-100"
                                      />
                                    </a>
                                  ) : (
                                    <p className="text-xs text-zinc-600">No URL</p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {site.type ? (
                                <span className="inline-block rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-medium capitalize text-zinc-300 ring-1 ring-inset ring-white/10">
                                  {site.type}
                                </span>
                              ) : (
                                <span className="text-zinc-600">–</span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.07]">
                                  <div
                                    className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                                    style={{ width: `${(count / maxFeedback) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs tabular-nums text-zinc-400">
                                  <span className="font-semibold text-zinc-200">{count}</span>{" "}
                                  feedback
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Active
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <Link
                                aria-label={`Open tasks for ${site?.name}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-200 transition hover:border-indigo-400/50 hover:bg-indigo-400/10 hover:text-indigo-200"
                                href={{
                                  pathname: "/dashboard/tasks",
                                  query: {
                                    feedback: JSON.stringify(site?.feedback || []),
                                    name: site?.name,
                                    image: site?.image,
                                    Plan: plan?.subscription,
                                    TotalFeedback: site?.feedback?.length ?? 0,
                                  },
                                }}
                              >
                                View tasks
                                <FiArrowUpRight size={15} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* footer / pagination */}
                <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.015] px-6 py-3.5 text-xs text-zinc-500">
                  <span className="tabular-nums">
                    {total === 0
                      ? "No results"
                      : `Showing ${start + 1}–${Math.min(end, total)} of ${total}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Previous page"
                      disabled={safePage === 0}
                      onClick={() => setPageNo(safePage - 1)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    <span className="min-w-[4.5rem] text-center tabular-nums text-zinc-400">
                      Page {safePage + 1} / {pageCount}
                    </span>
                    <button
                      aria-label="Next page"
                      disabled={safePage >= pageCount - 1}
                      onClick={() => setPageNo(safePage + 1)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </Surface>
            )}
          </section>
        </main>
      </div>
    </>
  );
}