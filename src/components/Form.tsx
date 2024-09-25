import React from "react";

const Form = () => {
  return (
    <>
      <div className="bg-[#131b2376] p-5 rounded-lg max-w-md md:max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-slate-300 text-xl font-bold">Feedback</h1>
        </div>
        <div className="space-y-2 mt-6 mx-auto">
          <h1 className="font-semibold text-slate-300">Name*</h1>
          <input
            type="text"
            autoComplete="false"
            className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none md:w-[35vw] w-[80vw] rounded-lg text-slate-300"
          />
        </div>
        <div className="space-y-2 mt-6 mx-auto">
          <h1 className="font-semibold text-slate-300">Email*</h1>
          <input
            type="text"
            autoComplete="false"
            className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none md:w-[35vw] w-[80vw] rounded-lg text-slate-300"
          />
        </div>
        <div className="space-y-2 mt-6 mx-auto">
          <h1 className="font-semibold text-slate-300">Feedback*</h1>
          <textarea
            autoComplete="false"
            cols={20}
            rows={9}
            className="bg-[#0d0d13] border-[1px] border-neutral-900 px-3 py-2 outline-none md:w-[35vw] w-[80vw] rounded-lg text-slate-300"
          />
        </div>
      </div>

     
    </>
  );
};

export default Form;
