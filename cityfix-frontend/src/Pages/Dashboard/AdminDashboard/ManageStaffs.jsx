import React from "react";
import DashboardContainer from "../DashboardContainer";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import Swal from "sweetalert2";
import { useState } from "react";

const ManageStaffs = () => {
  const axios = useAxiosSecured();
  const [deleting, setDeleting] = useState(false);

  const { data: allStaffs = [], isLoading, refetch : refetchStaff } = useQuery({
    queryKey: ["all-staffs"],
    queryFn: async () => {
      const response = await axios.get("/all-staffs");
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
            className="text-white btn btn-sm md:btn-md bg-primary"
          >
            <FiPlus className="text-xl" />
            Add New Staff
          </Link>
        </div>
      </div>
      <p>Showing Staffs: {0}</p>

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
              ) : (
                allStaffs.map((staff) => {
                  return (
                    <tr key={staff._id}>
                      <td>{staff.displayName}</td>
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
                        <button
                          onClick={() => deleteStaff(staff)}
                          className="btn btn-sm"
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default ManageStaffs;
