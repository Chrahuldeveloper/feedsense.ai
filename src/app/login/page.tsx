"use client";
import React, { useState } from "react";
import AppWriteService from "../../appwrite/config";
import { useRouter } from "next/navigation";
const page = () => {
  const auth = new AppWriteService();

  const navigate = useRouter();

  const [data, setdata] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async () => {
    try {
      await auth.creatUserAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      navigate.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[rgb(0,0,0)] w-full overflow-y-clip h-screen md:h-auto ">
      <div className="md:flex gap-8 items-center pt-20 md:pt-0">
        <div>
          <img
            src="https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
            className="h-[100vh] hidden md:block w-[50vw] object-cover brightness-75"
          />
        </div>
        <div className="text-slate-300 bg-[#131b2376] p-7 rounded-lg w-[90vw] md:w-[30vw] mx-auto md:my-0 ">
          <div className="space-y-3.5">
            <h1 className="text-2xl font-bold ">Welcome back</h1>
            <p className="text-sm font-semibold">Sign in to your account</p>
          </div>

          <div className="space-y-2 mt-6">
            <h1 className="font-semibold ">Name*</h1>
            <input
              type="text"
              value={data.name}
              onChange={(e) => {
                setdata({ ...data, name: e.target.value });
              }}
              autoComplete="false"
              className="bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[25vw] w-[80vw] rounded-lg"
            />
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="font-semibold ">Email*</h1>
            <input
              type="text"
              value={data.email}
              onChange={(e) => {
                setdata({ ...data, email: e.target.value });
              }}
              autoComplete="false"
              className=" bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[25vw] w-[80vw] rounded-lg"
            />
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="font-semibold ">Password*</h1>
            <input
              type="password"
              value={data.password}
              onChange={(e) => {
                setdata({ ...data, password: e.target.value });
              }}
              autoComplete="false"
              className="bg-[#0d0d13] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[25vw] w-[80vw] rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 mt-6  text-white  py-2 md:w-[25vw]  w-[80vw]  font-semibold rounded-lg hover:bg-blue-600 ease-in-out duration-500"
          >
            Login
          </button>
          <div className="text-center my-3.5 text-slate-300">
            ---------------------OR---------------------
          </div>
          <div className="mt-5">
            <button className="bg-white text-black  md:w-[25vw]  w-[80vw]  font-semibold flex items-center gap-1 justify-center rounded-lg">
              <img
                className="w-10 h-12 object-cover"
                src="https://cdn.dribbble.com/users/904380/screenshots/2230701/attachments/415076/google-logo-revised.png"
                alt=""
              />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
