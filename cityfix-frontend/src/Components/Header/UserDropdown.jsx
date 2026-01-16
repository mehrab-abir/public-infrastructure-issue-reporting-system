import React from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/Auth/useAuth";

const UserDropdown = () => {
  const { user, signOutUser, setLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async ()=>{
    navigate('/',{replace:true});
    await signOutUser();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <button onClick={()=>handleSignOut()} className="btn btn-sm bg-surface border-red-500 cursor-pointer">
          Sign Out
        </button>
      ) : (
        <>
          <Link
            to="/auth/signin"
            className="btn btn-sm border border-blue-500 text-primary"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="btn btn-sm border-none bg-primary text-white"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
