import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface MobileSideBarProps {
  settoogle: Function;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ settoogle }) => {
  return (
    <aside className="bg-[#0b090e] p-5 w-[43vw] h-full fixed top-0 left-0 md:hidden space-y-8 px-8">
      <div className="flex justify-end cursor-pointer">
        <RxCross2
          size={24}
          color="white"
          cursor={"pointer"}
          onClick={() => {
            settoogle(false);
          }}
        />
      </div>
      <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer">
        <MdDashboard size={22} color="white" cursor={"pointer"} />
        <h1 className="text-slate-300 font-semibold">DashBoard</h1>
      </div>
      <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer">
        <IoIosCall size={22} color="white" cursor={"pointer"} />
        <h1 className="text-slate-300 font-semibold">Contact Us</h1>
      </div>

      <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer">
        <MdOutlineAttachMoney size={22} color="white" cursor={"pointer"} />
        <h1 className="text-slate-300 font-semibold">Subcription</h1>
      </div>
      <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer">
        <IoLogOut size={22} color="white" cursor={"pointer"} />
        <h1 className="text-slate-300 font-semibold">LogOut</h1>
      </div>
    </aside>
  );
};

export default MobileSideBar;
