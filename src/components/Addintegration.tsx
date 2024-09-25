import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import { FaRegCopy } from "react-icons/fa";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

const Addintegration = () => {
  const [toogle, settoogle] = useState(false);

  hljs.registerLanguage("javascript", javascript);

  const codeToCopy = hljs.highlight(
    `<!-- Add this snippet to your website's HTML -->
      <iframe src="http://localhost:3000/integrate" ></iframe>`,
    { language: "javascript" }
  ).value;

  const [section, setsection] = useState<string | undefined>();

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
        <div
          className={`text-slate-300  p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-10
          md:mt-28 justify-center ${
            section === "showinput" || section === "showcode"
              ? "hidden"
              : "block"
          }`}
        >
          <div className="lg:space-y-8 space-y-5 order-2">
            <h1 className="text-3xl font-bold lg:text-5xl">Add your website</h1>
            <p className="max-w-sm md:text-lg md:max-w-md">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam consectetur enim praesentium.
            </p>
            <button
              onClick={() => {
                setsection("showinput");
              }}
              className="bg-blue-500 text-white px-5 rounded-lg text-sm py-2 cursor-pointer hover:bg-blue-600 ease-in-out duration-500 font-semibold"
            >
              Start Integration
            </button>
          </div>

          <div className="md:order-2 ">
            <img
              src="https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="max-w-sm md:max-w-md rounded-lg hover:brightness-75 ease-in-out duration-500 cursor-pointer"
            />
          </div>
        </div>
        {/* Add the process to integrate the websites */}
        <div
          className={`lg:ml-52 ${
            section === "showinput" || section === "showcode"
              ? "block"
              : "hidden"
          }`}
        >
          <div
            className={`w-[85vw] md:w-[33vw] p-6 space-y-6 mt-20 mx-auto bg-[#131b2376] ${
              section === "showcode" ? "hidden" : "block"
            }`}
          >
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Name*</h1>
              <input
                type="text"
                autoComplete="false"
                className="bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Url*</h1>
              <input
                type="text"
                autoComplete="false"
                className="bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Type*</h1>
              <select
                name="websiteType"
                className="bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
              >
                <option value="Custom">Custom</option>
                <option value="WordPress">WordPress</option>
                <option value="Shopify">Shopify</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setsection("showcode");
                }}
                className="bg-blue-500 text-white px-5 mt-2.5 text-sm py-2 hover:bg-blue-600 ease-in-out duration-500 font-semibold md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
              >
                Get Code
              </button>
            </div>
          </div>

          {/* Code for integration */}
          <div
            className={`p-6 space-y-6 mt-20 mx-auto bg-[#131b2376] ${
              section === "showcode" ? "block" : "hidden"
            }`}
          >
            <div className="bg-[#080808] border-[1px] border-neutral-900 overflow-auto">
              <pre className="text-white p-3">
                <div className="flex justify-end">
                  <FaRegCopy
                    size={19}
                    color="white"
                    className="cursor-pointer"
                  />
                </div>
                <code
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: codeToCopy }}
                ></code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addintegration;
