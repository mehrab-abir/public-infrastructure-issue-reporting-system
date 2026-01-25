import React from "react";
import useAuth from "../../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import LoaderSpinner from "../../../../Components/LoaderSpinner";
import { Link } from "react-router";
import { HiOutlineDocumentReport } from "react-icons/hi";

const LatestResolvedIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const { data: issues, isLoading } = useQuery({
    queryKey: ["latest-resolved", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/staff/resolved-issues/${user?.email}?recent=2`,
      );
      return response.data;
    },
  });

  return (
    <div className="mt-5">
      <div className="px-4 py-6 bg-surface shadow-md rounded-xl items-center md:items-start w-fit">
        <HiOutlineDocumentReport className="text-2xl text-accent" />

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Total Resolved Issues
        </h3>
        <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
          {isLoading ? <LoaderSpinner /> : issues?.totalCount}
        </h3>
      </div>

      <h1 className="text-xl md:text-2xl font-bold mt-10">
        Recently Resolved Issues
      </h1>
      <div className={`overflow-x-auto bg-surface rounded-lg w-full`}>
        <table className="table table-sm md:table-md">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Date</th>
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
              issues.resolvedIssue.map((data) => {
                return (
                  <tr key={data.resolved_issue._id}>
                    <td>
                      <Link
                        to={`/issue-details/${data.issueId}`}
                        className="font-semibold cursor-pointer hover:underline"
                      >
                        {data.resolved_issue.issueTitle}
                      </Link>
                    </td>
                    <td>{data.resolved_issue.category}</td>
                    <td>
                      <span
                        className={`px-2 text-nowrap text-white rounded-xl text-xs ${
                          data.resolved_issue.status.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : data.resolved_issue.status.toLowerCase() ===
                                "staff assigned"
                              ? "bg-blue-500"
                              : data.resolved_issue.status.toLowerCase() ===
                                  "in progress"
                                ? "bg-purple-500"
                                : data.resolved_issue.status.toLowerCase() ===
                                    "working"
                                  ? "bg-sky-600"
                                  : data.resolved_issue.status.toLowerCase() ===
                                      "resolved"
                                    ? "bg-emerald-500"
                                    : data.resolved_issue.status.toLowerCase() ===
                                        "closed"
                                      ? "bg-slate-500"
                                      : "bg-red-500"
                        }`}
                      >
                        {data.resolved_issue.status}
                      </span>
                    </td>
                    <td
                      className={`font-semibold ${data.resolved_issue.priority === "Normal" ? "text-secondary" : "text-red-500"}`}
                    >
                      {data.resolved_issue?.priority
                        .split(" ")[0]
                        .toUpperCase()}
                    </td>
                    <td>
                      {new Date(data.resolved_issue.created_at).toDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
