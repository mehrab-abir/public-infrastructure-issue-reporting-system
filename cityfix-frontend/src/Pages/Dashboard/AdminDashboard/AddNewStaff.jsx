import React from "react";
import DashboardContainer from "../DashboardContainer";
import staffImg from "../../../assets/staffsImg.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../../Hooks/Auth/useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const AddNewStaff = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addNewStaff = async (data) => {

    const newStaff = {
        displayName : data.staffName,
        email : data.staffEmail,
        phone : data.staffPhone,
        photoURL : data.staffPhoto,
        role : 'staff',
        created_at : new Date()
    }

    try{
        //register the staff in firebase -- account creation
        
    }
    catch(error){
        console.log(error);
        Swal.fire({
            icon : "error",
            text : "Ooops...",
            title : "Something went worng!"
        })
    }
    finally{
        setLoading(false);
        setSubmitting(false);
    }

  };

  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Add New Staff</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Provide Staff Information to Register
          </p>
        </div>
      </div>

      <div className="bg-surface p-6 w-11/12 md:w-8/12 lg:w-1/2 mx-auto rounded-xl drop-shadow-md">
        <img src={staffImg} alt="" className="mx-auto w-16" />
        <form onSubmit={handleSubmit(addNewStaff)} className="mt-5 space-y-3">
          <div className="flex flex-col">
            <label className="text-secondary">Staff Name:</label>
            <input
              type="text"
              {...register("staffName")}
              className="input outline-none w-full"
              placeholder="Staff Name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-secondary">Staff Email:</label>
            <input
              type="email"
              {...register("staffEmail")}
              className="input outline-none w-full"
              placeholder="Staff Email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-secondary">Staff Phone No.:</label>
            <input
              type="text"
              {...register("staffPhone")}
              className="input outline-none w-full"
              placeholder="Staff Phone"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-secondary">Photo:</label>
            <input
              type="file"
              {...register("staffPhoto", {
                required: "Staff's photo required",
              })}
              accept="image/*"
              className="file-input outline-none w-full"
              placeholder="Choose Image"
            />
            {errors.staffPhoto && (
              <i className="text-red-500 text-sm">
                {errors.staffPhoto.message}
              </i>
            )}
          </div>

          <div className="flex flex-col relative">
            <label className="text-secondary">Password:</label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              {...register("staffPassword", {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
                minLength: 6,
              })}
              className="input outline-none w-full"
              placeholder="Password"
              required
            />
            {errors.staffPassword?.type === "pattern" && (
              <p className="text-red-500 text-sm mt-1">
                Password must contain at least one uppercase letter, one
                lowercase letter, one digit and one special character
              </p>
            )}
            {errors.staffPassword?.type === "minLength" && (
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
            {submitting ? <i>Adding New Staff...</i> : "Submit"}
          </button>
        </form>
      </div>
    </DashboardContainer>
  );
};

export default AddNewStaff;
