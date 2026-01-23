import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../../Components/LoaderSpinner";
import { Link } from "react-router";

const RecentIssues = () => {
  const axios = useAxiosSecured();

  // fetching all issues
  const {
    data: recentIssues = [],
    isLoading,
  } = useQuery({
    queryKey: ["recent-issues"],
    queryFn: async () => {
      const response = await axios.get(
        `/all-issues?recent=4`,
      );
      return response.data;
    },
  });

  return (
    <div className="mt-5">
      <h1 className="text-xl md:text-2xl font-bold">Recent Issues</h1>

      <div className="mt-2">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${recentIssues.length < 4 && "h-[50vh]"}`}
        >
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Staff Email</th>
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
                recentIssues.map((issue) => {
                  return (
                    <tr key={issue._id}>
                      <td>
                        <Link to={`/issue-details/${issue._id}`} className="font-semibold hover:underline tooltip" data-tip="View Details">
                          {issue.issueTitle}
                        </Link>
                      </td>
                      <td>
                        <button className="btn btn-xs text-nowrap">{issue.category}</button></td>
                      <td>
                        <span
                          className={`px-2 text-nowrap text-white rounded-xl text-xs ${
                            issue.status.toLowerCase() === "pending"
                              ? "bg-yellow-500"
                              : issue.status.toLowerCase() === "staff assigned"
                                ? "bg-blue-500"
                                : issue.status.toLowerCase() === "in progress"
                                  ? "bg-purple-500"
                                  : issue.status.toLowerCase() === "working"
                                    ? "bg-sky-600"
                                    : issue.status.toLowerCase() === "resolved"
                                      ? "bg-emerald-500"
                                      : issue.status.toLowerCase() === "closed"
                                        ? "bg-slate-500"
                                        : "bg-red-500"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td
                        className={`font-semibold ${issue?.priority === "Normal" ? "text-secondary" : "text-red-500"}`}
                      >
                        {issue.priority.split(" ")[0].toUpperCase()}
                      </td>
                      <td>{new Date(issue.created_at).toDateString()}</td>
                      <td>
                        {issue.staffEmail
                          ? issue.staffEmail
                          : "Not Assigned Yet"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentIssues;
