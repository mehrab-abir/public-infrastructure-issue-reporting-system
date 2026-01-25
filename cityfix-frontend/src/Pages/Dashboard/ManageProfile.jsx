import React from "react";
import DashboardContainer from "./DashboardContainer";
import useAuth from "../../Hooks/Auth/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { useQuery } from "@tanstack/react-query";
import LoaderSpinner from "../../Components/LoaderSpinner";
import useAxiosSecured from "../../Hooks/Axios/useAxiosSecured";
import { LuCrown } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useRef } from "react";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import uploadToCloudinary from "../../Utilities/uploadImage";
import useRole from "../../Hooks/Role/useRole";

const ManageProfile = () => {
  const { user, loading, setLoading, updateUserProfile, setUser } = useAuth();
  const {role, roleLoading} = useRole();

  const axios = useAxiosSecured();

  const [editEnable, setEditEnable] = useState(false);
  const nameRef = useRef(null);

  const imageRef = useRef(null);
  const imageModalRef = useRef(null);
  const [noImageError, setNoImageError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const subscriptionModalRef = useRef();

  const { data: thisUser, isLoading, refetch:refetchUser } = useQuery({
    queryKey: ["user-info", user?.uid],
    queryFn: async () => {
      const response = await axios.get(`/users/${user?.uid}`);
      // console.log(response);
      return response.data;
    },
  });

  //update name
  const handleNameSave = async () => {
    setSubmitting(true);

    const displayName = nameRef.current.value;
    // console.log(displayName);

    if (displayName.length < 2) {
      toast.error(`Name must have minimum 2 characters`, {
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
      setSubmitting(false);
      return;
    }

    try {
      //update in firebase
      await updateUserProfile({ displayName });
      setUser((prevUser) => ({
        ...prevUser,
        displayName,
      }));

      //update in mongodb
      const response = await axios.patch(`/update-profile/${user?.email}?role=${role}`, {
        displayName,
      });

      if (response.data.acknowledge) {
        Swal.fire({
          title: "Name updated!",
          icon: "success",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
      setEditEnable(false);
    }
  };

  const openImageModal = () => {
    setNoImageError("");
    imageModalRef.current.showModal();
  };

  //update profile image
  const handlePhotoSave = async () => {
    setSubmitting(true);

    if (!imageRef.current.files[0]) {
      setNoImageError("No photo selected");
      setSubmitting(false);
      return;
    }

    const imageFile = imageRef.current.files[0];

    try {
      const photoURL = await uploadToCloudinary(
        imageFile,
        import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET,
      );

      //update in firebase
      await updateUserProfile({ photoURL });
      setUser((prevUser) => ({
        ...prevUser,
        photoURL,
      }));

      //upload in mongodb
      const response = await axios.patch(`/update-profile/${user?.email}?role=${role}`, {
        photoURL,
      });
      if (response.data.acknowledge) {
        Swal.fire({
          title: "Photo updated!",
          icon: "success",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
      imageModalRef.current.close();
    }
  };

  const openPaymentModal = () => {
      subscriptionModalRef.current.showModal();
    };
  
    const handleSubscriptionPayment = async () => {
      try {
        const paymentInfo = {
          userEmail: user?.email,
        };
  
        const response = await axios.post(
          "/subscribe/create-checkout-session",
          paymentInfo,
        );
        window.location.assign(response.data.url);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ooop...",
          text: "Something went wrong!",
        });
      } finally {
        subscriptionModalRef.current.close();
        refetchUser();
      }
    };

  
  if(roleLoading){
    return <LoaderSpinner></LoaderSpinner>
  }

  const profileImg =
    user?.photoURL || user?.providerData[0]?.photoURL || defaultAvatar;
  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Profile</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Manage your account settings and subscription
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* left side */}
        <div className="bg-surface p-4 border border-gray-300 flex-1 rounded-xl">
          <div className="flex flex-col items-center px-2 py-6 border-b border-gray-300">
            {loading ? (
              <div className="flex items-center justify-center mt-10">
                <LoaderSpinner></LoaderSpinner>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={profileImg}
                  className="w-20 h-20 object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <BiSolidEdit
                  onClick={() => openImageModal()}
                  className="text-xl absolute bottom-0 -right-6 text-secondary cursor-pointer"
                />
              </div>
            )}

            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold">{user?.displayName}</h3>
              <p className="text-muted text-sm">{user?.email}</p>

              {thisUser?.isPremium === "yes" && (
                <div className="flex items-center justify-between bg-orange-100 text-orange-400 text-sm rounded-full px-2 mt-2">
                  <LuCrown />
                  <span>Premium</span>
                </div>
              )}
            </div>
            <dialog
              ref={imageModalRef}
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-2">Upload new photo</h3>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input outline-none"
                  ref={imageRef}
                />
                <p className="text-red-500 text-sm">{noImageError}</p>
                <button
                  onClick={() => handlePhotoSave()}
                  className="btn btn-sm bg-primary cursor-pointer text-white mt-4"
                  disabled={submitting}
                >
                  {submitting ? <i>Saving...</i> : "Save"}
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

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm lg:text-base">
                Member Since:{" "}
              </span>
              <span className="font-semibold text-sm lg:text-base">
                {isLoading ? (
                  <LoaderSpinner />
                ) : (
                  new Date(thisUser?.created_at).toDateString() ||
                  "-Reload Page-"
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm lg:text-base">Role </span>
              <button className="btn btn-xs rounded-xl">
                {isLoading ? (
                  <LoaderSpinner />
                ) : (
                  thisUser?.role?.toUpperCase() || "-Reload Page-"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flex-2 space-y-4">
          {/* profile info div */}
          <div className="bg-surface p-4 border border-gray-300 rounded-xl ">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">
                  Profile Information
                </span>
                <span className="text-muted">Update your personal details</span>
              </div>
              {editEnable ? (
                <button
                  className={`btn btn-sm bg-primary text-white border-none`}
                  onClick={() => handleNameSave()}
                >
                  <IoSaveOutline className="text-lg" />
                  {submitting ? <i>Saving...</i> : "Save"}
                </button>
              ) : (
                <button
                  className={`btn btn-sm border-none`}
                  onClick={() => setEditEnable(true)}
                >
                  <BiSolidEdit className="text-lg" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex flex-col">
                <label>Name:</label>
                <input
                  type="text"
                  className={`input outline-none w-full ${editEnable ? "pointer-events-auto text-primary" : "pointer-events-none text-muted"}`}
                  defaultValue={user?.displayName}
                  ref={nameRef}
                />
              </div>

              <div className="flex flex-col">
                <label>Email Address:</label>
                <input
                  type="text"
                  className="input outline-none w-full pointer-events-none"
                  value={user?.email}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* subscription info div */}
          <div className="">
            {isLoading ? (
              <LoaderSpinner />
            ) : thisUser?.isPremium === "yes" ? (
              <div className="bg-hero p-4 border border-gray-300 rounded-xl">
                <h1 className="text-2xl">Subscription</h1>
                <div className="flex gap-2 mt-4">
                  <LuCrown className="text-2xl text-orange-400" />
                  <span>Premium Member</span>
                </div>
                <p className="text-muted">
                  You have access to all premium features
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span>Premium member since:</span>
                  <span className="font-semibold">
                    {new Date(thisUser?.subscribed_at).toDateString()}
                  </span>
                </div>
              </div>
            ) : (thisUser?.role?.toLowerCase() === "citizen" && thisUser?.isPremium === "no") ? (
              <div className="bg-surface p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <div>
                    <LuCrown className="text-3xl text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold ">Premium Benefits</h4>
                    <p className="">Upgrade for more features</p>
                  </div>
                </div>
                <ul className="pl-2 space-y-2 text-sm mt-4">
                  <li className="flex items-center gap-1">
                    <IoMdCheckmark /> Unlimited Issue Subscription
                  </li>
                  <li className="flex items-center gap-1">
                    <IoMdCheckmark /> Priority Support & Faster Response
                  </li>
                  <li className="flex items-center gap-1">
                    <IoMdCheckmark /> Boost Issue Visibility
                  </li>
                  <li className="flex items-center gap-1">
                    <IoMdCheckmark /> Premium Badge On Profile
                  </li>
                  <li className="flex items-center gap-1">
                    <IoMdCheckmark /> Detailed Analytics Access
                  </li>
                </ul>
                <button
                  onClick={() => openPaymentModal()}
                  className="bg-accent w-full btn border-none shadow-none text-white mt-3 hover:bg-orange-500! rounded-lg"
                >
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

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
                {" "}
                Unlimited Issues
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
    </DashboardContainer>
  );
};

export default ManageProfile;
