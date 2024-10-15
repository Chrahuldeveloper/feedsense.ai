import React from "react";

const Navbar = () => {
  return (
    <nav className=" p-8 flex justify-between items-center px-12">
      <div>
        <h1 className="text-2xl font-bold text-white">TaskFeed</h1>
      </div>
      <ul className="flex items-center gap-x-7 text-slate-300">
        <li className="cursor-pointer font-semibold text-sm">Home</li>
        <li className="cursor-pointer font-semibold text-sm">About</li>
        <li className="cursor-pointer font-semibold text-sm">Services</li>
        <li className="cursor-pointer font-semibold text-sm">Support</li>
        <li className="cursor-pointer font-semibold text-sm">Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;
