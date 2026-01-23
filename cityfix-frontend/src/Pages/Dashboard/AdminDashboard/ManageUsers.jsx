import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import DashboardContainer from "../DashboardContainer";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import Swal from "sweetalert2";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";

const ManageUsers = () => {
  const axios = useAxiosSecured();
  const [role, setRole] = useState('');
  const [searchText, setSearchText] = useState('');

  const { data: users = [], isLoading, refetch : refetchUsers } = useQuery({
    queryKey: ["all-users", role, searchText],
    queryFn: async () => {
      const response = await axios.get(`/users?role=${role}&searchText=${searchText}`);
      console.log(response.data);
      return response.data;
    },
  });

  const blockUnblock = (user) => {
    Swal.fire({
      title: `Are you sure you want to ${user.block === true ? "unblock" : "block"} this user?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Yes, ${user.block === true ? "Unblock" : "Block"}`,
      denyButtonText: `Don't ${user.block === true ? "Unblock" : "Block"}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `/admin/toggle-block-user/${user?.email}`,
          );
          if (response.data.modifiedCount) {
            Swal.fire("Saved!", "", "success");
            refetchUsers();
          }
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Ooops...",
            text: "Something went worng!",
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Nothing changed", "", "info");
      }
    });
  };


  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Users</h1>
          <p className="text-muted text-sm md:text-lg mt-2">Manage All Users</p>
        </div>
        <p>Showing users: {users.length}</p>
      </div>


      {/* search and filter users  */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 relative mt-4">
        <input
          type="text"
          className="input w-full outline-none px-8 rounded-lg"
          placeholder="Search by name or email"
          onChange={(e)=>setSearchText(e.target.value)}
        />
        <IoIosSearch className="absolute top-3 left-3 text-muted text-lg" />
        <select
          className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="staff">Staff</option>
          <option value="citizen">Citizen</option>
        </select>
      </div>

      <div className="mt-5">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${users.length < 4 && "h-[50vh]"}`}
        >
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Premium</th>
                <th>Role</th>
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
                users.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>{user.isPremium === "yes" ? "Yes" : "No"}</td>
                      <td>{user.role.toUpperCase()}</td>
                      <td>
                        <button
                          onClick={() => blockUnblock(user)}
                          className={`btn btn-sm border ${user.block ? "border-blue-500" : "border-red-500"}`}
                        >
                          {user.block ? "Unblock" : "Block"}
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

export default ManageUsers;
