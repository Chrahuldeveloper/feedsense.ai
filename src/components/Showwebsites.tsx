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
} from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

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


const avatarGradients = [
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-sky-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
];

const PAGE_SIZE = 8;

type SortKey = "name" | "type" | "feedback";

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
  const db1 = useMemo(() => new dbService(), []);
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [plan, setPlan] = useState<Plan | null>(null);
  const [websitedata, setWebsitedata] = useState<WebsiteData[]>([]);

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

  /* ---------- table state (UI only) ---------- */
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageNo, setPageNo] = useState(0);

  const maxFeedback = Math.max(
    1,
    ...websitedata.map((s) => s?.feedback?.length ?? 0)
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = websitedata.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
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
  }, [websitedata, query, sortKey, sortDir]);

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

  return (
    <div className="fs-root relative min-w-0 flex-1 md:ml-64 ">
              <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-white text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your Website's
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            Add FeedSenseAI to your website in minutes
          </p>
        </div>
      </div>
      <section className="fs-rise mt-10" style={{ animationDelay: "0.15s" }}>
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
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-white">
                  Your websites
                </h2>
                <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-zinc-300">
                  {websitedata.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
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
                <Link
                  href="/dashboard/integrate"
                  className="hidden shrink-0 items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:inline-flex"
                >
                  <FiPlus size={16} />
                  Add
                </Link>
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
                            No websites match “{query}”
                          </p>
                          <button
                            onClick={() => setQuery("")}
                            className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                          >
                            Clear search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {visible.map((site, i) => {
                    const idx = websitedata.indexOf(site);
                    const count = site?.feedback?.length ?? 0;
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
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white ${avatarGradients[(start + i) % avatarGradients.length]
                                }`}
                            >
                              {(site?.name || "?").charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-white">
                                {site?.name}
                              </h3>
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
    </div>
        </div>

  );
}