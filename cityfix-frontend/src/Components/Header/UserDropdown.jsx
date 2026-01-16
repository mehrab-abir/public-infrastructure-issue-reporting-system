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
  const { user, signOutUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(()=>{
    const closeDropdown = (e) =>{
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setShowDropdown(false);
        }
    };
    document.addEventListener("mousedown", closeDropdown);

    return (()=>{
        document.removeEventListener("mousedown",closeDropdown);
    })
  },[])

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

  const userPhoto = user?.photoURL || user?.providerData[0]?.photoURL || defaultAvatar;

  return (
    <div className="flex items-center gap-4" ref={dropdownRef}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={userPhoto}
          referrerPolicy="no-referrer"
          className="w-12 h-12 object-cover rounded-full"
          alt=""
        />
        <MdOutlineArrowDropDownCircle className="text-xl text-gray-400" />
      </div>

      <div
        className={`absolute right-5 bg-base rounded-xl drop-shadow-lg p-3 w-48 ${
          showDropdown
            ? "opacity-100 pointer-events-auto top-20"
            : "opacity-0 pointer-events-none top-24"
        } transition-all duration-300`}
      >
        <div className="space-y-2.5">
          <div>
            <p className="text-secondary font-semibold">{user?.displayName}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>

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
