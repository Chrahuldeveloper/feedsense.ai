import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiShield } from "react-icons/fi";
interface props {
  setisprivacy: (value: boolean) => void;
}

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    data-sec
    className="mb-4 mt-14 scroll-mt-6 border-t border-white/[0.07] pt-10 text-2xl font-extrabold tracking-tight text-[#06080b] first:mt-0 first:border-0 first:pt-0 sm:text-3xl"
  >
    {children}
  </h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 mt-7 text-base font-semibold text-cyan-200 sm:text-lg">
    {children}
  </h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 leading-7 text-slate-300">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-5 space-y-2.5 leading-7 text-slate-300 [&>li]:relative [&>li]:rounded-xl [&>li]:border [&>li]:border-white/[0.06] [&>li]:bg-white/[0.025] [&>li]:py-3 [&>li]:pl-10 [&>li]:pr-4 [&>li]:before:absolute [&>li]:before:left-4 [&>li]:before:top-[1.15rem] [&>li]:before:h-2 [&>li]:before:w-2 [&>li]:before:rounded-full [&>li]:before:bg-gradient-to-br [&>li]:before:from-cyan-400 [&>li]:before:to-violet-500 [&_strong]:font-semibold [&_strong]:text-[#06080b]">
    {children}
  </ul>
);

