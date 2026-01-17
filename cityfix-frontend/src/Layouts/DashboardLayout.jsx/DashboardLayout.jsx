import React from 'react';
import Footer from '../../Components/Footer';
import { NavLink, Outlet } from 'react-router';
import logo from '../../assets/logo.png'
import { useState } from 'react';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import Header from '../../Components/Header/Header';

const DashboardLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);

    return (
      <div className="bg-base relative">
        <Header></Header>

        {/* sidebar opener */}
        <div
          onClick={() => setShowSideBar(!showSideBar)}
          className="bg-surface w-10 h-screen cursor-pointer fixed top-20 lg:top-8 left-0 z-35"
        >
          <IoChevronForwardCircleOutline className='text-3xl ml-1' />
        </div>
        <div
          className={`bg-surface p-3 top-0 left-0 w-full md:w-2/5 lg:w-1/5 h-screen fixed shadow-md ${showSideBar ? "" : "-translate-x-full"} transition-all duration-500 z-50`}
        >
          <div className="flex items-center justify-between">
            <img src={logo} className="w-14" alt="" />
            <h1 className="text-2xl font-bold">CityFix</h1>
            <IoChevronBackCircleOutline
              onClick={() => setShowSideBar(!showSideBar)}
              className="text-3xl cursor-pointer"
            />
          </div>

          <div className="flex flex-col space-y-3 mt-10 px-5">
            <NavLink to="/dashboard/my-issues" className={`font-semibold`}>
              My Issues
            </NavLink>
            <NavLink to="/dashboard/my-tasks" className={`font-semibold`}>
              My Tasks
            </NavLink>
          </div>
        </div>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    );
};

export default DashboardLayout;