import Link from "next/link";
import React, { useState } from "react";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import TermsConditions from "./TermsConditions";
import { FiInstagram } from "react-icons/fi";
import Privacy from "./Privacy";

export default function Footer() {
  const [istoogle, setistoggle] = useState(false);

  const [isprivacy, setisprivacy] = useState<boolean>(false);

  return (
    <>
      {istoogle ? <TermsConditions setistoggle={setistoggle} /> : null}
      {isprivacy ? <Privacy setisprivacy={setisprivacy} /> : null}
      <footer className="bg-[#121212] text-white pt-10 px-4">
        <div className=" mx-auto flex flex-col md:flex-row items-center justify-around">
          <div className="text-center md:text-left mb-6 md:mb-0 space-y-5">
            <h1 className="text-2xl font-semibold">FeedSense.Ai</h1>
            <p className="text-sm mt-2 text-gray-400 max-w-sm">
              Centralize and analyze feedback to continually improve your
              websites and business services.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-20">
            <div className="flex flex-col items-center   ">
              <div className="flex flex-col gap-5 text-sm items-center">
                <h2 className="text-lg font-semibold ">FeedSense.AI</h2>
                <Link href="/">
                  <p className="font-semibold">Home</p>
                </Link>
                <Link href="/about">
                  <p className="font-semibold">About</p>
                </Link>
                <Link href="/plans">
                  <p className="font-semibold">Plans</p>
                </Link>
                <Link href="/contactUs">
                  <p className="font-semibold">Contact</p>
                </Link>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              <h2 className="text-lg font-semibold">Support</h2>
              <p>
                <Link
                  href="https://merchant.razorpay.com/policy/P8XFEmJQOPeGVU/terms"
                  onClick={() => {}}
                  className="font-semibold cursor-pointer "
                >
                  Terms and Conditions
                </Link>
              </p>
              <p
                onClick={() => {
                  setisprivacy(true);
                }}
                className="font-semibold cursor-pointer "
              >
                Privacy Policy
              </p>
              <p className="font-semibold cursor-pointer">
                chrahulofficial@gmail.com
              </p>
              <p className="font-semibold cursor-pointer">
                Hyderabad Medchal 501401,India{" "}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <h2 className="text-lg font-semibold ">Follow Us</h2>
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
