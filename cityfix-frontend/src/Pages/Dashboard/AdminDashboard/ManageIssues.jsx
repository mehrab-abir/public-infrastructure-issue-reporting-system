import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecured from '../../../Hooks/Axios/useAxiosSecured';
import LoaderSpinner from '../../../Components/LoaderSpinner';
import DashboardContainer from '../DashboardContainer';

const ManageIssues = () => {
    const axios = useAxiosSecured();

    const {data : all_issues = [], isLoading} = useQuery({
        queryKey : ["all-issues"],
        queryFn : async ()=>{
            const response = await axios.get("/all-issues");
            return response.data;
        }
    })
    return (
      <DashboardContainer>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">All Issues</h1>
            <p className="text-muted text-sm md:text-lg mt-2">
              Manage All Reported Issues
            </p>
          </div>
          <p>Showing issues: {all_issues.length}</p>
        </div>

        

        <div className="mt-5">
          <div
            className={`overflow-x-auto bg-surface rounded-lg w-full ${all_issues.length < 4 && "h-[50vh]"}`}
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
                  all_issues.map((issue) => {
                    return (
                      <tr key={issue._id}>
                        <td className='font-semibold'>{issue.issueTitle}</td>
                        <td>{issue.category}</td>
                        <td>
                          <span className="bg-status-pending px-1 text-white rounded-xl">
                            {issue.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{issue.priority.toUpperCase()}</td>
                        <td>{new Date(issue.created_at).toDateString()}</td>
                        <td>
                          <button className="btn btn-sm">Details</button>
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

export default ManageIssues;