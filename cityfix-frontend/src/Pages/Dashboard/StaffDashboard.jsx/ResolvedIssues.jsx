import React from "react";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import useAuth from "../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import DashboardContainer from "../DashboardContainer";
import { Link } from "react-router";

const ResolvedIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const {
    data: resolvedData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["resolved-issues", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/staff/resolved-issues/${user.email}`);
      return response.data; // { resolvedIssues, totalCount }
    },
  });

  const resolvedIssues = resolvedData?.resolvedIssues ?? [];
  const totalCount = resolvedData?.totalCount ?? 0;

  if (isError) {
    return (
      <DashboardContainer>
        <p className="text-red-500">
          Failed to load resolved issues: {error?.message || "Unknown error"}
        </p>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <title>Resolved Issues</title>
      <div className="flex flex-col space-y-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Resolved Issues</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            All Issues Resolved By You
          </p>
        </div>

        <p>
          Showing issues: {resolvedIssues.length} of {totalCount}
        </p>
      </div>

      <div className="mt-5">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${
            resolvedIssues.length < 4 ? "h-[50vh]" : ""
          }`}
        >
          <table className="table table-sm md:table-md">
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
                  <td colSpan={5} className="py-8">
                    <LoaderSpinner />
                  </td>
                </tr>
              ) : resolvedIssues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No resolved issues found.
                  </td>
                </tr>
              ) : (
                resolvedIssues.map((row) => {
                  const issue = row?.resolved_issue; // joined issue doc

                  const status = issue?.status;
                  const priority = issue?.priority;
                  const createdAt = issue?.created_at;

                  return (
                    <tr key={row._id}>
                      <td>
                        <Link
                          to={`/issue-details/${issue?._id || row.issueId}`}
                          className="font-semibold cursor-pointer hover:underline"
                        >
                          {issue?.issueTitle || "Untitled"}
                        </Link>
                      </td>

                      <td>{issue?.category || "—"}</td>

                      <td>
                        <span
                          className={`px-2 text-nowrap text-white rounded-xl text-xs ${
                            status === "Pending"
                              ? "bg-yellow-500"
                              : status === "Staff Assigned"
                                ? "bg-blue-500"
                                : status === "In Progress"
                                  ? "bg-purple-500"
                                  : status === "Working"
                                    ? "bg-sky-600"
                                    : status === "Resolved"
                                      ? "bg-emerald-500"
                                      : status === "Closed"
                                        ? "bg-slate-500"
                                        : "bg-red-500"
                          }`}
                        >
                          {status || "Unknown"}
                        </span>
                      </td>

                      <td
                        className={`font-semibold ${
                          priority?.startsWith("Normal")
                            ? "text-secondary"
                            : "text-red-500"
                        }`}
                      >
                        {priority ? priority.split(" ")[0].toUpperCase() : "—"}
                      </td>

                      <td>
                        {createdAt ? new Date(createdAt).toDateString() : "—"}
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

export default ResolvedIssues;
