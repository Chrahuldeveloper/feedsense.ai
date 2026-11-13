import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiFileText, FiRefreshCw, FiTruck } from "react-icons/fi";

interface Props {
  setistoggle: (value: boolean) => void;
}

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
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                {title}
              </h1>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white"
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
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
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

const TermsConditions: React.FC<Props> = ({ setistoggle }) => {
  const termsAndConditionsData = [
    {
      section: "Terms and Conditions",
      content: [
        "The content of the pages of this website is subject to change without notice.",
        "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
        "Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.",
        "Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
        "All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.",
        "Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.",
        "From time to time, our website may also include links to other websites. These links are provided for your convenience to provide further information.",
        "You may not create a link to our website from another website or document without CHALURKAR RAHUL’s prior written consent.",
        "Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.",
        "We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.",
      ],
    },
    {
      section: "Cancellation and Refund",
      content: [
        "Cancellations will be considered only if the request is made within 2-3 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.",
        "CHALURKAR RAHUL does not accept cancellation requests for perishable items like flowers, eatables, etc. However, a refund/replacement can be made if the customer establishes that the quality of product delivered is not good.",
        "In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at their own end. This should be reported within 2-3 days of receipt of the products.",
        "In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2-3 days of receiving the product. The Customer Service Team, after looking into your complaint, will take an appropriate decision.",
        "In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.",
        "In case of any refunds approved by CHALURKAR RAHUL, it’ll take 3-5 days for the refund to be processed to the end customer.",
      ],
    },
    {
      section: "Shipping and Delivery",
      content: [
        "For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.",
        "For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.",
        "Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation, and delivering of the shipment is subject to courier company/post office norms.",
        "CHALURKAR RAHUL is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.",
        "Delivery of all orders will be to the address provided by the buyer.",
        "Delivery of our services will be confirmed to your email ID as specified during registration.",
        "For any issues in utilizing our services, you may contact our helpdesk at 8317680338 or chrahulofficial@gmail.com.",
      ],
    },
  ];

  const icons = [
    <FiFileText size={22} key="a" />,
    <FiRefreshCw size={22} key="b" />,
    <FiTruck size={22} key="c" />,
  ];
  const tones = [
    "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
    "bg-violet-400/10 text-violet-300 ring-violet-400/25",
    "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  ];

  return (
    <LegalShell
      title="Terms & Conditions"
      icon={<FiFileText size={20} />}
      toc={termsAndConditionsData.map((s, i) => ({
        id: `terms-${i}`,
        label: s.section,
      }))}
      onClose={() => setistoggle(false)}
    >
      <div className="space-y-16">
        {termsAndConditionsData.map((section, idx) => (
          <section key={idx} id={`terms-${idx}`} data-sec>
            <div className="flex items-center gap-4">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${tones[idx % 3]}`}
              >
                {icons[idx % 3]}
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {section.section}
              </h1>
            </div>
            <ul className="mt-8 space-y-3">
              {section.content.map((paragraph, index) => (
                <li
                  key={index}
                  className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm leading-7 text-slate-300 transition-colors hover:border-white/15 sm:p-5"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-xs font-bold tabular-nums text-cyan-300">
                    {index + 1}
                  </span>
                  <span>{paragraph}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LegalShell>
  );
};

export default TermsConditions;