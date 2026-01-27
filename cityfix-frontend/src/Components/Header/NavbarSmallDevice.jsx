import React from "react";
import { NavLink, useNavigate } from "react-router";
import { FaRegTimesCircle } from "react-icons/fa";
import useAuth from "../../Hooks/Auth/useAuth";
import { Bounce, toast } from "react-toastify";
import useRole from "../../Hooks/Role/useRole";

const NavbarSmallDevice = ({ openMenu, setOpenMenu }) => {
  const { user, signOutUser, setLoading } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

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
    <div
      className={`w-full h-screen fixed top-0 left-0 bg-surface-alt ${
        openMenu ? "" : "-translate-x-full"
      } transition-all duration-400 z-50`}
    >
      <FaRegTimesCircle
        className="text-3xl absolute top-6 right-7 cursor-pointer"
        onClick={() => setOpenMenu(!openMenu)}
      />
      <nav className="flex flex-col items-center space-y-3 justify-center mt-15">
        <NavLink
          to="/"
          className="hover:text-accent text-lg px-2"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Home
        </NavLink>
        <NavLink
          to="/all-issues"
          className="hover:text-accent text-lg px-2"
          onClick={() => setOpenMenu(!openMenu)}
        >
          All Issues
        </NavLink>
        {user && (role === "admin" || role === "citizen") ? (
          <NavLink
            to="/report-issue"
            className="hover:text-accent text-lg px-2"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Report Issue
          </NavLink>
        ) : (
          !user && (
            <NavLink
              to="/report-issue"
              className="hover:text-accent text-lg px-2"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Report Issue
            </NavLink>
          )
        )}

        <NavLink
          to="/about"
          className="hover:text-accent text-lg px-2"
          onClick={() => setOpenMenu(!openMenu)}
        >
          About Us
        </NavLink>
        <NavLink
          to="/contact"
          className="hover:text-accent text-lg px-2"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Contact
        </NavLink>
        {user && (
          <NavLink
            to="/dashboard"
            className="hover:text-accent text-lg px-2"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Dashboard
          </NavLink>
        )}

        {user ? (
          <button
            onClick={() => handleSignOut()}
            className="btn btn-sm bg-surface border-red-500 cursor-pointer"
          >
            Sign Out
          </button>
        ) : (
          <>
            <NavLink
              to="/auth/signin"
              className="hover:text-accent text-lg"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Sign In
            </NavLink>
            <NavLink
              to="/auth/register"
              className="hover:text-accent text-lg"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Create an Account
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavbarSmallDevice;
