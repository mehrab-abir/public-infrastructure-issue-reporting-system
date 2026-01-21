import React from "react";
import DashboardContainer from "../DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import IssueDetailsModal from "../../../Components/IssueDetailsModal";
import Swal from "sweetalert2";

const MyIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reporterInfo, setRoporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const detailsModalRef = useRef(null);

  const [deleting, setDeleting] = useState(false);

  //get all my reported issues
  const {
    data: myIssues = [],
    isLoading,
    refetch: refetchMyIssues,
  } = useQuery({
    queryKey: ["my-issues", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/issues/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
    const loadPeople = async () => {
      if (!user.email) {
        return;
      }

      setLoadingPeople(true);

      try {
        const response = await axios.get(
          `/issue-reporter?staffEmail=${selectedIssue?.staffEmail}`,
        );

        setStaffInfo(response.data.staff);

        const reporter = {
          displayName: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
        };

        setRoporterInfo(reporter);
      } finally {
        setLoadingPeople(false);
      }
    };

    loadPeople();
  }, [
    user?.displayName,
    user?.email,
    user?.photoURL,
    selectedIssue?.staffEmail,
    axios,
  ]);

  const viewIssueDetails = async (issue) => {
    setSelectedIssue(issue);
    detailsModalRef.current.showModal();
  };

  //delete a reported issue if it is still 'pending'
  const deleteReportedIssue = (issueId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#ff2020",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleting(true);
          const response = await axios.delete(
            `/citizen/delete-issue/${issueId}`,
          );
          if (response.data.deletedCount) {
            Swal.fire({
              title: "Deleted!",
              text: "Issue has been deleted.",
              icon: "success",
            });
            refetchMyIssues();
          }
        } catch (err) {
          console.log(err);
          Swal.fire({
            title: "Ooops..",
            text: "Something Went Wrong!.",
            icon: "error",
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  return (
    <>
      <DashboardContainer>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Issues</h1>
            <p className="text-muted text-sm md:text-lg mt-2">
              Manage All Your Reported Issues
            </p>
          </div>
          <div className="my-5 md:my-0">
            <Link
              to="/report-issuse"
              className="text-white btn btn-sm md:btn-md bg-primary rounded-lg"
            >
              <FiPlus className="text-xl" />
              Report New Issue
            </Link>
          </div>
        </div>

        <p>Showing issues: {myIssues.length}</p>

        <div className="mt-5">
          <div
            className={`overflow-x-auto bg-surface rounded-lg w-full ${myIssues.length < 4 && "h-[50vh]"}`}
          >
            <table className="table table-zebra table-sm md:table-md">
              {/* head */}
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Assigned Staff</th>
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
                        <td
                          onClick={() => viewIssueDetails(issue)}
                          className="font-semibold hover:underline cursor-pointer"
                        >
                          {issue.issueTitle}
                        </td>
                        <td>{issue.category}</td>
                        <td>
                          <span
                            className={`px-1 w-fit text-white rounded-xl text-xs ${
                              issue.status.toLowerCase() === "pending"
                                ? "bg-yellow-500"
                                : issue.status.toLowerCase() ===
                                    "staff assigned"
                                  ? "bg-blue-500"
                                  : issue.status.toLowerCase() === "in progress"
                                    ? "bg-purple-500"
                                    : issue.status.toLowerCase() === "working"
                                      ? "bg-sky-600"
                                      : issue.status.toLowerCase() ===
                                          "resolved"
                                        ? "bg-emerald-500"
                                        : issue.status.toLowerCase() ===
                                            "closed"
                                          ? "bg-slate-500"
                                          : "bg-red-500"
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>
                        <td
                          className={`font-semibold ${issue?.priority?.startsWith("normal") ? "text-secondary" : "text-red-500"}`}
                        >
                          {issue.priority.split(" ")[0].toUpperCase()}
                        </td>
                        <td>{new Date(issue.created_at).toDateString()}</td>
                        <td>
                          {issue.staffEmail
                            ? issue.staffEmail
                            : "Not Assigned Yet"}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button
                              className="cursor-pointer tooltip"
                              data-tip="View Details"
                              onClick={() => viewIssueDetails(issue)}
                            >
                              <IoEye className="text-xl" />
                            </button>
                            <button
                              className={`tooltip ${issue.status !== "Pending" ? "cursor-not-allowed" : "cursor-pointer"}`}
                              data-tip="Delete"
                              disabled={issue.status !== "Pending" || deleting}
                              onClick={() => deleteReportedIssue(issue._id)}
                            >
                              <RiDeleteBin6Line
                                className={`text-xl ${issue.status !== "Pending" && "text-gray-400"}`}
                              />
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
    </>
  );
};

export default MyIssues;
