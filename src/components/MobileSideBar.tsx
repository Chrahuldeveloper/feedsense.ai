import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { CgWebsite } from "react-icons/cg";
import Link from "next/link";

interface MobileSideBarProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleLogout: (value: boolean) => void;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({
  setToggle,
  setToggleLogout,
}) => {
  return (
    <aside className="bg-[#151923] py-6 w-[70vw] h-full fixed top-0 left-0 md:hidden space-y-10 px-10 border-r-[1px] border-[#272b2f]">
      <div className="flex justify-end cursor-pointer">
        <RxCross2
          size={23}
          color="white"
          cursor={"pointer"}
          onClick={() => {
            setToggle(false);
          }}
        />
      </div>
      <Link href="/dashboard">
        <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer my-10">
          <MdDashboard size={22} color="white" cursor={"pointer"} />
          <h1 className="text-slate-300 font-semibold text-sm ">DashBoard</h1>
        </div>
      </Link>
      <Link href="/dashboard/integrate">
        <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer my-10">
          <CgWebsite size={22} color="white" cursor={"pointer"} />
          <h1 className="text-slate-300 font-semibold text-sm ">Integrate</h1>
        </div>
      </Link>
      <Link href="/dashboard/contact">
        <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer my-10">
          <IoIosCall size={22} color="white" cursor={"pointer"} />
          <h1 className="text-slate-300 font-semibold text-sm ">Contact Us</h1>
        </div>
      </Link>

      {/* <Link href="/plans">
        <div className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer">
          <MdOutlineAttachMoney size={22} color="white" cursor={"pointer"} />
          <h1 className="text-slate-300 font-semibold text-sm ">Subcription</h1>
        </div>
      </Link> */}

      <div
        className="flex items-center space-x-2.5 w-32 justify-between cursor-pointer"
        onClick={() => {
          setToggleLogout(true);
        }}
      >
        <IoLogOut size={22} color="white" cursor={"pointer"} />
        <h1 className="text-slate-300 font-semibold text-sm ">LogOut</h1>
      </div>
    </aside>
  );
};

export default MobileSideBar;
