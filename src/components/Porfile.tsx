"use client";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiGlobe,
  FiTag,
  FiEdit2,
  FiLock,
  FiCheck,
  FiShield,
  FiLogOut,
  FiCreditCard,
  FiActivity,
  FiArrowUpRight,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "../firebase/Firebase";
import MobileSideBar from "./MobileSideBar";
import ModelLogout from "./ModelLogout";

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

interface Draft {
  name: string;
  phone: string;
  company: string;
  jobTitle: string;
  website: string;
  bio: string;
}

type Errors = Partial<Record<keyof Draft, string>>;

const EMPTY: Draft = {
  name: "",
  phone: "",
  company: "",
  jobTitle: "",
  website: "",
  bio: "",
};

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

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition hover:border-white/20 focus:border-indigo-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-400/15";

const fmtDate = (s?: string | null) =>
  s
    ? new Date(s).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "–";

const fieldMeta: {
  key: keyof Draft;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}[] = [
  { key: "name", label: "Full name", icon: <FiUser size={17} />, placeholder: "Your full name" },
  { key: "phone", label: "Phone number", icon: <FiPhone size={17} />, placeholder: "+91 98765 43210", type: "tel" },
  { key: "company", label: "Company", icon: <FiBriefcase size={17} />, placeholder: "Where do you work?" },
  { key: "jobTitle", label: "Job title", icon: <FiTag size={17} />, placeholder: "e.g. Product Manager" },
  { key: "website", label: "Website", icon: <FiGlobe size={17} />, placeholder: "yourcompany.com" },
];

const validate = (d: Draft): Errors => {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Name is required";
  if (d.phone && !/^[+\d][\d\s()-]{6,18}$/.test(d.phone.trim()))
    e.phone = "Enter a valid phone number";
  if (
    d.website &&
    !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(d.website.trim())
  )
    e.website = "Enter a valid website";
  return e;
};

