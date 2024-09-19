import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import { FaRegCopy } from "react-icons/fa";

const Addintegration = () => {
  const [toogle, settoogle] = useState(false);

  const codeToCopy = `
  <!-- Add this snippet to your website's HTML -->
  <script>
    (function() {
      var feedbackWidget = document.createElement('script');
      feedbackWidget.src = 'https://yourwebsite.com/widget.js';
      feedbackWidget.async = true;
      document.head.appendChild(feedbackWidget);
    })();
  </script>`;

  return (
    <>
      <div className="md:ml-80">
        <nav className="md:hidden bg-[#0f0d15] p-7 w-screen border-b-[1px] border-neutral-900 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => {
              settoogle(true);
            }}
          />
        </nav>
        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}
        {/* <div className="space-y-5 lg:space-y-8 text-slate-300 mt-14 p-8">
          <h1 className="text-3xl font-bold  lg:text-5xl">Add your website</h1>
          <p className="max-w-sm md:text-lg md:max-w-md">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            consectetur enim praesentium.
          </p>
          <button className="bg-blue-500 text-white px-5 rounded-lg text-sm py-2 cursor-pointer hover:bg-blue-600 ease-in-out duration-500 font-semibold">
            Start Integration
          </button>
        </div>  */}
        {/* add the process to integrate the websites */}

        <div className="lg:ml-48">
          {/* <div className=" w-[85vw] md:w-[33vw] p-6 space-y-6 mt-20 mx-auto bg-[#131b2376]">
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Name*</h1>
              <input
                type="text"
                autoComplete="false"
                className=" bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Url*</h1>
              <input
                type="text"
                autoComplete="false"
                className=" bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Type*</h1>
              <select
                name="websiteType"
                className=" bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
              >
                <option value="Custom">Custom</option>
                <option value="WordPress">WordPress</option>
                <option value="Shopify">Shopify</option>
              </select>
            </div>
          </div> */}

          {/* Code for integration */}

          <div className="p-6 space-y-6 mt-20 mx-auto bg-[#131b2376]">
            <div className=" bg-[#0d0d13] border-[1px] border-neutral-900">
              <pre className="text-white p-3">
                <div className="flex justify-end">
                  <FaRegCopy
                    size={19}
                    color="white"
                    className="cursor-pointer"
                  />
                </div>
                <code>{codeToCopy}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addintegration;
