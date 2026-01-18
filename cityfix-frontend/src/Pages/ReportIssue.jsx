import React from "react";
import Container from "../Components/Container";
import { useForm } from "react-hook-form";
// import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import uploadToCloudinary from "../Utilities/uploadImage";
import useAxiosBasic from "../Hooks/Axios/useAxiosBasic";
import useAuth from "../Hooks/Auth/useAuth";

const ReportIssue = () => {
    const {user} = useAuth();
  const { register, handleSubmit, reset, formState:{errors} } = useForm();
  const axios = useAxiosBasic();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const submitIssue = async (data)=>{
    setSubmitting(true);

    const imageFile = data.issuePhoto[0];

    let photoURL = '';

    if(imageFile){
        photoURL = await uploadToCloudinary(
          imageFile,
          import.meta.env.VITE_CLOUDINARY_ISSUE_PRESET
        );
    }
    else{
        alert("Select an Image");
        setSubmitting(false);
        return;
    }
    
    const newIssue = {
        issueTitle : data.issueTitle,
        category : data.category,
        description : data.description,
        location : data.location,
        photoURL : photoURL,
        reporterName : user?.displayName,
        reporterEmail : user?.email,
        reporterPhotoURL : user?.photoURL,
        status : "pending",
        priority : "normal",
        created_at : new Date(),
        assignedStaff : {},
        upvote : 0
    }

    try{
        const response = await axios.post("/issues",newIssue);
        console.log(response);

        if(response.data.insertedId){
            Swal.fire({
            title: "Issue Report Submitted!",
            icon: "success",
            draggable: true
            });
        }
        navigate('/all-issues');
    }
    catch(error){
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setSubmitting(false);
    }
    finally{
        setSubmitting(false);
        reset();
    }
    // console.log(newIssue);
  }


  const resetForm = ()=>{
    reset();
  }

  return (
    <div className="bg-base pt-36 pb-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Report an Issue
          </h1>
          <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
            Help Building Better City
          </p>
        </div>

        <div className="bg-surface drop-shadow-md rounded-xl p-8 w-11/12 md:w-9/12 lg:w-7/12 mx-auto">
          <h3 className="text-xl font-bold">Issue Details</h3>
          <p className="text-muted">
            Provide detailed information about the infrastructure issue
          </p>

          <form onSubmit={handleSubmit(submitIssue)} className="space-y-3 mt-5">
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Issue Title</label>
              <input
                type="text"
                {...register("issueTitle",{required : true})}
                className="input w-full outline-none rounded-lg"
                placeholder="e.g. Broken street light on Bay St."
              />
              {errors.issueTitle?.type==="required" && <i className="text-sm text-red-400">Issue title is required</i>}
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Select Category</label>
              <select
                className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
                {...register("category",{required : "Select a category"})}
                defaultValue={""}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Street Light">Street Light</option>
                <option value="Pothole">Pothole</option>
                <option value="Garbage">Garbage</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Footpath">Footpath</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <i className="text-sm text-red-400">{errors.category.message}</i>}
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Description</label>
              <textarea
                type="text"
                {...register("description",{required : "Provide a description of the issue"})}
                className="textarea w-full outline-none rounded-lg"
                placeholder="Provide a detailed description of the issue..."
              />
              {errors.description && <i className="text-sm text-red-400">{errors.description.message}</i>}
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Location</label>
              <input
                type="text"
                {...register("location",{required:"This field is required"})}
                className="input w-full outline-none rounded-lg"
                placeholder="e.g. 1001 Bay St., Downtown"
              />
              {errors.location && <i className="text-sm text-red-400">{errors.location.message}</i>}
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Photo</label>
              <input
                type="file"
                {...register("issuePhoto",{required:"One photo is required"})}
                className="file-input w-full outline-none rounded-lg"
                placeholder="e.g. 1001 Bay St., Downtown"
              />
              <span className="text-xs text-muted">
                Add a photo to help illustrate the issue
              </span>
              {errors.issuePhoto && <i className="text-sm text-red-400">{errors.issuePhoto.message}</i>}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={()=>resetForm()}
                className="btn bg-surface-alt shadow-md w-1/2 cursor-pointer border-none rounded-lg"
              >
                Cancel
              </button>
              <button className="btn w-1/2 bg-primary cursor-pointer border-none text-white rounded-lg" disabled={submitting}>
                {submitting ? <i>Submitting...</i> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ReportIssue;
