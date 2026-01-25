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
import Swal from "sweetalert2";
import IssueDetailsModal from "../../../Components/IssueDetailsModal";

const AssignedIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reporterInfo, setRoporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const detailsModalRef = useRef(null);

  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  //all assigned issues
  const {
    data: assignedIssues = [],
    isLoading,
    refetch: refetchAssignedIssues,
  } = useQuery({
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
  }, [selectedIssue?.staffEmail, selectedIssue?.reporterEmail, axios]);

  const viewIssueDetails = async (issue) => {
    setSelectedIssue(issue);
    detailsModalRef.current.showModal();
  };

  const updateIssueStatus = async (issue, staffResponse) => {
    setUpdating(true);

    try {
      const updateInfo = {
        issueId: issue._id,
        staffResponse: staffResponse,
        staffEmail: issue.staffEmail,
        trackingId: issue.trackingId,
      };

      const response = await axios.patch(
        `/staff/update-issue-status`,
        updateInfo,
      );

      if (response.data.modifiedCount) {
        Swal.fire({
          icon: "success",
          title: "Issue Status Updated",
        });
      }
      refetchAssignedIssues();
    } catch {
      // console.log(error);
      Swal.fire({
        icon: "error",
        title: "Ooops...",
        text: "Something Went Wrong!",
      });
    } finally {
      setUpdating(false);
    }
  };

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

      {
        assignedIssues.length === 0 && <p className="text-secondary text-center my-4">
          -You do not have any assigned issue at this moment-
        </p>
      }

      <div>
        <div
          className={`overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ${assignedIssues.length < 4 && "h-[50vh]"}`}
        >
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
                        className={`font-semibold ${issue?.priority === "Normal" ? "text-secondary" : "text-red-500"}`}
                      >
                        {issue.priority.split(" ")[0].toUpperCase()}
                      </td>
                      <td>
                        <span
                          className={`px-1 text-nowrap text-white rounded-xl text-xs ${
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
                      <td>{new Date(issue.created_at).toDateString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewIssueDetails(issue)}
                            className="cursor-pointer tooltip"
                            data-tip="View Details"
                          >
                            <IoEye className="text-xl" />
                          </button>

                          <div
                            className={`flex items-center gap-3 ${issue.status !== "Staff Assigned" && "hidden"} mx-1`}
                          >
                            <button
                              className="cursor-pointer tooltip"
                              data-tip="accept"
                              onClick={() => updateIssueStatus(issue, "accept")}
                              disabled={updating}
                            >
                              <IoMdCheckmark className="text-xl" />
                            </button>
                            <button
                              className="cursor-pointer tooltip"
                              data-tip="Reject"
                              onClick={() => updateIssueStatus(issue, "reject")}
                              disabled={updating}
                            >
                              <LiaTimesSolid className="text-xl" />
                            </button>
                          </div>

                          <select
                            defaultValue="Update Status"
                            className={`select ${issue.status === "Staff Assigned" && "hidden"} select-sm outline-none cursor-pointer`}
                            onChange={(e) => setCurrentStatus(e.target.value)}
                          >
                            <option disabled={true}>Update Status</option>
                            <option>Working</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                          </select>
                          <button
                            className={`btn btn-sm bg-primary text-white ${
                              issue.status === "Staff Assigned"
                                ? "hidden"
                                : issue.status === "Closed"
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                            }`}
                            disabled={updating || issue.status === "Closed"}
                            onClick={() =>
                              updateIssueStatus(issue, currentStatus)
                            }
                          >
                            Save
                          </button>
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
            <IssueDetailsModal
              selectedIssue={selectedIssue}
              staffInfo={staffInfo}
              reporterInfo={reporterInfo}
              loadingPeople={loadingPeople}
            ></IssueDetailsModal>
          </dialog>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default AssignedIssues;
