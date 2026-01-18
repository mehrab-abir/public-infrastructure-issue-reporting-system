import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import DashboardContainer from "../DashboardContainer";
import LoaderSpinner from "../../../Components/LoaderSpinner";

const ManageUsers = () => {
  const axios = useAxiosSecured();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const response = await axios.get("/users");
      return response.data;
    },
  });
  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Users</h1>
          <p className="text-muted text-sm md:text-lg mt-2">Manage All Users</p>
        </div>
        <p>Showing users: {users.length}</p>
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
                      <td>{user.isPremium ? 'Yes' : 'No'}</td>
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

export default ManageUsers;
