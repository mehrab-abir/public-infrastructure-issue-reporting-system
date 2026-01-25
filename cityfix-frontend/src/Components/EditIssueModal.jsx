import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import uploadToCloudinary from "../Utilities/uploadImage";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";

const EditIssueModal = ({
  selectedIssue,
  refetchMyIssues,
  editIssueModalRef,
}) => {
  const axios = useAxiosSecured();
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "",
    },
  });

  useEffect(() => {
    if (selectedIssue) {
      reset({
        category: selectedIssue.category,
      });
    }
  }, [selectedIssue, reset]);

  const saveChanges = async (data) => {
    setEditing(true);

    const imageFile = data.issuePhoto[0];

    let photoURL = selectedIssue?.photoURL;

    if (imageFile) {
      photoURL = await uploadToCloudinary(
        imageFile,
        import.meta.env.VITE_CLOUDINARY_ISSUE_PRESET,
      );
    }

    const editedIssue = {
      issueTitle: data.issueTitle,
      category: data.category,
      description: data.description,
      location: data.location,
      photoURL: photoURL,
    };

    try {
      const response = await axios.patch(
        `/edit-issue/${selectedIssue?._id}`,
        editedIssue,
      );

      if (response.data.modifiedCount) {
        Swal.fire({
          title: "Saved Successfully!",
          icon: "success",
          draggable: true,
        });
      }
      refetchMyIssues();
    } catch {
      // console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setEditing(false);
      editIssueModalRef.current.close();
    }
  };

  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">Edit Issue</h3>
      <form onSubmit={handleSubmit(saveChanges)} className="space-y-3 mt-5">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Issue Title</label>
          <input
            type="text"
            {...register("issueTitle", { required: true })}
            className="input w-full outline-none rounded-lg"
            defaultValue={selectedIssue?.issueTitle}
          />
          {errors.issueTitle?.type === "required" && (
            <i className="text-sm text-red-400">Issue title is required</i>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Select Category</label>
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            {...register("category", {
              required: "Select a category",
            })}
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
            <i className="text-sm text-red-400">{errors.category.message}</i>
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
            defaultValue={selectedIssue?.description}
          />
          {errors.description && (
            <i className="text-sm text-red-400">{errors.description.message}</i>
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
            defaultValue={selectedIssue?.location}
          />
          {errors.location && (
            <i className="text-sm text-red-400">{errors.location.message}</i>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Update Photo (Optional)</label>
          <input
            type="file"
            {...register("issuePhoto")}
            className="file-input w-full outline-none rounded-lg"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            className="btn w-full bg-primary cursor-pointer border-none text-white rounded-lg mt-2"
            disabled={editing}
          >
            {editing ? <i>Saving...</i> : "Save"}
          </button>
        </div>
      </form>
      <div className="modal-action">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
};

export default EditIssueModal;
