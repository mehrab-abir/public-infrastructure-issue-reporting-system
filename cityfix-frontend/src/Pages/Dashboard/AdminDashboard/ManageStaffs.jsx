import React from "react";
import DashboardContainer from "../DashboardContainer";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { BiSolidEdit } from "react-icons/bi";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRef } from "react";
import uploadToCloudinary from "../../../Utilities/uploadImage";

const ManageStaffs = () => {
  const axios = useAxiosSecured();
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [updating, setUpdating] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const editStaffModal = useRef(null);

  const {
    register,
    handleSubmit,
  } = useForm();

  const {
    data: allStaffs = [],
    isLoading,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["all-staffs", searchText],
    queryFn: async () => {
      const response = await axios.get(`/all-staffs?searchText=${searchText}`);
      return response.data;
    },
  });

  const deleteStaff = (staff) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#ff2020",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        try {
          const response = await axios.delete(
            `/admin/delete-staff/${staff.uid}`,
          );
          if (response.data.deleted) {
            Swal.fire({
              title: "Deleted!",
              text: "This staff has been deleted.",
              icon: "success",
            });
            refetchStaff();
          }
        } catch {
          Swal.fire({
            icon: "error",
            title: "Ooops...",
            text: "Something went wrong!",
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  const updateStaffInfo = async (data) => {
    setUpdating(true);

    let photoURL = selectedStaff?.photoURL;

    const imageFile = data.staffPhoto[0];

    if (imageFile) {
      photoURL = await uploadToCloudinary(
        imageFile,
        import.meta.env.VITE_CLOUDINARY_STAFF_PRESET,
      );
    }

    const updatedStaffInfo = {
      displayName: data.staffName,
      phone: data.staffPhone,
      photoURL: photoURL,
    };

    try {
      //register the staff in firebase -- account creation in backend
      const response = await axios.patch( `/admin/update-staff/${selectedStaff.uid}`, updatedStaffInfo);

      if (response.data.updated) {
        Swal.fire({
          title: "Staff Information Updated!",
          icon: "success",
        });
        refetchStaff();
      }
    } catch {
      // console.log(error);
      Swal.fire({
        icon: "error",
        text: "Ooops...",
        title: "Something went worng!",
      });
    } finally {
      setUpdating(false);
      editStaffModal.current.close();
    }
  };

  const openStaffEditor = (staff) => {
    setSelectedStaff(staff);
    editStaffModal.current.showModal();
  };

  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Staffs</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Manage All Registered Staffs
          </p>
        </div>
        <div className="my-5 md:my-0">
          <Link
            to="/dashboard/add-new-staff"
            className="text-white btn btn-sm md:btn-md bg-primary border-none"
          >
            <FiPlus className="text-xl" />
            Add New Staff
          </Link>
        </div>
      </div>
      <p>Showing Staffs: {allStaffs.length}</p>

      <input
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        className="input w-full outline-none mt-4"
        placeholder="Search by name"
      />

      <div className="mt-5">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${allStaffs.length < 4 && "h-[50vh]"}`}
        >
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Photo</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="col-span-6">
                    <LoaderSpinner></LoaderSpinner>
                  </td>
                </tr>
              ) : allStaffs.length === 0 ? (
                <tr>
                  <td className="text-muted text-center">No Staff Found</td>
                </tr>
              ) : (
                allStaffs.map((staff) => {
                  return (
                    <tr key={staff._id}>
                      <td className="font-semibold">{staff.displayName}</td>
                      <td>
                        <img
                          src={staff.photoURL}
                          className="w-10 md:w-14 h-10 md:h-14 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                          alt=""
                        />
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>
                        <div className="flex items-center gap-4">
                          <button
                            className="btn btn-sm border-none cursor-pointer tooltip"
                            data-tip="Update Staff Info"
                            onClick={() => openStaffEditor(staff)}
                          >
                            <BiSolidEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => deleteStaff(staff)}
                            className="btn btn-sm border-none hover:bg-red-500 hover:text-white! tooltip"
                            data-tip="Delete Staff"
                            disabled={deleting}
                          >
                            <RiDeleteBin6Line className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* edit staff info modal  */}
          <dialog
            ref={editStaffModal}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Update Staff Information</h3>
              <form
                onSubmit={handleSubmit(updateStaffInfo)}
                className="mt-5 space-y-3"
              >
                <div className="flex flex-col">
                  <label className="text-secondary">Staff Name:</label>
                  <input
                    type="text"
                    {...register("staffName")}
                    className="input outline-none w-full"
                    defaultValue={selectedStaff?.displayName}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-secondary">Staff Email:</label>
                  <input
                    type="email"
                    {...register("staffEmail")}
                    className="input outline-none w-full"
                    value={selectedStaff?.email}
                    readOnly
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-secondary">Staff Phone No.:</label>
                  <input
                    type="text"
                    {...register("staffPhone")}
                    className="input outline-none w-full"
                    defaultValue={selectedStaff?.phone}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-secondary">Update Photo (Optional):</label>
                  <input
                    type="file"
                    {...register("staffPhoto")}
                    accept="image/*"
                    className="file-input outline-none w-full"
                    placeholder="Choose Image"
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-primary w-full text-white cursor-pointer mt-4 border-none"
                  disabled={updating}
                >
                  {updating ? <i>Saving...</i> : "Save Changes"}
                </button>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ManageStaffs;