/* ---------- UI-only: shared reading-modal shell ---------- */
const LegalShell = ({
  title,
  icon,
  toc,
  onClose,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  toc: { id: string; label: string }[];
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(toc[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root, rootMargin: "-8% 0px -80% 0px" }
    );
    root.querySelectorAll("[data-sec]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (root && el) root.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-3xl bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/20 p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.4)]"
      >
        <div className="relative flex h-[88vh] flex-col overflow-hidden rounded-[23px] bg-[#0a0d12]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-600/15 blur-3xl" />

          {/* header */}
          <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                {icon}
              </span>
              <h1 className="text-lg font-bold tracking-tight text-[#06080b] sm:text-xl">
                {title}
              </h1>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-[#06080b]"
            >
              <RxCross2 size={22} />
            </button>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.05]">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* mobile chips */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/[0.05] px-5 py-3 lg:hidden [scrollbar-width:none]">
            {toc.map((t) => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active === t.id
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/30"
                    : "bg-white/[0.05] text-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative flex min-h-0 flex-1">
            {/* desktop TOC */}
            <nav className="hidden w-72 shrink-0 overflow-y-auto border-r border-white/[0.06] p-5 lg:block [scrollbar-width:thin]">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                On this page
              </p>
              <ul className="space-y-1">
                {toc.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => go(t.id)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                        active === t.id
                          ? "bg-cyan-400/10 text-cyan-200"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-[#06080b]"
                      }`}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              ref={scrollRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const max = el.scrollHeight - el.clientHeight;
                setProgress(max > 0 ? el.scrollTop / max : 0);
              }}
              className="relative flex-1 overflow-y-auto px-5 pb-16 pt-8 text-sm sm:px-10 sm:text-base [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin]"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Privacy: React.FC<props> = ({ setisprivacy }) => {
  const toc = [
    "Information We Collect",
    "How We Use Your Information",
    "How We Share Your Information",
    "Data Retention",
    "Your Rights",
    "Security Measures",
    "Children Privacy",
    "Changes to This Privacy Policy",
    "Contact Us",
  ].map((label, i) => ({ id: `priv-${i + 1}`, label: `${i + 1}. ${label}` }));

  return (
    <LegalShell
      title="Privacy Policy for FeedSenseAI"
      icon={<FiShield size={20} />}
      toc={toc}
      onClose={() => setisprivacy(false)}
    >
      <P>
        Welcome to FeedSenseAI. Protecting your privacy is important to us. This
        Privacy Policy explains how we collect, use, and safeguard your
        information when you use our platform, FeedSenseAI, which provides tools
        for feedback collection, analysis, and prioritization.
      </P>
      <P>
        By using FeedSenseAI, you agree to the terms outlined in this Privacy
        Policy. If you do not agree with the terms, please refrain from using
        our services.
      </P>

      <H2 id="priv-1">1. Information We Collect</H2>
      <H3>1.1 Information You Provide to Us</H3>
      <UL>
        <li>
          <strong>Account Information:</strong> Name, email address, password,
          and other details provided during account registration.
        </li>
        <li>
          <strong>Feedback Data:</strong> Feedback and related metadata
          collected through forms or other integrations.
        </li>
        <li>
          <strong>Payment Information:</strong> Billing details, including
          credit card or other payment method information, handled securely by
          third-party payment processors.
        </li>
      </UL>

      <H3>1.2 Automatically Collected Information</H3>
      <UL>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with
          our platform, including IP address, browser type, operating system,
          and activity logs.
        </li>
        <li>
          <strong>Cookies:</strong> Data collected via cookies and similar
          technologies to enhance user experience. (Refer to our Cookie Policy
          for more details.)
        </li>
      </UL>

      <H3>1.3 Third-Party Integrations</H3>
      <P>
        Information obtained through third-party services connected to
        FeedSenseAI (e.g., CRM tools, project management systems) as authorized
        by you.
      </P>

      <H2 id="priv-2">2. How We Use Your Information</H2>
      <UL>
        <li>To provide and maintain the FeedSenseAI platform.</li>
        <li>To analyze and prioritize user feedback.</li>
        <li>
          To communicate with you regarding updates, support, and promotional
          materials (you can opt out of marketing communications).
        </li>
        <li>To enhance user experience through research and development.</li>
        <li>To ensure security and prevent fraud.</li>
        <li>To comply with legal obligations.</li>
      </UL>

      <H2 id="priv-3">3. How We Share Your Information</H2>
      <P>
        We do not sell or rent your personal information. We may share your
        information in the following scenarios:
      </P>
      <UL>
        <li>
          <strong>With Service Providers:</strong> Trusted third parties who
          assist us in operating our platform, such as hosting, payment
          processing, and analytics.
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law or to
          protect our legal rights.
        </li>
        <li>
          <strong>Business Transfers:</strong> In case of a merger, acquisition,
          or sale of assets, your information may be transferred to the new
          entity.
        </li>
        <li>
          <strong>With Your Consent:</strong> When explicitly authorized by you.
        </li>
      </UL>

      <H2 id="priv-4">4. Data Retention</H2>
      <P>
        We retain your information for as long as necessary to fulfill the
        purposes outlined in this Privacy Policy or as required by law. Feedback
        data may be anonymized and stored for analytical purposes.
      </P>

      <H2 id="priv-5">5. Your Rights</H2>
      <P>Depending on your location, you may have the following rights:</P>
      <UL>
        <li>Access your personal information.</li>
        <li>Correct inaccurate or incomplete information.</li>
        <li>Delete or request the deletion of your personal data.</li>
        <li>Object to or restrict certain processing activities.</li>
        <li>Data portability.</li>
      </UL>
      <P>To exercise these rights, contact us at [Insert Contact Email].</P>

      <H2 id="priv-6">6. Security Measures</H2>
      <P>
        We implement industry-standard security measures to protect your
        information. However, no system is completely secure. You are
        responsible for maintaining the confidentiality of your account
        credentials.
      </P>

      <H2 id="priv-7">7. Children Privacy</H2>
      <P>
        FeedSenseAI is not intended for use by children under 13. We do not
        knowingly collect personal information from children. If we become aware
        that a child’s data has been collected, we will take appropriate steps
        to delete it.
      </P>

      <H2 id="priv-8">8. Changes to This Privacy Policy</H2>
      <P>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated effective date. Continued use of
        FeedSenseAI after changes implies acceptance of the revised policy.
      </P>

      <H2 id="priv-9">9. Contact Us</H2>
      <P>
        If you have questions or concerns about this Privacy Policy, please
        contact us:
      </P>
      <p className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.08] to-violet-500/[0.06] px-5 py-4 text-slate-200">
        Email:{" "}
        <a
          href="mailto:chrahulofficial@gmail.com"
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          chrahulofficial@gmail.com
        </a>
      </p>
    </LegalShell>
  );
};

export default Privacy;