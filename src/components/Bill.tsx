import React from "react";

const Bill = ({ selectedPlan }: { selectedPlan: { name: string; price: number } }) => {
  return (
    <div className="p-5 w-[80vw] md:w-[60vw] bg-[#17161c] rounded-lg border-[1px] border-[#272b2f] text-slate-300 space-y-6 mt-12">
      <div className="flex items-center justify-between mx-3">
        <h1>{selectedPlan.name} Plan</h1>
        <p>${selectedPlan.price}</p>
      </div>
      <div className="flex items-center justify-between mx-3">
        <h1>Additionals </h1>
        <p>$0</p> 
      </div>
      <div className="border-b-[1px] border-[#272b2f]"></div>
      <div className="flex items-center justify-between mx-3">
        <h1>Estimated total</h1>
        <p>${selectedPlan.price}</p>
      </div>
      <p className="max-w-md text-xs text-center">
        Your payment method will be charged this amount plus usage fees every 30
        days
      </p>
    </div>
  );
};

export default Bill;
