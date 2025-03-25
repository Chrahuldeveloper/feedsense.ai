import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-gray-400 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0">
          <div className="md:w-1/3">
            <h2 className="text-white text-2xl font-semibold">
              Feed<span className="text-cyan-400">Sense</span>AI
            </h2>
            <p className="mt-2 text-sm">
              Transforming feedback into actionable insights with the power of
              artificial intelligence.
            </p>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-16">
            <div>
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="mt-2 space-y-4 text-sm">
                <li>
                  <Link href="/contactUs" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://merchant.razorpay.com/policy/P8XFEmJQOPeGVU/refund"
                    className="hover:text-white"
                  >
                    Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://merchant.razorpay.com/policy/P8XFEmJQOPeGVU/terms"
                    className="hover:text-white"
                  >
                    Terms of Service{" "}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mt-6 md:mt-0">Support</h3>
              <ul className="mt-2 space-y-5 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold">Contact</h3>
            <ul className="mt-2 space-y-5 text-sm">
              <li>
                <a
                  href="mailto:hello@feedsenseai.com"
                  className="hover:text-white"
                >
                  📧 chrahulofficial@gmail.com
                </a>
              </li>
              <li>
                <a href="91+8317680338" className="hover:text-white">
                  📞 8317680338
                </a>
              </li>
              <li>📍 Hyderabad 501401,India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
          <p>© 2025 FeedSenseAI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
