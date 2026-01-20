import React from "react";
import DashboardContainer from "../DashboardContainer";
import staffImg from "../../../assets/staffsImg.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import uploadToCloudinary from "../../../Utilities/uploadImage";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";

const AddNewStaff = () => {
  const navigate = useNavigate();
  const axios = useAxiosSecured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addNewStaff = async (data) => {
    setSubmitting(true);

    const imageFile = data.staffPhoto[0];

    const photoURL = await uploadToCloudinary(
      imageFile,
      import.meta.env.VITE_CLOUDINARY_STAFF_PRESET,
    );

    const newStaff = {
      email: data.staffEmail,
      password: data.staffPassword,
      displayName: data.staffName,
      phone: data.staffPhone,
      photoURL: photoURL,
      //role and created_at given in server-side
    };

    try {
      //register the staff in firebase -- account creation in backend
      const response = await axios.post("/admin/register-staff", newStaff);

      if (response.data.acknowledge) {
        Swal.fire({
          title: "Staff Account Created!",
          icon: "success",
        });
        navigate("/dashboard/manage-staffs");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: "Ooops...",
        title: "Something went worng!",
      });
    } finally {
      setSubmitting(false);
    }
  };

  //   console.log("Role in add new staff page ->>: ", role);

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
