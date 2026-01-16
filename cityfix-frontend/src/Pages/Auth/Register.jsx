import React from "react";
import logo from "../../assets/logo.png";
import GoogleSignIn from "./GoogleSignIn";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import useAxiosBasic from "../../Hooks/Axios/useAxiosBasic";
import useAuth from "../../Hooks/Auth/useAuth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import uploadToCloudinary from "../../Utilities/uploadImage";

const Register = () => {
  const { registerUser, setLoading, updateUserProfile, setUser } = useAuth();

  const axios = useAxiosBasic();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const handleRegister = async (data) => {
    setSubmitting(true);

    const displayName = data.displayName;
    const email = data.email;
    const password = data.password;
    let photoURL = "";

    const imageFile = data.profileImg[0];

    if (imageFile) {
      try {
        photoURL = await uploadToCloudinary(
          imageFile,
          import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET
        );
      } catch (error) {
        console.log(error);
      }
    }

    //create account in firebase
    const result = await registerUser(email, password);
    const user = result.user;

    const userInfo = {
      displayName,
      photoURL,
    };

    //update user profile -> append displayName and photURl
    await updateUserProfile(userInfo);
    setUser({ ...user, userInfo });

    //post user to db
    const newUser = {
      displayName,
      email,
      photoURL,
      created_at: new Date(),
      role: "citizen",
    };

    try {
      const response = await axios.post("/users", newUser);

      if (response.data.insertedId) {
        Swal.fire({
          title: "Registration Successfull!",
          icon: "success",
          draggable: true,
        });
        reset();
        navigate(location.state || "/", { replace: true });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please try again later",
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-24 bg-base">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
          Create Account
        </h1>
        <p className="text-muted text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
          Join CityFix to Start Reporting Issues
        </p>
      </div>

      <div className="bg-surface p-6 w-11/12 md:w-8/12 lg:w-1/2 mx-auto rounded-xl drop-shadow-md">
        <img src={logo} alt="" className="mx-auto w-16" />
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="mt-5 space-y-3"
        >
          <div className="flex flex-col">
            <label className="text-secondary">Name:</label>
            <input
              type="text"
              {...register("displayName")}
              className="input outline-none w-full"
              placeholder="Your Name"
              required
            />
          </div>

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

          <div className="flex flex-col">
            <label className="text-secondary">
              Profile Picture (Optional):
            </label>
            <input
              type="file"
              {...register("profileImg")}
              className="file-input outline-none w-full"
              placeholder="Choose Image"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-secondary">Password:</label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              {...register("password", {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
                minLength: 6,
              })}
              className="input outline-none w-full"
              placeholder="Password"
              required
            />
            {errors.password?.type === "pattern" && (
              <p className="text-red-500 text-sm mt-1">
                Password must contain at least one uppercase letter, one
                lowercase letter, one digit and one special character
              </p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm mt-1">
                Password must have at least 6 characters.
              </p>
            )}

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

          <button
            type="submit"
            className="btn bg-primary w-full text-white cursor-pointer mt-4 border-none"
            disabled={submitting}
          >
            {submitting ? <i>Siging up...</i> : "Sign Up"}
          </button>
        </form>
        <p className="my-3 text-secondary text-center">Or</p>
        <GoogleSignIn></GoogleSignIn>

        <p className="text-center text-secondary my-2">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-accent hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
