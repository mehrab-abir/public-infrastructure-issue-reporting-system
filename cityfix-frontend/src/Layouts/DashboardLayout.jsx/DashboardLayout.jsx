import React, { useEffect } from "react";
import Footer from "../../Components/Footer";
import { NavLink, Outlet, useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { CiDark, CiLight } from "react-icons/ci";
import useRole from "../../Hooks/Role/useRole";
import useAuth from "../../Hooks/Auth/useAuth";
import { Bounce, toast } from "react-toastify";

const DashboardLayout = () => {
  const {signOutUser, setLoading} = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  const [showSideBar, setShowSideBar] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    navigate("/", { replace: true });
    await signOutUser();
    setLoading(false);

    toast.info("Signed Out", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <div className="bg-base relative">
      <h1 className="text-2xl font-bold text-accent text-center lg:text-start lg:ml-78 pt-2">
        Dashboard - {role === "admin" ? "ADMIN" : role === "staff" ? "STAFF" : "CITIZEN"}
      </h1>

      {/* sidebar opener */}
      <div
        onClick={() => setShowSideBar(!showSideBar)}
        className="bg-surface w-8 sm:w-10 h-screen cursor-pointer fixed top-0 left-0"
      >
        <IoChevronForwardCircleOutline className="text-2xl sm:text-3xl ml-1 text-secondary absolute top-2 left-0" />
        <IoMdSettings className="text-2xl sm:text-3xl ml-1 text-secondary absolute top-13 left-0" />
      </div>

      {/* sidebar */}
      <div
        className={`bg-surface p-3 top-0 left-0 w-5/7 sm:w-3/7 md:w-2/5 lg:w-75 h-screen fixed shadow-md ${showSideBar ? "" : "-translate-x-full"} transition-all duration-500 z-50 lg:translate-x-0 overflow-y-scroll`}
      >
        <div className="flex items-center justify-between">
          <img src={logo} className="w-14" alt="" />
          <h1 className="text-2xl font-bold">CityFix</h1>
          <IoChevronBackCircleOutline
            onClick={() => setShowSideBar(!showSideBar)}
            className="text-3xl cursor-pointer lg:hidden"
          />
        </div>

        <div className="flex flex-col space-y-3.5 mt-10 px-5">
          <NavLink
            to="/"
            className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
            onClick={() => setShowSideBar(!showSideBar)}
          >
            <AiOutlineHome className="text-xl" /> <span>Home</span>
          </NavLink>
          <NavLink
            to="/all-issues"
            className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
            onClick={() => setShowSideBar(!showSideBar)}
          >
            <TbReportSearch className="text-xl" />{" "}
            <span>Browse All Issues</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
            onClick={() => setShowSideBar(!showSideBar)}
          >
            <LuLayoutDashboard className="text-xl" /> <span>Dashboard</span>
          </NavLink>

          {role === "citizen" && (
            <>
              <NavLink
                to="/dashboard/my-issues"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <HiOutlineDocumentReport className="text-xl" />{" "}
                <span>My Issues</span>
              </NavLink>

              <NavLink
                to="/dashboard/payment-history"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <MdOutlinePayment className="text-xl" />{" "}
                <span>Payment History</span>
              </NavLink>

              <NavLink
                to="/report-issue"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FiPlus className="text-xl" /> <span>Report Issue</span>
              </NavLink>

              <NavLink
                to="/dashboard/manage-profile"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaRegCircleUser className="text-xl" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink
                to="/dashboard/manage-staffs"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <GrUserWorker className="text-xl" />
                <span>Manage Staffs</span>
              </NavLink>
              <NavLink
                to="/dashboard/manage-issues"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <TbReportSearch className="text-xl" />
                <span>Manage Issues</span>
              </NavLink>
              <NavLink
                to="/dashboard/manage-users"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaUsersCog className="text-xl" />
                <span>Manage Users</span>
              </NavLink>
              <NavLink
                to="/dashboard/all-payments"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <MdOutlinePayment className="text-xl" />
                <span>All Payments</span>
              </NavLink>
              <NavLink
                to="/dashboard/manage-profile"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaRegCircleUser className="text-xl" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {role === "staff" && (
            <>
              <NavLink
                to="/dashboard/assigned-issues"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaTasks className="text-xl" />
                <span>Assingned Issues</span>
              </NavLink>
              <NavLink
                to="/dashboard/manage-profile"
                className={`font-semibold flex items-center gap-4 text-sm md:text-base py-1 px-2`}
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaRegCircleUser className="text-xl" />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {/* theme change */}
          <div>
            {theme === "light" ? (
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setTheme("dark")}
              >
                <CiDark className="text-xl md:text-2xl font-semibold" />{" "}
                <span className="font-semibold text-sm md:text-base">
                  Switch to Dark Mode
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setTheme("light")}
              >
                <CiLight className="text-xl md:text-2xl font-semibold" />{" "}
                <span className="font-semibold text-sm md:text-base">
                  Switch to Light Mode
                </span>
              </div>
            )}
            <button
              onClick={() => handleSignOut()}
              className="btn btn-sm w-full bg-red-500 border-none mt-4 cursor-pointer text-white rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <Outlet></Outlet>
      <div className="lg:ml-75">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
