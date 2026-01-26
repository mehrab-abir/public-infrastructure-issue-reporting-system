import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";
import logo from "../../assets/logo.png";
import GoogleSignIn from "./GoogleSignIn";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/Auth/useAuth";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const { signInUser, setLoading, forgetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, reset } = useForm();

  const [submitting, setSubmiting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const forgotPasswordModalRef = useRef();
  const emailRef = useRef();

  const [noEmailMsg, setNoEmailMsg] = useState('');
  const [passwordResetMsg, setPasswordResetMsg] = useState('');

  const handleSignIn = async (data) => {
    setSubmiting(true);

    const email = data.email;
    const password = data.password;

    try {
      await signInUser(email, password);
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
      reset();
    } catch (error) {
      // console.log(error);
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
      setSubmiting(false);
    }
  };


  const openForgotPasswordModal = ()=>{
    setNoEmailMsg('');
    setPasswordResetMsg('');
    forgotPasswordModalRef.current.showModal();
  }

  const handleResetPassword = async ()=>{
    setNoEmailMsg('');
    
    const email = emailRef.current.value;

    if(!email){
      setNoEmailMsg("Please enter your email");
      return;
    }

    await forgetPassword(email);
    
    setPasswordResetMsg("Password reset link has been sent. Please check your email, check spams too");

    setLoading(false);
  }
  return (
    <div className="pt-36 pb-24 bg-base">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
          Welcome Back
        </h1>
        <p className="text-muted text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
          Sign In to Your CityFix Account
        </p>
      </div>

      <div className="bg-surface p-6 w-11/12 md:w-8/12 lg:w-1/2 mx-auto rounded-xl drop-shadow-md">
        <img src={logo} alt="" className="mx-auto w-16" />
        <form onSubmit={handleSubmit(handleSignIn)} className="mt-5 space-y-3">
          <div className="flex flex-col">
            <label className="text-secondary">Email:</label>
            <input
              type="email"
              {...register("email")}
              className="input outline-none w-full"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-secondary">Password:</label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              {...register("password")}
              className="input outline-none w-full"
              placeholder="Password"
              required
            />
            {showPassword ? (
              <FaEye
                className="text-2xl absolute top-8 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEyeSlash
                className="text-2xl absolute top-8 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <p
            onClick={() => openForgotPasswordModal()}
            className="mt-1 text-sm hover:text-accent hover:underline cursor-pointer"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className="btn bg-primary w-full text-white cursor-pointer mt-4 border-none"
            disabled={submitting}
          >
            {submitting ? <i>Signing in...</i> : "Sign In"}
          </button>
        </form>
        <p className="my-3 text-secondary text-center">Or</p>
        <GoogleSignIn></GoogleSignIn>

        <p className="text-center text-secondary my-2">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-accent hover:underline">
            Register Here
          </Link>
        </p>
      </div>

      {/* forgot password modal  */}
      <dialog
        ref={forgotPasswordModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-semibold text-lg">Enter Your Account Email</h3>
          <input
            type="email"
            className="input w-full outline-none"
            ref={emailRef}
          />
          <p className="text-red-500 text-sm italic">{noEmailMsg}</p>
          <p className="text-blue-500 text-sm italic">{passwordResetMsg}</p>

          <button
            onClick={() => handleResetPassword()}
            className="btn btn-sm bg-primary text-white mt-4"
          >
            Send Reset Link
          </button>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SignIn;
