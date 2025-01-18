"use client";
import React from "react";
import Sidebar from "@/_core/Sidebar";

import { FaUserCircle } from "react-icons/fa";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <div className="fixed flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col h-screen w-full bg-gray-300">
          <header className="flex items-center justify-end h-20 pr-3 bg-gray-300 shadow-lg"><FaUserCircle size='24' className='top-navigation-icon' /></header>
          {children}
        </div>
      </div>

  );
};

export default Dashboard;

