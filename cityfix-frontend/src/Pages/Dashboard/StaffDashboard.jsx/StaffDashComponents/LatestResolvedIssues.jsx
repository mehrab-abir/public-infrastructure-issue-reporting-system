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

  const {
    data = { resolvedIssues: [], totalCount: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["staff-resolved-issues", user?.email, 2],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`/staff/resolved-issues/${user.email}`, {
        params: { recent: 2 },
      });
      return res.data;
    },
  });

  const resolvedIssues = data?.resolvedIssues ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (isError) {
    return (
      <div className="mt-5 bg-surface p-4 rounded-xl border">
        <p className="font-semibold text-red-500">Failed to load data.</p>
        <p className="text-sm text-secondary">
          {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="px-4 py-6 bg-surface shadow-md rounded-xl items-center md:items-start w-fit mx-auto">
        <HiOutlineDocumentReport className="text-2xl text-accent mx-auto" />

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Total Resolved Issues
        </h3>

        <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
          {isLoading ? <LoaderSpinner /> : totalCount}
        </h3>
      </div>

      <h1 className="text-xl md:text-2xl font-bold mt-10">
        Recently Resolved Issues
      </h1>

      <div className="overflow-x-auto bg-surface rounded-lg w-full">
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
                <td colSpan={5} className="py-6 text-center">
                  <LoaderSpinner />
                </td>
              </tr>
            ) : resolvedIssues.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-secondary">
                  No resolved issues found.
                </td>
              </tr>
            ) : (
              resolvedIssues.map((row) => {
                const issue = row?.resolved_issue;

                const status = (issue?.status || "").toLowerCase();
                const statusClass =
                  status === "pending"
                    ? "bg-yellow-500"
                    : status === "staff assigned"
                      ? "bg-blue-500"
                      : status === "in progress"
                        ? "bg-purple-500"
                        : status === "working"
                          ? "bg-sky-600"
                          : status === "resolved"
                            ? "bg-emerald-500"
                            : status === "closed"
                              ? "bg-slate-500"
                              : "bg-red-500";

                const priorityText = issue?.priority || "";
                const isNormal = priorityText.toLowerCase().includes("normal");

                return (
                  <tr key={issue?._id || row?._id}>
                    <td>
                      <Link
                        to={`/issue-details/${issue?._id}`} // ✅ safest: link by actual issue _id
                        className="font-semibold cursor-pointer hover:underline"
                      >
                        {issue?.issueTitle || "Untitled"}
                      </Link>
                    </td>
                    <td>{issue?.category || "-"}</td>
                    <td>
                      <span
                        className={`px-2 text-nowrap text-white rounded-xl text-xs ${statusClass}`}
                      >
                        {issue?.status || "Unknown"}
                      </span>
                    </td>
                    <td
                      className={`font-semibold ${isNormal ? "text-secondary" : "text-red-500"}`}
                    >
                      {priorityText
                        ? priorityText.split(" ")[0].toUpperCase()
                        : "-"}
                    </td>
                    <td>
                      {issue?.created_at
                        ? new Date(issue.created_at).toDateString()
                        : "-"}
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
