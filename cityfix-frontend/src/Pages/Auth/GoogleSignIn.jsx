import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../Hooks/Auth/useAuth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";
import useAxiosBasic from "../../Hooks/Axios/useAxiosBasic";

const GoogleSignIn = () => {
  const { googleSignIn, setUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axios = useAxiosBasic();

  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);

    try {
      const result = await googleSignIn();
      const user = result.user;
      setUser(user);

      const newUser = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "citizen",
        created_at: new Date(),
      };

      const response = await axios.post("/users", newUser);

      if (response.data.insertedId) {
        navigate(location.state || "/", { replace: true });
        toast.success("Welcome!", {
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
      }else if(response.data.userExists){
        navigate(location.state || "/", { replace: true });
        toast.success("Welcome Back!", {
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
      }
    } catch (error) {
      toast.error(`${error.code}`, {
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
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={() => handleGoogleSignIn()}
      className="btn w-full bg-primary-soft cursor-pointer border-none"
    >
      <FcGoogle className="text-xl" />
      {submitting ? <i>Signing in...</i> : "Sign In With Google"}
    </button>
  );
};

export default GoogleSignIn;
