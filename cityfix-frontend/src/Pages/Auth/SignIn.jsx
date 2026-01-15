import React from 'react';
import { Link } from 'react-router';
import logo from "../../assets/logo.png";
import GoogleSignIn from "./GoogleSignIn";

const SignIn = () => {
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
          <form className="mt-5 space-y-3">
            <div className="flex flex-col">
              <label className="text-secondary">Email:</label>
              <input
                type="email"
                className="input outline-none w-full"
                placeholder="Your Email"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-secondary">Password:</label>
              <input
                type="password"
                className="input outline-none w-full"
                placeholder="Password"
              />
            </div>
            <p className="mt-1 text-sm hover:text-accent hover:underline cursor-pointer">
              Forgot Password?
            </p>

            <button
              type="submit"
              className="btn bg-primary w-full text-white cursor-pointer mt-4 border-none"
            >
              Sign In
            </button>
            <p className="my-3 text-secondary text-center">Or</p>
            <GoogleSignIn></GoogleSignIn>

            <p className="text-center text-secondary my-2">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-accent hover:underline">
                Register Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
};

export default SignIn;