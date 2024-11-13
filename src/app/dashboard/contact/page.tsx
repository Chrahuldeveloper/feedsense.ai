import ContactForm from "@/components/ContactForm";
import SideBar from "@/components/SideBar";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#010101] w-full flex min-h-screen overflow-x-clip ">
      <SideBar page="Contact" />
      <ContactForm />
    </div>
  );
};

export default page;
