import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import DashboardContainer from "../DashboardContainer";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { useState } from "react";
import { useRef } from "react";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ManageIssues = () => {
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reporterInfo, setRoporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const detailsModalRef = useRef(null);

  const staffModalRef = useRef(null);
  const [assigning, setAssigning] = useState(false);

  // fetching all issues
  const { data: all_issues = [], isLoading, refetch : refetchIssues } = useQuery({
    queryKey: ["all-issues"],
    queryFn: async () => {
      const response = await axios.get("/all-issues");
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

  const openStaffModal = (issue) => {
    setSelectedIssue(issue);
    staffModalRef.current.showModal();
  };

  //assign staff fn
  const assignStaff = async (staff) => {
    setAssigning(true);

    const assignStaffInfo = {
      issueId: selectedIssue._id,
      staffEmail: staff.email,
      staffName : staff.displayName
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
                        <span className="bg-status-pending px-1 text-white rounded-xl text-xs">
                          {issue.status.toUpperCase()}
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
                            className="tooltip cursor-pointer"
                            data-tip="View Details"
                            onClick={() => viewIssueDetails(issue)}
                          >
                            <IoEye className="text-lg md:text-2xl" />
                          </button>
                          <button
                            onClick={() => openStaffModal(issue)}
                            className="tooltip cursor-pointer text-accent"
                            data-tip="Assign Worker"
                          >
                            <GrUserWorker className="text-lg md:text-2xl" />
                          </button>
                          <button
                            className="tooltip cursor-pointer hover:text-red-500"
                            data-tip="Delete"
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
                                className={`btn btn-sm bg-primary text-white cursor-pointer ${assigning && 'cursor-not-allowed'}`}
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
