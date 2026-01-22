import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import DashboardContainer from "../DashboardContainer";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { GrUserWorker } from "react-icons/gr";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import IssueDetailsModal from "../../../Components/IssueDetailsModal";

const ManageIssues = () => {
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reporterInfo, setReporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const detailsModalRef = useRef(null);

  const staffModalRef = useRef(null);
  const [assigning, setAssigning] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState("");

  //for filtering
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  // fetching all issues
  const {
    data: all_issues = [],
    isLoading,
    refetch: refetchIssues,
  } = useQuery({
    queryKey: ["all-issues", searchText, category, status, priority],
    queryFn: async () => {
      const response = await axios.get(
        `/all-issues?searchText=${searchText}&category=${category}&status=${status}&priority=${priority}`,
      );
      return response.data;
    },
  });

  // fetching all staffs to assign task/issue
  const { data: staffs = [], isLoading: staffLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const response = await axios.get("/all-staffs");
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

        setReporterInfo(response.data.reporter);
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

  const openStaffModal = (issue) => {
    setSelectedIssue(issue);
    staffModalRef.current.showModal();
  };

  //assign staff fn
  const assignStaff = async (staff) => {
    setAssigning(true);

    const assignStaffInfo = {
      issueId: selectedIssue._id,
      trackingId: selectedIssue.trackingId,
      staffEmail: staff.email,
      staffName: staff.displayName,
    };

    try {
      const response = await axios.patch("/assign-staff", assignStaffInfo);

      if (response.data.modifiedCount) {
        staffModalRef.current.close();
        Swal.fire({ title: "Staff Assigned" });
      }
      refetchIssues();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        tilte: "Ooops...",
        text: "Something went wrong!",
      });
    } finally {
      setAssigning(false);
      staffModalRef.current.close();
    }
  };

  //delete an issue
  const deleteIssue = (issueId) => {
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
          const response = await axios.delete(`/admin/delete-issue/${issueId}`);
          if (response.data.deletedCount) {
            Swal.fire({
              title: "Deleted!",
              text: "Issue has been deleted.",
              icon: "success",
            });
          }

          refetchIssues();
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${err.message}`,
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  //reject an issue
  const rejectIssue = (issue) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#ff2020",
      confirmButtonText: "Yes, Reject It!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `/admin/reject-issue?issueId=${issue._id}&trackingId=${issue.trackingId}`,
          );
          console.log(response.data);

          if (response.data.modifiedCount) {
            Swal.fire({
              title: "Rejected!",
              icon: "success",
            });
            refetchIssues();
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Ooops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Issues</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Manage All Reported Issues
          </p>
        </div>
        <p className="mt-3 md:mt-0">Showing issues: {all_issues.length}</p>
      </div>

      {/* search by title or assigned staff email */}
      <input
        type="text"
        className="input outline-none w-full mt-6"
        placeholder="Search by title or assigned staff email"
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* filter issues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
        <select
          className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Street Light">Street Light</option>
          <option value="Traffic Light">Traffic Light</option>
          <option value="Pothole">Pothole</option>
          <option value="Garbage">Garbage</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Sidewalk">Sidewalk</option>
          <option value="Drainage">Drainage</option>
          <option value="Road Block">Road Block</option>
          <option value="Other">Other</option>
        </select>
        <select
          className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Staff Assigned">Staff Assigned</option>
          <option value="Working">Working</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Normal">Normal Priority</option>
        </select>
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
                <th>Staff Email</th>
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
                      <td
                        onClick={() => viewIssueDetails(issue)}
                        className="font-semibold cursor-pointer hover:underline"
                      >
                        {issue.issueTitle}
                      </td>
                      <td>{issue.category}</td>
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

                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            className="tooltip cursor-pointer"
                            data-tip="View Details"
                            onClick={() => viewIssueDetails(issue)}
                          >
                            <IoEye className="text-lg md:text-2xl" />
                          </button>
                          <button
                            className={`tooltip ${issue.status === "Rejected" ? "cursor-not-allowed" : "cursor-pointer"}`}
                            data-tip="Reject Issue"
                            onClick={() => rejectIssue(issue)}
                            disabled={issue.status === "Rejected"}
                          >
                            <LiaTimesSolid
                              className={`text-lg md:text-xl ${issue.status === "Rejected" && 'text-gray-300'}`}
                            />
                          </button>
                          <button
                            onClick={() => openStaffModal(issue)}
                            className={` ${issue.status.toLowerCase() !== "pending" ? "cursor-not-allowed text-gray-300" : "tooltip cursor-pointer text-accent"}`}
                            data-tip="Assign worker"
                            disabled={issue.status.toLowerCase() !== "pending"}
                          >
                            <GrUserWorker className="text-lg md:text-2xl" />
                          </button>
                          <button
                            className="tooltip cursor-pointer hover:text-red-500"
                            data-tip="Delete"
                            onClick={() => deleteIssue(issue._id)}
                            disabled={deleting}
                          >
                            <RiDeleteBin6Line className="text-lg md:text-2xl" />
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

          {/* staff modal ro assign staff to an issue */}
          <dialog
            ref={staffModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-semibold text-lg">
                Showing staffs ({staffs.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Photo</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffLoading ? (
                      <tr>
                        <td>
                          <LoaderSpinner />{" "}
                        </td>
                      </tr>
                    ) : (
                      staffs.map((staff) => {
                        return (
                          <tr key={staff._id}>
                            <td>{staff.displayName}</td>
                            <td>
                              <img
                                src={staff.photoURL}
                                className="w-12 h-12 rounded-xl object-cover"
                                referrerPolicy="no-referrer"
                                alt=""
                              />
                            </td>
                            <td>{staff.email}</td>
                            <td>
                              <button
                                onClick={() => assignStaff(staff)}
                                className={`btn btn-sm bg-primary text-white cursor-pointer ${assigning && "cursor-not-allowed"}`}
                                disabled={assigning}
                              >
                                Assign
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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

export default ManageIssues;
