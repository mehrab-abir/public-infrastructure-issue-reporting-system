import React from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/Auth/useAuth";
import { Bounce, toast } from "react-toastify";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

const UserDropdown = () => {
  const { user, signOutUser, setLoading, loading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

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

  const userPhoto =
    user?.photoURL || user?.providerData[0]?.photoURL || defaultAvatar;

  return (
    <div className="flex items-center gap-4" ref={dropdownRef}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {loading ? (
          <span className="loading loading-spinner text-info"></span>
        ) : (
          <img
            src={userPhoto}
            referrerPolicy="no-referrer"
            className="w-11 h-11 object-cover rounded-full"
            alt=""
          />
        )}
        <MdOutlineArrowDropDownCircle className="text-xl text-gray-400" />
      </div>

      <div
        className={`absolute right-3 bg-base rounded-xl drop-shadow-md p-3 w-52 ${
          showDropdown
            ? "opacity-100 pointer-events-auto top-20"
            : "opacity-0 pointer-events-none top-24"
        } transition-all duration-300`}
      >
        <div className="space-y-2.5 flex flex-col">
          <div>
            <p className="text-secondary font-semibold">{user?.displayName}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
          <Link to="/dashboard/manage-profile" className="hover:underline hover:text-accent bg-primary-soft px-2 rounded-lg">Profile</Link>
          <Link to="/dashboard" className="hover:underline hover:text-accent bg-primary-soft px-2 rounded-lg">Dashboard</Link>

          <button
            onClick={() => handleSignOut()}
            className="btn btn-sm bg-surface border-red-500 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
