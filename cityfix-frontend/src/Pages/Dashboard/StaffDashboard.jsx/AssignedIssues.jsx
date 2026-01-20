import React from "react";
import DashboardContainer from "../DashboardContainer";
import useAuth from "../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import { IoEye } from "react-icons/io5";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import { useState } from "react";
import { useRef } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import { useEffect } from "react";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import Swal from 'sweetalert2'

const AssignedIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reporterInfo, setRoporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const detailsModalRef = useRef(null);

  const [updating, setUpdating] = useState(false);

  //all assigned issues
  const { data: assignedIssues = [], isLoading, refetch : refetchAssignedIssues } = useQuery({
    queryKey: ["assigned-issues", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/staff/assigned-issues/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
      const loadPeople = async () => {
        if (!selectedIssue.reporterEmail) {
          return;
        }
  
        setLoadingPeople(true);
  
        try {
          const response = await axios.get(
            `/issue-reporter?reporterEmail=${selectedIssue?.reporterEmail}&staffEmail=${selectedIssue?.staffEmail}`,
          );
  
          setRoporterInfo(response.data.reporter);
          setStaffInfo(response.data.staff);
        } finally {
          setLoadingPeople(false);
        }
      };
  
      loadPeople();
    }, [selectedIssue?.reporterEmail, selectedIssue?.staffEmail, axios]);
  
    const viewIssueDetails = async (issue) => {
      setSelectedIssue(issue);
      detailsModalRef.current.showModal();
    };


    const updateIssueStatus = async (issueId, staffResponse) =>{
      setUpdating(true);

      try{
        const response = await axios.patch(`/staff/update-issue-status?issueId=${issueId}&staffResponse=${staffResponse}`);

        if(response.data.modifiedCount){
          Swal.fire({
            icon : "success",
            title : "Issue Status Updated"
          })
        }
        refetchAssignedIssues();
      }
      catch(error){
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ooops...",
          text : "Something Went Wrong!"
        });
      }
      finally{
        setUpdating(false);
      }
    }

  return (
    <DashboardContainer>
      <div className="flex flex-col space-y-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Assigned Issues</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Manage Your All Assigned Issues - accept/reject, update the status
            of your assigned issue, in progress, resolved etc.
          </p>
        </div>
        <p>Showing issues: {assignedIssues.length}</p>
      </div>

      <div>
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Posted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td>
                    <LoaderSpinner />
                  </td>
                </tr>
              ) : (
                assignedIssues.map((issue, index) => {
                  return (
                    <tr key={issue._id}>
                      <th>{index + 1}</th>
                      <td
                        onClick={() => viewIssueDetails(issue)}
                        className="font-semibold hover:underline cursor-pointer"
                      >
                        {issue.issueTitle}
                      </td>
                      <td
                        className={`font-semibold ${issue?.priority?.startsWith("normal") ? "text-secondary" : "text-red-500"}`}
                      >
                        {issue.priority.split(" ")[0].toUpperCase()}
                      </td>
                      <td>
                        <span
                          className={`px-1 w-fit text-white rounded-xl text-xs ${
                            issue.status.toLowerCase() === "pending"
                              ? "bg-yellow-500"
                              : issue.status.toLowerCase() === "staff assigned"
                                ? "bg-purple-500"
                                : issue.status.toLowerCase() === "in progress"
                                  ? "bg-blue-500"
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
                      <td>{new Date(issue.created_at).toDateString()}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => viewIssueDetails(issue)}
                            className="cursor-pointer tooltip"
                            data-tip="View Details"
                          >
                            <IoEye className="text-xl" />
                          </button>
                          <div className="flex items-center gap-3">
                            <button
                              className="cursor-pointer tooltip"
                              data-tip="accept"
                              onClick={() =>
                                updateIssueStatus(issue._id, "accept")
                              }
                              disabled={updating}
                            >
                              <IoMdCheckmark className="text-xl" />
                            </button>
                            <button
                              className="cursor-pointer tooltip"
                              data-tip="Reject"
                              onClick={() =>
                                updateIssueStatus(issue._id, "reject")
                              }
                              disabled={updating}
                            >
                              <LiaTimesSolid className="text-xl" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* issue details modal */}
          <dialog
            ref={detailsModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="text-xl font-semibold">
                {selectedIssue?.issueTitle}
              </h3>
              <div className="py-4">
                <img
                  src={selectedIssue?.photoURL}
                  referrerPolicy="no-referrer"
                  className="object-cover w-75 rounded-xl"
                  alt=""
                />
                <div className="flex items-center gap-3 my-4">
                  <span className="px-2 rounded-xl text-sm bg-surface-alt">
                    {selectedIssue?.category
                      ? selectedIssue?.category?.toUpperCase()
                      : "-"}
                  </span>
                  <span className="px-2 rounded-xl text-sm bg-status-pending text-white">
                    {selectedIssue?.status
                      ? selectedIssue?.status?.toUpperCase()
                      : "-"}
                  </span>
                  <span
                    className={`px-2 rounded-xl text-sm text-white ${selectedIssue?.priority?.startsWith("normal") ? "bg-gray-500" : "bg-red-500"}`}
                  >
                    {selectedIssue?.priority
                      ? selectedIssue?.priority?.toUpperCase()
                      : "-"}
                  </span>
                </div>
                <p className="text-secondary my-2">
                  {selectedIssue?.description}
                </p>
                <p>
                  <span className="font-semibold">Posted At:</span>{" "}
                  <span>
                    {new Date(selectedIssue?.created_at).toDateString()}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Upvote:</span>{" "}
                  <span>{selectedIssue?.upvote}</span>
                </p>

                {/* reporter info */}
                <div className="p-6 rounded-xl border border-base shadow-md mt-4">
                  <h2 className="text-lg font-semibold mb-2">Reported By</h2>
                  {loadingPeople || !reporterInfo ? (
                    <LoaderSpinner></LoaderSpinner>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img
                        src={reporterInfo?.photoURL || defaultAvatar}
                        className="w-14 h-14 object-cover rounded-full"
                        referrerPolicy="no-referrer"
                        alt=""
                      />
                      <div>
                        <p className="font-bold">
                          {reporterInfo?.displayName || ""}
                        </p>
                        <p className="text-muted">
                          {reporterInfo?.email || ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* assigned staff info */}
                <div className="p-6 rounded-xl border border-base shadow-md mt-4">
                  <h2 className="text-xl font-semibold mb-2">Assigned Staff</h2>
                  {loadingPeople || !staffInfo ? (
                    <LoaderSpinner />
                  ) : (
                    <div className="flex flex-col gap-4 mb-2">
                      <img
                        src={staffInfo?.photoURL || defaultAvatar}
                        className="w-14 h-14 object-cover rounded-full"
                        referrerPolicy="no-referrer"
                        alt=""
                      />
                      <div>
                        <p className="font-bold">
                          {staffInfo?.displayName || "---"}
                        </p>
                        <p className="text-muted">
                          {staffInfo?.email || "---"}
                        </p>
                      </div>
                      <p>Phone : {staffInfo?.phone || "---"}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default AssignedIssues;
