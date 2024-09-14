import React from "react";

const page = () => {
  return (
    <div className="bg-[#000000] w-full overflow-y-clip h-screen md:h-auto ">
      <div className="md:flex gap-32 items-center ">
        <div>
          <img
            src="https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
            className="h-[100vh] hidden md:block w-[50vw] object-cover brightness-90"
          />
        </div>

        <div className="text-slate-300 border-[1px] border-neutral-900 p-7 rounded-lg">
          <div>
            <h1 className="text-2xl font-semibold text-center">TaskFeed</h1>
          </div>

          <div className="space-y-2 mt-4">
            <h1 className="font-semibold text-lg">Email</h1>
            <input
              type="text"
              className="border-[1px] border-neutral-900  bg-[#0f0d15] px-2 py-2 outline-none w-[25vw] rounded-lg"
            />
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="font-semibold text-lg">Password</h1>
            <input
              type="text"
              className="border-[1px] border-neutral-900  bg-[#0f0d15] px-2 py-2 outline-none w-[25vw] rounded-lg"
            />
          </div>
          <div className="text-center my-3.5">-------OR-------</div>
          <div className="mt-5">
            <button className="bg-white text-black  w-[25vw]  font-semibold flex items-center gap-1 justify-center rounded-lg">
              <img
                className="w-10 h-14 object-cover"
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
