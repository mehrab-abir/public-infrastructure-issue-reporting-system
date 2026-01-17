import React from "react";
import DashboardContainer from "../DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import Container from "../../../Components/Container";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";

const MyIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const { data: myIssues = [], isLoading } = useQuery({
    queryKey: ["my-issues", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/issues/${user?.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <LoaderSpinner></LoaderSpinner>;
  }

  return (
    <div className="pt-32 pb-20 ml-10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Issues</h1>
            <p className="text-muted text-sm md:text-lg mt-2">
              Manage All Your Reported Issues
            </p>
          </div>
          <div className="my-5">
            <Link to='/report-issuse' className="text-white btn btn-sm md:btn-md bg-primary"><FiPlus className="text-xl" />Report New Issue</Link>
          </div>
        </div>

        <p>Showing issues: {myIssues.length}</p>

        <div className="mt-5">
          <div className="overflow-x-auto bg-surface rounded-xl w-full">
            <table className="table table-zebra table-sm md:table-md">
              {/* head */}
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
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
                  myIssues.map((issue) => {
                    return (
                      <tr key={issue._id}>
                        <td>{issue.issueTitle}</td>
                        <td>{issue.category}</td>
                        <td>
                          <span className="bg-status-pending px-1 text-white rounded-xl">
                            {issue.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{issue.priority.toUpperCase()}</td>
                        <td>{new Date(issue.created_at).toDateString()}</td>
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
      </Container>
    </div>
  );
};

export default MyIssues;
