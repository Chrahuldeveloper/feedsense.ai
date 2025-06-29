"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { TiTickOutline } from "react-icons/ti";
// import Link from "next/link";
import { IoIosStarOutline } from "react-icons/io";
import Footer from "@/components/Footer";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../../components/Loader";
export default function page() {
  const db = new dbService();

  interface User {
    uid: string;
  }

  const { user, loading }: { user: User | null; loading: boolean } = useAuth();

  const navigate = useRouter();

  const [isloading, setisloading] = useState<boolean>(false);

  const Plans = [
    {
      name: "Pro",
      price: "Free",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority Support",
        "Analytics",
        "Unlimited websites",
        "Incentivise Users",
      ],
      // Bill: "Billed once every 5 months",
      // para: "That's ₹540/month ≈ ₹18/day ≈ 6 coffees per month",
    },
    // {
    //   name: "Basic",
    //   price: "₹450",
    //   features: [
    //     "Collect up to 100 feedback",
    //     "Priority Support",
    //     "Analytics",
    //     "Only 3 websites integration",
    //     "Incentivise Users",
    //   ],
    //   Bill: "Billed monthly",
    //   para: "That's less than ₹12/day ≈ 2 coffees per month",
    // },
    // {
    //   name: "Pro",
    //   price: "₹2700",
    //   features: [
    //     "Unlimited feedback entries",
    //     "Automated task generation from feedback",
    //     "Priority Support",
    //     "Analytics",
    //     "Unlimited websites",
    //     "Incentivise Users",
    //   ],
    //   Bill: "Billed once every 5 months",
    //   para: "That's ₹540/month ≈ ₹18/day ≈ 6 coffees per month",
    // },
  ];

  return (
    <>
      <div className="bg-[#1c2031] w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[30vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <div className="max-w-5xl  mx-auto relative mt-36 p-5 lg:p-0">
            <div className="text-center space-y-5">
              <p className="bg-white p-2 rounded-full flex items-center justify-center gap-2 text-[11px] font-semibold w-56 mx-auto text-xs">
                <IoIosStarOutline size={20} color="black" />
                LIMITED-TIME OFFER
              </p>
              <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
                Be Among the First <br />{" "}
                <span className="font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
                  100 Users & Get It Free for Life!
                </span>{" "}
              </h1>
              <p className="text-[#a2a2a2] max-w-xl mx-auto text-center z-50 text-sm md:text-base">
                The first 100 users will enjoy <b>FeedSense.AI</b> for{" "}
                <b>free forever</b> Don't miss out—secure your lifetime access
                now!
              </p>
            </div>
          </div>

          {isloading ? <Loader message="Grabing the offer for you" /> : null}

          <div className="flex flex-col md:flex-row gap-8 px-6 md:px-10 pb-14 justify-center my-24 ">
            {Plans.map((plan, idx) => {
              return (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-lg  bg-gradient-to-r from-[#1a202f] via-[#1a202f] to-[#1a202f] border-t-4 border-t-cyan-500  transform transition-transform duration-300 hover:scale-105 w-full max-w-md cursor-pointer shadow-2xl"
                >
                  {plan.name === "Pro" && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                      Free Offer
                    </div>
                  )}
                  <div className="p-6 space-y-3.5 rounded-t-lg">
                    <h1 className="text-white text-xl font-bold">
                      {plan.name}
                    </h1>
                    <p className="text-3xl font-bold text-slate-200">
                      {plan.price}
                    </p>
                  </div>
                  <ul className="space-y-5 text-slate-300 p-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TiTickOutline size={20} className="text-green-500" />
                        <span className="font-semibold text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-6 mt-auto">
                    {/* <Link href={`/subscription/${plan.name}`}> */}
                    <>
                      <button
                        onClick={async () => {
                          console.log(user);
                          if (!loading) {
                            if (user!.uid === null) {
                              alert("please login");
                            }
                            try {
                              setisloading(true);
                              await db.availFreeOffer(user!.uid);
                              localStorage.setItem("paid", "true");
                              toast(
                                "Congratulations you have grabbed the offer 🎉"
                              );
                              setisloading(false);
                              const pushtimeout = setTimeout(() => {
                                navigate.push("/dashboard");
                              }, 2000);
                            } catch (error) {
                              console.log(error);
                              setisloading(false);
                            }
                          }
                        }}
                        className="w-full  bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600   transitionmt-4 text-white py-3 font-semibold rounded-lg  transition-shadow duration-200 shadow-xl text-sm"
                      >
                        Grab Now
                      </button>
                    </>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
        <Footer />
      </div>
    </>
  );
}
