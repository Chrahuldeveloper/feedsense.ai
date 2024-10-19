"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
const page = () => {
  const navigate = useRouter();

  const provider = new GoogleAuthProvider();

  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (Object.values(data).every((i) => i !== "")) {
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        console.log(user.user);
        alert("Login successful!");
        navigate.push("/dashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Enter all the details");
    }
  };

  const googleSignIn = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user.user);
      navigate.push("/dashboard");
      alert("Login successful!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#131315] w-full overflow-y-clip h-screen md:h-auto ">
      <div className="md:flex gap-8 items-center pt-20 md:pt-0">
        <div>
          <img
            src="https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
            className="h-[100vh] hidden md:block w-[50vw] object-cover brightness-75"
          />
        </div>
        <div className="text-slate-300 bg-[#18181b] p-7 rounded-lg w-[90vw] md:w-[30vw] mx-auto md:my-0 border-[#272b2f] border-[1px]">
          <div className="space-y-3.5">
            <h1 className="text-2xl font-bold ">Welcome back</h1>
            <p className="text-sm font-semibold">Sign in to your account</p>
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
              className=" bg-[#1c1c21] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[25vw] w-[80vw] rounded-lg"
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
              className="bg-[#1c1c21] border-[1px] border-neutral-900 px-2 py-2 outline-none md:w-[25vw] w-[80vw] rounded-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-white mt-6  text-black  py-2 md:w-[25vw]  w-[80vw]  font-semibold rounded-lg  "
          >
            Login
          </button>
          <div className="text-center my-3.5 text-slate-300">
            ---------------------OR---------------------
          </div>
          <div className="mt-5">
            <button
              onClick={googleSignIn}
              className="bg-white text-black  md:w-[25vw]  w-[80vw]  font-semibold flex items-center gap-1 justify-center rounded-lg"
            >
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