export default function Profile() {
  const db1 = useMemo(() => new dbService(), []);
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  const [toggle, setToggle] = useState(false);
  const [toggleLogout, setToggleLogout] = useState(false);

  const [profile, setProfile] = useState<Draft>(EMPTY);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [plan, setPlan] = useState<string | null>(null);
  const [stats, setStats] = useState({ websites: 0, feedback: 0 });
  const [photoFailed, setPhotoFailed] = useState(false);
  const [meta, setMeta] = useState<{
    created?: string | null;
    last?: string | null;
    verified?: boolean;
    provider?: string;
  }>({});

  /* load profile + plan */
  useEffect(() => {
    const load = async () => {
      if (loading || !user) return;
      try {
        const snap = await getDoc(doc(db, "USERS", user.uid));
        const data = snap.data() || {};
        const p = data.profile || {};
        const loaded: Draft = {
          name: p.name || user.displayName || "",
          phone: p.phone || "",
          company: p.company || "",
          jobTitle: p.jobTitle || "",
          website: p.website || "",
          bio: p.bio || "",
        };
        setProfile(loaded);
        setDraft(loaded);
        setPlan(data.subscription || null);
      } catch (error) {
        console.error("Error loading profile:", error);
        const fallback = { ...EMPTY, name: user.displayName || "" };
        setProfile(fallback);
        setDraft(fallback);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [loading, user]);

  /* activity stats */
  useEffect(() => {
    const loadStats = async () => {
      if (loading || !user) return;
      try {
        const d = await db1.fetchDashboardDetails(user.uid);
        if (d)
          setStats({
            websites: Number(d.totalWebsites) || 0,
            feedback: Number(d.totalFeedback) || 0,
          });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };
    loadStats();
  }, [loading, user, db1]);

  /* account metadata */
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    setMeta({
      created: u.metadata.creationTime,
      last: u.metadata.lastSignInTime,
      verified: u.emailVerified,
      provider: u.providerData[0]?.providerId,
    });
  }, [user]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(false);
  };

  const save = async () => {
    const e = validate(draft);
    setErrors(e);
    if (Object.keys(e).length > 0 || !user) return;
    setSaving(true);
    try {
      const clean: Draft = {
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        company: draft.company.trim(),
        jobTitle: draft.jobTitle.trim(),
        website: draft.website.trim(),
        bio: draft.bio.trim(),
      };
      await setDoc(
        doc(db, "USERS", user.uid),
        { profile: { ...clean, updatedAt: new Date().toISOString() } },
        { merge: true }
      );
      if (auth.currentUser && clean.name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: clean.name });
      }
      setProfile(clean);
      setDraft(clean);
      setEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile.name || user?.displayName || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const showPhoto = !!user?.photoURL && !photoFailed;

  const filled = [
    profile.name,
    profile.phone,
    profile.company,
    profile.jobTitle,
    profile.website,
    profile.bio,
  ].filter(Boolean).length;
  const strength = Math.round((filled / 6) * 100);
  const nextHint = !profile.company
    ? "Add your company to level up"
    : !profile.jobTitle
    ? "Add your job title"
    : !profile.phone
    ? "Add a phone number"
    : !profile.website
    ? "Add your website"
    : !profile.bio
    ? "Write a short bio"
    : "Your profile is complete";

  const planName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : null;

  const avatar = (size: string, text: string) =>
    showPhoto ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user!.photoURL}
        alt={displayName}
        referrerPolicy="no-referrer"
        onError={() => setPhotoFailed(true)}
        className={`${size} rounded-full object-cover`}
      />
    ) : (
      <span
        className={`${size} grid place-items-center rounded-full bg-indigo-500 font-semibold text-white ${text}`}
      >
        {initial}
      </span>
    );

  return (
    <>
      <Theme />
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
        </div>

        {/* ---------- Top bar ---------- */}
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
              <span className="text-zinc-200">My Profile</span>
            </p>
            <div className="flex items-center gap-3">
              {planName && (
                <span className="hidden items-center gap-1.5 rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/30 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                  {planName}
                </span>
              )}
              <div className="hidden items-center gap-3 border-l border-white/[0.08] pl-4 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-zinc-300">
                  {displayName}
                </span>
                {avatar("h-9 w-9", "text-sm")}
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
            Page="Profile"
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}
        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {/* ---------- Heading row ---------- */}
          <section className="fs-rise flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">Account</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                My Profile
              </h1>
              <p className="mt-2 text-zinc-400">
                Manage your personal details and account settings
              </p>
            </div>
            {!editing && !fetching && (
              <button
                onClick={startEdit}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400 sm:self-auto"
              >
                <FiEdit2 size={16} />
                Edit profile
              </button>
            )}
            {editing && (
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 ring-1 ring-inset ring-amber-400/25 sm:self-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                Editing
              </span>
            )}
          </section>

          {/* ---------- Identity hero ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.05s" }}>
            <Surface>
              <div className="h-28 border-b border-white/[0.06] bg-gradient-to-r from-indigo-500/20 via-indigo-500/[0.07] to-transparent sm:h-32" />
              <div className="px-6 pb-7 sm:px-8">
                <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="shrink-0 rounded-full ring-4 ring-[#111113]">
                      {avatar("h-24 w-24 sm:h-28 sm:w-28", "text-4xl")}
                    </div>
                    <div className="pb-1">
                      {fetching ? (
                        <div className="space-y-2">
                          <div className="h-7 w-48 animate-pulse rounded bg-white/[0.07]" />
                          <div className="h-4 w-56 animate-pulse rounded bg-white/[0.05]" />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {displayName}
                          </h2>
                          <p className="mt-1 text-sm text-zinc-400">
                            {[profile.jobTitle, profile.company]
                              .filter(Boolean)
                              .join(" at ") || user?.email}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {planName && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-400/15 px-2.5 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                                {planName} plan
                              </span>
                            )}
                            {meta.verified && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                                <FiCheck size={12} strokeWidth={3} />
                                Verified
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                              <FiCalendar size={12} />
                              Member since {fmtDate(meta.created)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* profile strength */}
                  <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 lg:max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Profile strength
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-white">
                        {strength}%
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full bg-indigo-400 transition-all duration-700"
                        style={{ width: `${Math.max(strength, 4)}%` }}
                      />
                    </div>
                    <p className="mt-2.5 text-xs text-zinc-500">{nextHint}</p>
                  </div>
                </div>
              </div>
            </Surface>
          </section>

          {/* ---------- Details + side cards ---------- */}
          <section
            className="fs-rise grid gap-6 lg:grid-cols-3"
            style={{ animationDelay: "0.1s" }}
          >
            {/* personal information */}
            <div className="lg:col-span-2">
              <Surface>
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Personal information
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {editing
                        ? "Make your changes, then save"
                        : "Your details across FeedSenseAI"}
                    </p>
                  </div>
                  {!editing && !fetching && (
                    <button
                      onClick={startEdit}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="px-6 py-7">
                  {fetching ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
                          <div className="h-5 w-40 animate-pulse rounded bg-white/[0.08]" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                      {fieldMeta.map((f) => (
                        <div key={f.key}>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            {f.label}
                            {f.key === "name" && editing && (
                              <span className="text-rose-400"> *</span>
                            )}
                          </label>
                          {editing ? (
                            <>
                              <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                  {f.icon}
                                </span>
                                <input
                                  type={f.type || "text"}
                                  value={draft[f.key]}
                                  placeholder={f.placeholder}
                                  onChange={(e) =>
                                    setDraft({ ...draft, [f.key]: e.target.value })
                                  }
                                  className={`${inputClass} ${
                                    errors[f.key]
                                      ? "!border-rose-400/60 focus:!ring-rose-400/15"
                                      : ""
                                  }`}
                                />
                              </div>
                              {errors[f.key] && (
                                <p className="mt-1.5 text-xs text-rose-400">
                                  {errors[f.key]}
                                </p>
                              )}
                            </>
                          ) : (
                            <p
                              className={`flex items-center gap-2.5 text-[15px] ${
                                profile[f.key] ? "text-white" : "text-zinc-600"
                              }`}
                            >
                              <span className="text-zinc-500">{f.icon}</span>
                              {profile[f.key] || "Not provided"}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* email (read-only) */}
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          Email address
                        </label>
                        <div
                          className={`flex items-center gap-2.5 text-[15px] text-white ${
                            editing
                              ? "rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-zinc-400"
                              : ""
                          }`}
                        >
                          <span className="text-zinc-500">
                            <FiMail size={17} />
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {user?.email || "–"}
                          </span>
                          {editing && <FiLock size={14} className="text-zinc-600" />}
                        </div>
                        {editing && (
                          <p className="mt-1.5 text-xs text-zinc-600">
                            Managed by your Google account
                          </p>
                        )}
                      </div>

                      {/* bio */}
                      <div className="sm:col-span-2">
                        <div className="mb-2 flex items-baseline justify-between">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            Bio
                          </label>
                          {editing && (
                            <span className="text-xs tabular-nums text-zinc-600">
                              {draft.bio.length} / 280
                            </span>
                          )}
                        </div>
                        {editing ? (
                          <textarea
                            rows={4}
                            maxLength={280}
                            value={draft.bio}
                            placeholder="A short line about you and what you build"
                            onChange={(e) =>
                              setDraft({ ...draft, bio: e.target.value })
                            }
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white placeholder:text-zinc-600 outline-none transition hover:border-white/20 focus:border-indigo-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-400/15"
                          />
                        ) : (
                          <p
                            className={`text-[15px] leading-7 ${
                              profile.bio ? "text-zinc-300" : "text-zinc-600"
                            }`}
                          >
                            {profile.bio || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-white/[0.015] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">
                      {dirty ? "You have unsaved changes" : "No changes yet"}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={save}
                        disabled={!dirty || saving}
                        className="flex-1 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </div>
                )}
              </Surface>
            </div>

            {/* side column */}
            <div className="space-y-6">
              {/* plan */}
              <Surface>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Subscription</h2>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                      <FiCreditCard size={16} />
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                    {planName || "No plan"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {planName
                      ? "Your current FeedSenseAI plan"
                      : "Choose a plan to unlock AI insights"}
                  </p>
                  <Link
                    href="/plans"
                    className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-indigo-400/50 hover:bg-indigo-400/10 hover:text-indigo-200"
                  >
                    {planName ? "Manage plan" : "View plans"}
                    <FiArrowUpRight size={15} />
                  </Link>
                </div>
              </Surface>

              {/* activity */}
              <Surface>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Activity</h2>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                      <FiActivity size={16} />
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="text-2xl font-semibold tabular-nums text-white">
                        {stats.websites}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Websites</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="text-2xl font-semibold tabular-nums text-white">
                        {stats.feedback}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Feedbacks</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/websites"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                  >
                    View your websites <FiArrowUpRight size={13} />
                  </Link>
                </div>
              </Surface>

              {/* security */}
              <Surface>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Security</h2>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/25">
                      <FiShield size={16} />
                    </span>
                  </div>
                  <dl className="mt-5 divide-y divide-white/[0.06] text-sm">
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-zinc-500">Sign-in method</dt>
                      <dd className="font-medium text-zinc-200">
                        {meta.provider === "google.com" || !meta.provider
                          ? "Google"
                          : meta.provider}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-zinc-500">Email</dt>
                      <dd>
                        {meta.verified ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-400/25">
                            Unverified
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <dt className="flex items-center gap-1.5 text-zinc-500">
                        <FiClock size={13} /> Last sign-in
                      </dt>
                      <dd className="font-medium text-zinc-200">
                        {fmtDate(meta.last)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Surface>

              {/* session */}
              <button
                onClick={() => setToggleLogout(true)}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] px-5 py-4 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15"
              >
                <FiLogOut size={16} />
                Sign out
              </button>
            </div>
          </section>
        </main>
      </div>
      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
}