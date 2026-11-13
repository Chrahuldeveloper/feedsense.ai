import React from "react";
import { FiClock, FiCheck } from "react-icons/fi";

const Bill = ({
  selectedPlan,
}: {
  selectedPlan: { name: string; price: number };
}) => {
  return (
    <div className="w-full text-zinc-300">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl text-white bg-indigo-500">
            <FiCheck size={20} strokeWidth={3} />
          </span>
          <div>
            <h1 className="text-sm font-semibold text-white">
              {selectedPlan.name} Plan
            </h1>
            <p className="text-xs text-zinc-500">Billed monthly</p>
          </div>
        </div>
        <p className="text-base font-semibold tabular-nums text-white">
          ₹{selectedPlan.price}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <h1 className="text-zinc-400">Additionals </h1>
        <p className="tabular-nums text-zinc-300">₹0</p>
      </div>

      {/* ticket-style divider */}
      <div className="relative my-6">
        <div className="border-t border-dashed border-white/15" />
        <span className="absolute -left-[1.35rem] -top-3 h-6 w-6 rounded-full bg-[#111113] ring-1 ring-inset ring-white/[0.08]" />
        <span className="absolute -right-[1.35rem] -top-3 h-6 w-6 rounded-full bg-[#111113] ring-1 ring-inset ring-white/[0.08]" />
      </div>

      <div className="flex items-end justify-between gap-4">
        <h1 className="text-sm font-medium text-zinc-300">Estimated total</h1>
        <p className=" text-4xl font-semibold tabular-nums tracking-tight text-indigo-300">
          ₹{selectedPlan.price}
        </p>
      </div>

      <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-5 text-zinc-500">
        <FiClock size={14} className="mt-0.5 shrink-0 text-indigo-400" />
        Your subscription will end in the specified time period.
      </p>
    </div>
  );
};

export default Bill;