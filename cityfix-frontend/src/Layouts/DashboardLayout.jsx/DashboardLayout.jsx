import React from 'react';
import Footer from '../../Components/Footer';
import { NavLink, Outlet } from 'react-router';
import logo from '../../assets/logo.png'
import { useState } from 'react';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaUsersCog } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import Header from '../../Components/Header/Header';

const DashboardLayout = () => {
    const [showSideBar, setShowSideBar] = useState(false);

    return (
      <div className="bg-base relative">
        <Header></Header>

        {/* sidebar opener */}
        <div
          onClick={() => setShowSideBar(!showSideBar)}
          className="bg-surface w-10 h-screen cursor-pointer fixed top-20 left-0"
        >
          <IoChevronForwardCircleOutline className="text-3xl ml-1 text-secondary absolute top-2 left-0" />
          <IoMdSettings className="text-3xl ml-1 text-secondary absolute top-13 left-0" />
          <FaRegCircleUser className="text-3xl ml-1 text-secondary absolute top-24 left-0" />
        </div>

        {/* sidebar */}
        <div
          className={`bg-surface p-3 top-0 left-0 w-3/5 md:w-2/5 lg:w-1/5 h-screen fixed shadow-md ${showSideBar ? "" : "-translate-x-full"} transition-all duration-500 z-50`}
        >
          <div className="flex items-center justify-between">
            <img src={logo} className="w-14" alt="" />
            <h1 className="text-2xl font-bold">CityFix</h1>
            <IoChevronBackCircleOutline
              onClick={() => setShowSideBar(!showSideBar)}
              className="text-3xl cursor-pointer"
            />
          </div>

          <div className="flex flex-col space-y-3.5 mt-10 px-5">
            <NavLink
              to="/dashboard"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <LuLayoutDashboard className="text-xl" /> <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/dashboard/my-issues"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <HiOutlineDocumentReport className="text-xl" />{" "}
              <span>My Issues</span>
            </NavLink>
            <NavLink
              to="/dashboard/payment-history"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <MdOutlinePayment className="text-xl" />{" "}
              <span>Payment History</span>
            </NavLink>
            <NavLink
              to="/report-issue"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <FiPlus className="text-xl" /> <span>Report Issue</span>
            </NavLink>
            <NavLink
              to="/dashboard/assigned-issues"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <FaTasks className="text-xl" />
              <span>Assingned Issues</span>
            </NavLink>
            <NavLink
              to="/dashboard/manage-staffs"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <GrUserWorker className="text-xl" />
              <span>Manage Staffs</span>
            </NavLink>
            <NavLink
              to="/dashboard/manage-issues"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <TbReportSearch className="text-xl" />
              <span>Manage Issues</span>
            </NavLink>
            <NavLink
              to="/dashboard/manage-users"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <FaUsersCog className="text-xl" />
              <span>Manage Users</span>
            </NavLink>
            <NavLink
              to="/dashboard/all-payments"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <MdOutlinePayment className="text-xl" />
              <span>All Payments</span>
            </NavLink>
            <NavLink
              to="/manage-profile"
              className={`font-semibold flex items-center gap-4`}
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <FaRegCircleUser className="text-xl" />
              <span>Profile</span>
            </NavLink>
          </div>
        </div>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    );
};

export default DashboardLayout;