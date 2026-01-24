import React from 'react';
import LoaderSpinner from '../../../Components/LoaderSpinner';
import useAuth from '../../../Hooks/Auth/useAuth';
import useAxiosSecured from '../../../Hooks/Axios/useAxiosSecured';
import { useQuery } from '@tanstack/react-query';
import DashboardContainer from '../DashboardContainer';
import { Link } from 'react-router';

const ResolvedIssues = () => {
    const {user} = useAuth();
    const axios = useAxiosSecured();

    const {data : resolved_issues = [], isLoading} = useQuery({
        queryKey : ["resolved-issues",user?.email],
        queryFn : async ()=>{
            const response = await axios.get(`/staff/resolved-issues/${user?.email}`);
            console.log(response.data);
            return response.data;
        }
    })
    return (
      <DashboardContainer>
        <div className="flex flex-col space-y-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Resolved Issues</h1>
            <p className="text-muted text-sm md:text-lg mt-2">
              All Issues Resolved By You
            </p>
          </div>
          <p>Showing issues: {resolved_issues.length}</p>
        </div>

        <div className="mt-5">
          <div
            className={`overflow-x-auto bg-surface rounded-lg w-full ${resolved_issues.length < 4 && "h-[50vh]"}`}
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
                  resolved_issues.map((data) => {
                    return (
                      <tr key={data.resolved_issue._id}>
                        <td>
                          <Link to={`/issue-details/${data.issueId}`} className="font-semibold cursor-pointer hover:underline">
                            {data.resolved_issue.issueTitle}
                          </Link>
                        </td>
                        <td>{data.resolved_issue.category}</td>
                        <td>
                          <span
                            className={`px-2 text-nowrap text-white rounded-xl text-xs ${
                              data.resolved_issue.status.toLowerCase() ===
                              "pending"
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
                          {new Date(
                            data.resolved_issue.created_at,
                          ).toDateString()}
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