import React from "react";
import DashboardContainer from "../DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import { FiPlus } from "react-icons/fi";
import { BiSolidEdit } from "react-icons/bi";
import { Link } from "react-router";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import EditIssueModal from "../../../Components/EditIssueModal";

const MyIssues = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const editIssueModalRef = useRef();

  const paymentModalRef = useRef();

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

  //delete a reported issue if it is still 'Pending'
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
        } catch {
          // console.log(err);
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

  const openEditorModal = (issue) => {
    setSelectedIssue(issue);
    editIssueModalRef.current.showModal();
  };

  const openPaymentModal = (issue) => {
    setSelectedIssue(issue);
    paymentModalRef.current.showModal();
  };

  const handleBoostPayment = async (issue) => {
    try {
      const paymentInfo = {
        issueId: issue._id,
        issueTitle: issue.issueTitle,
        boostFee: 100,
        reporterEmail: issue.reporterEmail,
        trackingId: issue.trackingId,
      };

      const response = await axios.post(
        "/create-checkout-session",
        paymentInfo,
      );
      // console.log("Create checkout session response : ", response);
      window.location.assign(response.data.url);
    } catch {
      // console.log(error);
      Swal.fire({
        icon: "error",
        title: "Ooop...",
        text: "Something went wrong!",
      });
    } finally {
      paymentModalRef.current.close();
    }
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
              to="/report-issue"
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
            {myIssues?.length === 0 ? (
              <div className="py-5">
                <p className="text-muted text-center">
                  -No issue reported yet-
                </p>
              </div>
            ) : (
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
                          <td>
                            <Link
                              to={`/issue-details/${issue._id}`}
                              className="font-semibold hover:underline cursor-pointer"
                            >
                              {issue.issueTitle}
                            </Link>
                          </td>
                          <td>{issue.category}</td>
                          <td>
                            <span
                              className={`px-1 text-nowrap text-white rounded-xl text-xs ${
                                issue.status.toLowerCase() === "pending"
                                  ? "bg-yellow-500"
                                  : issue.status.toLowerCase() ===
                                      "staff assigned"
                                    ? "bg-blue-500"
                                    : issue.status.toLowerCase() ===
                                        "in progress"
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
                          <td>
                            <div className="flex flex-col items-center justify-center">
                              <span
                                className={`font-semibold ${issue?.priority === "Normal" ? "text-secondary" : "text-red-500"}`}
                              >
                                {issue.priority.split(" ")[0].toUpperCase()}
                              </span>
                              <button
                                className={`cursor-pointer bg-orange-500 text-white mt-1 btn btn-xs border-none tooltip ${issue?.priority === "High" && "hidden"}`}
                                data-tip="Boost issue to get High Priority"
                                onClick={() => openPaymentModal(issue)}
                              >
                                Boost
                              </button>
                            </div>
                          </td>
                          <td>{new Date(issue.created_at).toDateString()}</td>
                          <td>
                            {issue.staffEmail
                              ? issue.staffEmail
                              : "Not Assigned Yet"}
                          </td>
                          <td>
                            <div className="flex items-center gap-4">
                              <Link
                                to={`/issue-details/${issue._id}`}
                                className="cursor-pointer tooltip"
                                data-tip="View Details"
                              >
                                <IoEye className="text-xl" />
                              </Link>
                              <button
                                className={`tooltip ${issue.status !== "Pending" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                data-tip="Edit"
                                onClick={() => openEditorModal(issue)}
                                disabled={issue.status !== "Pending"}
                              >
                                <BiSolidEdit
                                  className={`text-xl ${issue.status !== "Pending" && "text-gray-400"}`}
                                />
                              </button>
                              <button
                                className={`tooltip ${issue.status !== "Pending" ? "cursor-not-allowed" : "cursor-pointer"}`}
                                data-tip="Delete"
                                disabled={
                                  issue.status !== "Pending" || deleting
                                }
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
            )}

            {/* edit issue modal */}
            <dialog
              ref={editIssueModalRef}
              className="modal modal-bottom sm:modal-middle"
            >
              <EditIssueModal
                selectedIssue={selectedIssue}
                refetchMyIssues={refetchMyIssues}
                editIssueModalRef={editIssueModalRef}
              ></EditIssueModal>
            </dialog>

            {/* boost issue payment confirmation modal */}
            <dialog
              ref={paymentModalRef}
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Boost Issue</h3>
                <p className="py-4">
                  Boosted issues get{" "}
                  <span className="text-orange-500 font-semibold">
                    high priority
                  </span>
                  , stays top of all other issues.
                </p>
                <p className="text-lg font-semibold mt-2">Fees : $100</p>
                <button
                  className="mt-3 btn btn-sm text-white border-none bg-primary cursor-pointer"
                  onClick={() => handleBoostPayment(selectedIssue)}
                >
                  Proceed to Payment
                </button>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default MyIssues;
