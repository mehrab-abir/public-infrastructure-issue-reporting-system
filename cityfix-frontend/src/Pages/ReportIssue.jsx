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
import LoaderSpinner from "../Components/LoaderSpinner";
import { useQuery } from "@tanstack/react-query";
import { LuCrown } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import { useRef } from "react";

const ReportIssue = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axios = useAxiosBasic();
  const navigate = useNavigate();

  const subscriptionModalRef = useRef();

  const { data: thisUser, isLoading, refetch: refetchUser } = useQuery({
    queryKey: ["this-user", user?.uid],
    queryFn: async () => {
      const response = await axios.get(`/users/${user?.uid}`);
      return response.data;
    },
  });

  const submitIssue = async (data) => {
    setSubmitting(true);

    const imageFile = data.issuePhoto[0];

    let photoURL = "";

    if (imageFile) {
      photoURL = await uploadToCloudinary(
        imageFile,
        import.meta.env.VITE_CLOUDINARY_ISSUE_PRESET,
      );
    } else {
      alert("Select an Image");
      setSubmitting(false);
      return;
    }

    const newIssue = {
      issueTitle: data.issueTitle,
      category: data.category,
      description: data.description,
      location: data.location,
      photoURL: photoURL,
      reporterEmail: user?.email,
      status: "Pending",
      priority: "Normal",
      priorityLevel: 2,
      created_at: new Date(),
      staffEmail: "",
      upvote: 0,
    };

    try {
      const response = await axios.post("/issues", newIssue);
      console.log(response);

      if (response.data.insertedId) {
        Swal.fire({
          title: "Issue Report Submitted!",
          icon: "success",
          draggable: true,
        });
      }
      navigate("/dashboard/my-issues");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setSubmitting(false);
    } finally {
      setSubmitting(false);
      reset();
    }
    // console.log(newIssue);
  };

  const resetForm = () => {
    reset();
  };


  const openPaymentModal = ()=>{
      subscriptionModalRef.current.showModal();
    }
  
    const handleSubscriptionPayment = async ()=>{
      try{
        const paymentInfo = {
          userEmail : user?.email,
        }
  
        const response = await axios.post('/subscribe/create-checkout-session',paymentInfo);
        window.location.assign(response.data.url);
      }
      catch(error){
        console.log(error);
        Swal.fire({
          icon : "error",
          title : "Ooop...",
          text : "Something went wrong!"
        })
      }
      finally{
        subscriptionModalRef.current.close();
        refetchUser();
      }
    }

  return (
    <div className="bg-base pt-36 pb-24">
      <Container>
        {isLoading ? (
          <LoaderSpinner />
        ) : (thisUser?.issueReported === 3 && thisUser?.isPremium === "no") ? (
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-2xl lg:text-3xl font-bold text-red-500">
              Free Tier Limit Reached
            </h2>
            <div className="my-4 space-y-3 bg-surface p-4 rounded-xl shadow-md">
              <p className="">
                You have reached your free tier limit.
                <br />
                <span className="text-semibold text-secondary">
                  Number of Issues Reported:{" "}
                </span>
                3
              </p>
              <p>
                To report unlimited issues, please upgrade to
                <span className="text-cyan-500 font-semibold">
                  {" "}
                  Premium{" "}
                </span>{" "}
              </p>
            </div>

            <div className="flex flex-col space-y-3 bg-primary p-6 w-full lg:w-2/3 lg:justify-self-end rounded-lg mt-10 md:mt-0">
              <div className="flex items-center gap-2">
                <div>
                  <LuCrown className="text-3xl text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Premium Benefits
                  </h4>
                  <p className="text-white">Upgrade for more features</p>
                </div>
              </div>
              <ul className="text-white pl-2 space-y-2 text-sm mt-2">
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Unlimited Issue Subscription
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Priority Support & Faster Response
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Premium Badge On Profile
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Detailed Analytics Access
                </li>
              </ul>
              <button
                className="bg-accent w-full btn border-none shadow-none text-white mt-3 hover:bg-orange-500! rounded-lg"
                onClick={() => openPaymentModal()}
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        ) : (
          <>
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

              <form
                onSubmit={handleSubmit(submitIssue)}
                className="space-y-3 mt-5"
              >
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Issue Title</label>
                  <input
                    type="text"
                    {...register("issueTitle", { required: true })}
                    className="input w-full outline-none rounded-lg"
                    placeholder="e.g. Broken street light on Bay St."
                  />
                  {errors.issueTitle?.type === "required" && (
                    <i className="text-sm text-red-400">
                      Issue title is required
                    </i>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Select Category</label>
                  <select
                    className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
                    {...register("category", { required: "Select a category" })}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Street Light">Street Light</option>
                    <option value="Pothole">Pothole</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Traffic Light">Traffic Light</option>
                    <option value="Sidewalk">Sidewalk</option>
                    <option value="Drainage">Drainage</option>
                    <option value="Road Block">Road Block</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <i className="text-sm text-red-400">
                      {errors.category.message}
                    </i>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Description</label>
                  <textarea
                    type="text"
                    {...register("description", {
                      required: "Provide a description of the issue",
                    })}
                    className="textarea w-full outline-none rounded-lg"
                    placeholder="Provide a detailed description of the issue..."
                  />
                  {errors.description && (
                    <i className="text-sm text-red-400">
                      {errors.description.message}
                    </i>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    {...register("location", {
                      required: "This field is required",
                    })}
                    className="input w-full outline-none rounded-lg"
                    placeholder="e.g. 1001 Bay St., Downtown"
                  />
                  {errors.location && (
                    <i className="text-sm text-red-400">
                      {errors.location.message}
                    </i>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Photo</label>
                  <input
                    type="file"
                    {...register("issuePhoto", {
                      required: "One photo is required",
                    })}
                    className="file-input w-full outline-none rounded-lg"
                    placeholder="e.g. 1001 Bay St., Downtown"
                  />
                  <span className="text-xs text-muted">
                    Add a photo to help illustrate the issue
                  </span>
                  {errors.issuePhoto && (
                    <i className="text-sm text-red-400">
                      {errors.issuePhoto.message}
                    </i>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => resetForm()}
                    className="btn bg-surface-alt shadow-md w-1/2 cursor-pointer border-none rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn w-1/2 bg-primary cursor-pointer border-none text-white rounded-lg"
                    disabled={submitting}
                  >
                    {submitting ? <i>Submitting...</i> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </Container>

      {/* subscription payment modal */}
      <dialog
        ref={subscriptionModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Upgrade To Premium</h3>
          <p className="py-4">
            Premium Users Can Report
            <span className="text-orange-500 font-semibold">
              {" "}Unlimited Issues
            </span>
          </p>
          <p className="text-lg font-semibold mt-2">Fees : $1000</p>
          <button
            className="mt-3 btn btn-sm text-white border-none bg-primary cursor-pointer"
            onClick={() => handleSubscriptionPayment()}
          >
            Proceed to Payment
          </button>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ReportIssue;
