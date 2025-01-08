import { Link } from "lucide-react";
import React, { useState } from "react";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import TermsConditions from "./TermsConditions";
import { FiInstagram } from "react-icons/fi";

export default function Footer() {
  const [istoogle, setistoggle] = useState(false);

  return (
    <>
      {istoogle ? <TermsConditions setistoggle={setistoggle} /> : null}

      <footer className="bg-[#121212] text-white pt-10 px-4">
        <div className=" mx-auto flex flex-col md:flex-row items-center justify-around">
          <div className="text-center md:text-left mb-6 md:mb-0 space-y-5">
            <h1 className="text-2xl font-semibold">TaskFeed</h1>
            <p className="text-sm mt-2 text-gray-400 max-w-sm">
              Centralize and analyze feedback to continually improve your
              websites and business services.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-20">
            <div className="flex flex-col items-center mt-6 md:mt-0 ">
              <p
                onClick={() => {
                  setistoggle(true);
                }}
                className="font-semibold cursor-pointer text-lg"
              >
                Terms and Conditions
              </p>
              <div className="flex flex-col gap-5 text-sm mt-3">
                <p>About</p>
                <p>Services</p>
                <p>Contact</p>
                <p>FAQ</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
              <FaXTwitter size={22} className="hover:text-gray-400" />
              <FiInstagram size={22} className="hover:text-gray-400" />
              <FaFacebookF size={22} className="hover:text-gray-400" />
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 py-5 pt-16">
          © {new Date().getFullYear()} FeedSense Ai. All rights reserved.
        </div>
      </footer>
    </>
  );
}
