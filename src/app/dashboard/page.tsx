"use client";
import React, { useEffect, useMemo } from "react";
import Table from "@/components/Table";
import SideBar from "@/components/SideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import axios from "axios";

interface User {
  uid: string;
}

const Page = () => {
  const { user } = useAuth() as { user: User | null };

  const db = useMemo(() => new dbService(), []);

  console.log(user);

  useEffect(() => {
    const fetchFeedbackTasks = async () => {
      if (!user?.uid) return;
      try {
        const feedback = await db.fetchFeedbacks(user.uid);
        console.log(feedback);
        await axios.post(
          "http://localhost:3000/api/generateFeedback",
          { feedback }
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    if (user?.uid) {
      fetchFeedbackTasks();
    }
  }, [user?.uid, db]);

  useEffect(() => {
    if (user?.uid) {
      const dateofexp = db.isSubscribtionExpired(user?.uid);
      console.log(dateofexp);
    }
  }, [user?.uid, db]);

  return (
    <div className="bg-[#0b0d0d] w-full flex min-h-screen overflow-x-clip">
      <SideBar page="Home" />
      <Table />
    </div>
  );
};

export default Page;
