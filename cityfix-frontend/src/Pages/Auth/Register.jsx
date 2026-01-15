import React from 'react';
import logo from '../../assets/logo.png'
import GoogleSignIn from './GoogleSignIn';
import { Link } from 'react-router';

const Register = () => {
    return (
      <div className="pt-36 pb-24 bg-surface-alt">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            Create Account
          </h1>
          <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
            Join CityFix to Start Reporting Issues
          </p>
        </div>

        <div className="bg-surface p-6 w-11/12 md:w-8/12 lg:w-1/2 mx-auto rounded-xl">
          <img src={logo} alt="" className="mx-auto w-16" />
          <form className="mt-5 space-y-3">
            <div className="flex flex-col">
              <label className="text-secondary">Name:</label>
              <input
                type="text"
                className="input outline-none w-full"
                placeholder="Your Name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-secondary">Email:</label>
              <input
                type="email"
                className="input outline-none w-full"
                placeholder="Your Email"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-secondary">
                Profile Picture (Optional):
              </label>
              <input
                type="file"
                className="file-input outline-none w-full"
                placeholder="Choose Image"
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

            <button
              type="submit"
              className="btn bg-primary w-full text-white cursor-pointer mt-4 border-none"
            >
              Sign Up
            </button>
            <p className="my-3 text-secondary text-center">Or</p>
            <GoogleSignIn></GoogleSignIn>

            <p className='text-center text-secondary my-2'>Already have an account? <Link to='/auth/signin' className='text-accent hover:underline'>Sign In Here</Link></p>
          </form>
        </div>
      </div>
    );
};

export default Register;