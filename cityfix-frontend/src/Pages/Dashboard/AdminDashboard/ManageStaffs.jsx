import React from "react";
import DashboardContainer from "../DashboardContainer";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";

const ManageStaffs = () => {
  const axios = useAxiosSecured();

  const {data : allStaffs = [], isLoading} = useQuery({
    queryKey : ["all-staffs"],
    queryFn : async ()=>{
      const response = await axios.get("/all-staffs");
      return response.data;
    }
  })

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
                        <img src={staff.photoURL} className="w-10 md:w-14 h-10 md:h-14 object-cover rounded-xl" referrerPolicy="no-referrer" alt="" />
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>
                        <button className="btn btn-sm">Delete</button>
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
