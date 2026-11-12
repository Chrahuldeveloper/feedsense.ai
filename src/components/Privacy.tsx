import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiShield } from "react-icons/fi";
interface props {
  setisprivacy: (value: boolean) => void;
}

/* UI-only text helpers */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 mt-10 text-xl font-bold tracking-tight text-white sm:text-2xl">
    {children}
  </h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 mt-6 text-base font-semibold text-cyan-200 sm:text-lg">
    {children}
  </h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 leading-7 text-slate-300">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-5 list-disc space-y-2 pl-5 leading-7 text-slate-300 marker:text-cyan-400 [&_strong]:font-semibold [&_strong]:text-white">
    {children}
  </ul>
);

const Privacy: React.FC<props> = ({ setisprivacy }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setisprivacy(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setisprivacy]);

  return (
    <div
      className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6"
      onClick={() => setisprivacy(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Privacy Policy"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/20 p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.4)]"
      >
        <div className="flex h-[88vh] flex-col overflow-hidden rounded-[23px] bg-[#0a0d12]">
          {/* sticky header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] bg-[#0a0d12]/95 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                <FiShield size={20} />
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Privacy Policy for FeedSenseAI
              </h1>
            </div>
            <button
              aria-label="Close privacy policy"
              onClick={() => {
                setisprivacy(false);
              }}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <RxCross2 size={22} />
            </button>
          </div>

          {/* scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 pb-10 pt-6 text-sm sm:px-8 sm:text-base [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin]">
            <P>
              Welcome to FeedSenseAI. Protecting your privacy is important to
              us. This Privacy Policy explains how we collect, use, and
              safeguard your information when you use our platform, FeedSenseAI,
              which provides tools for feedback collection, analysis, and
              prioritization.
            </P>
            <P>
              By using FeedSenseAI, you agree to the terms outlined in this
              Privacy Policy. If you do not agree with the terms, please refrain
              from using our services.
            </P>

            <H2>1. Information We Collect</H2>
            <H3>1.1 Information You Provide to Us</H3>
            <UL>
              <li>
                <strong>Account Information:</strong> Name, email address,
                password, and other details provided during account
                registration.
              </li>
              <li>
                <strong>Feedback Data:</strong> Feedback and related metadata
                collected through forms or other integrations.
              </li>
              <li>
                <strong>Payment Information:</strong> Billing details, including
                credit card or other payment method information, handled
                securely by third-party payment processors.
              </li>
            </UL>

            <H3>1.2 Automatically Collected Information</H3>
            <UL>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our platform, including IP address, browser type, operating
                system, and activity logs.
              </li>
              <li>
                <strong>Cookies:</strong> Data collected via cookies and similar
                technologies to enhance user experience. (Refer to our Cookie
                Policy for more details.)
              </li>
            </UL>

            <H3>1.3 Third-Party Integrations</H3>
            <P>
              Information obtained through third-party services connected to
              FeedSenseAI (e.g., CRM tools, project management systems) as
              authorized by you.
            </P>

            <H2>2. How We Use Your Information</H2>
            <UL>
              <li>To provide and maintain the FeedSenseAI platform.</li>
              <li>To analyze and prioritize user feedback.</li>
              <li>
                To communicate with you regarding updates, support, and
                promotional materials (you can opt out of marketing
                communications).
              </li>
              <li>
                To enhance user experience through research and development.
              </li>
              <li>To ensure security and prevent fraud.</li>
              <li>To comply with legal obligations.</li>
            </UL>

            <H2>3. How We Share Your Information</H2>
            <P>
              We do not sell or rent your personal information. We may share
              your information in the following scenarios:
            </P>
            <UL>
              <li>
                <strong>With Service Providers:</strong> Trusted third parties
                who assist us in operating our platform, such as hosting,
                payment processing, and analytics.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our legal rights.
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of a merger,
                acquisition, or sale of assets, your information may be
                transferred to the new entity.
              </li>
              <li>
                <strong>With Your Consent:</strong> When explicitly authorized
                by you.
              </li>
            </UL>

            <H2>4. Data Retention</H2>
            <P>
              We retain your information for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy or as required by law.
              Feedback data may be anonymized and stored for analytical
              purposes.
            </P>

            <H2>5. Your Rights</H2>
            <P>
              Depending on your location, you may have the following rights:
            </P>
            <UL>
              <li>Access your personal information.</li>
              <li>Correct inaccurate or incomplete information.</li>
              <li>Delete or request the deletion of your personal data.</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Data portability.</li>
            </UL>
            <P>
              To exercise these rights, contact us at [Insert Contact Email].
            </P>

            <H2>6. Security Measures</H2>
            <P>
              We implement industry-standard security measures to protect your
              information. However, no system is completely secure. You are
              responsible for maintaining the confidentiality of your account
              credentials.
            </P>

            <H2>7. Children Privacy</H2>
            <P>
              FeedSenseAI is not intended for use by children under 13. We do
              not knowingly collect personal information from children. If we
              become aware that a child’s data has been collected, we will take
              appropriate steps to delete it.
            </P>

            <H2>8. Changes to This Privacy Policy</H2>
            <P>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date. Continued
              use of FeedSenseAI after changes implies acceptance of the revised
              policy.
            </P>

            <H2>9. Contact Us</H2>
            <P>
              If you have questions or concerns about this Privacy Policy,
              please contact us:
            </P>
            <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-slate-200">
              Email:{" "}
              <a
                href="mailto:chrahulofficial@gmail.com"
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                chrahulofficial@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;