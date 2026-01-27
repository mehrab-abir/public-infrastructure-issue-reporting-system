import React from "react";
import { SlLocationPin } from "react-icons/sl";
import Container from "../Components/Container";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../Components/LoaderSpinner";
import { AiOutlineFieldTime } from "react-icons/ai";
import { useState, useEffect } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineFire } from "react-icons/ai";
import { WiTime4 } from "react-icons/wi";
import defaultAvatar from "../assets/defaultAvatar.png";
import useAuth from "../Hooks/Auth/useAuth";
import Swal from "sweetalert2";
import { useRef } from "react";
import EditIssueModal from "../Components/EditIssueModal";

const IssueDetails = () => {
  const { user } = useAuth();

  const { issueId } = useParams();
  const axios = useAxiosSecured();
  const navigate = useNavigate();

  const [reporterInfo, setReporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const editIssueModalRef = useRef();

  const [upvoted, setUpvoted] = useState();

  const paymentModalRef = useRef();

  const {
    data: thisIssue,
    isLoading,
    refetch: refetchThisIssue,
  } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const response = await axios.get(`/issue/details/${issueId}`);
      return response.data;
    },
  });

  //this user details --from db
  const { data: thisUser } = useQuery({
    queryKey: ["this-user", user?.uid],
    queryFn: async () => {
      const response = await axios.get(`/users/${user?.uid}`);
      return response.data;
    },
  });

  //tracking log of this issue
  const { data: timeline = [], isLoading: timelineLoading } = useQuery({
    queryKey: ["timeline", thisIssue?._id],
    queryFn: async () => {
      const response = await axios.get(`/timeline/${thisIssue?._id}`);
      return response.data;
    },
  });

  useEffect(() => {
    const loadPeople = async () => {
      if (!thisIssue.reporterEmail) {
        return;
      }

      setLoadingPeople(true);

      try {
        const response = await axios.get(
          `/issue-reporter?reporterEmail=${thisIssue?.reporterEmail}&staffEmail=${thisIssue?.staffEmail}`,
        );

        setReporterInfo(response.data.reporter);
        setStaffInfo(response.data.staff);
      } finally {
        setLoadingPeople(false);
      }
    };

    loadPeople();
  }, [thisIssue?.reporterEmail, thisIssue?.staffEmail, axios]);

  //to set initial upvote status - after loading data from database
  useEffect(() => {
    if (!thisIssue || !user) {
      return;
    }

    const initialUpvoteStatus = thisIssue?.upvoteBy?.includes(user?.email);
    setUpvoted(initialUpvoteStatus);
  }, [thisIssue, user]);

  //delete this issue - by the reporter
  const deleteThisIssue = (issueId) => {
    if (thisIssue?.status !== "Pending") {
      Swal.fire({
        text: "Deleting the reported issue is allowed only when the issue status is 'Pending'",
      });
      return;
    }

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
          }
          navigate("/all-issues");
        } catch {
          // console.log(err);
          Swal.fire({
            title: "Ooops...!",
            text: "Something went wrong!.",
            icon: "error",
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  const openEditorModal = (issue) => {
    if (thisIssue?.status !== "Pending") {
      Swal.fire({
        text: "Editing the reported issue is allowed only when the issue status is 'Pending'",
      });
      return;
    }

    setSelectedIssue(issue);
    editIssueModalRef.current.showModal();
  };

  //upvote an issue by citizen
  const handleUpvote = async (issue) => {
    if (!user) {
      navigate("/auth/register", { replace: true });
      return;
    }

    try {
      const upvoteInfo = {
        issueId: issue._id,
        upvoteBy: user?.email,
      };

      const response = await axios.patch(`/upvote-issue`, upvoteInfo);

      setUpvoted(response.data.upvoted);

      refetchThisIssue();
    } catch {
      // console.log(error);
    }
  };

  const openPaymentModal = (issue) => {
    if(issue?.status === "Resolved" || issue?.status === "Closed"){
      Swal.fire({text: "Boosting is not applicable for this issue any more"});
      return;
    }
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
    <div className="bg-base pt-28 pb-24">
      <title>{isLoading ? <LoaderSpinner /> : thisIssue?.issueTitle}</title>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            <LoaderSpinner />
          ) : (
            <>
              {/* left side  */}
              <div className="col-span-1 md:col-span-2 bg-surface p-4 space-y-6 rounded-xl">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="px-2 text-white text-nowrap bg-gray-500 rounded-lg text-sm md:text-base">
                    {thisIssue.category}
                  </span>
                  <span
                    className={`px-2 text-white rounded-lg text-nowrap text-sm md:text-base ${
                      thisIssue.status.toLowerCase() === "pending"
                        ? "bg-yellow-500"
                        : thisIssue.status.toLowerCase() === "staff assigned"
                          ? "bg-blue-500"
                          : thisIssue.status.toLowerCase() === "in progress"
                            ? "bg-purple-500"
                            : thisIssue.status.toLowerCase() === "working"
                              ? "bg-sky-600"
                              : thisIssue.status.toLowerCase() === "resolved"
                                ? "bg-emerald-500"
                                : thisIssue.status.toLowerCase() === "closed"
                                  ? "bg-slate-500"
                                  : "bg-red-500"
                    }`}
                  >
                    {thisIssue.status}
                  </span>
                  <span
                    className={`text-white rounded-lg px-2 text-nowrap ${thisIssue?.priority?.toLowerCase().startsWith("normal") ? "bg-indigo-500" : "bg-red-500"} text-sm md:text-base`}
                  >
                    {thisIssue.priority} Priority
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                  {thisIssue.issueTitle}
                </h1>

                <img
                  src={thisIssue?.photoURL}
                  className="rounded-xl object-cover w-full"
                  referrerPolicy="no-referrer"
                  alt=""
                />

                {user?.email === thisIssue?.reporterEmail && (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-sm bg-base border border-blue-500 rounded-lg"
                      onClick={() => openEditorModal(thisIssue)}
                    >
                      <BiSolidEdit className="text-lg" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteThisIssue(thisIssue._id)}
                      className="btn btn-sm bg-base border border-red-500 cursor-pointer rounded-lg"
                      disabled={deleting}
                    >
                      {deleting ? <i>Deleting...</i> : "Delete"}
                    </button>
                    <button
                      className={`tooltip bg-orange-500 text-white btn btn-sm rounded-lg border-none ${thisIssue.priority === "High" && "hidden"}`}
                      onClick={() => openPaymentModal(thisIssue)}
                      data-tip="Boost the issue to get High Priority"
                    >
                      Boost <AiOutlineFire className="text-xl" />
                    </button>
                  </div>
                )}

                <div className="">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="text-muted mt-1">{thisIssue.description}</p>
                </div>

                <div className="bg-surface-alt flex items-center gap-4 px-2 py-3 rounded-xl">
                  <SlLocationPin className="text-lg text-accent" />
                  <div>
                    <h4 className="text-lg font-semibold">Location</h4>
                    <p className="text-secondary">{thisIssue.location}</p>
                  </div>
                </div>

                <div className="border border-base rounded-xl flex flex-col sm:flex-row sm:items-center justify-between px-2 py-3">
                  <div>
                    <h4 className="text-xl font-semibold">Community Support</h4>
                    <p className="text-muted">
                      <span className="text-base md:text-lg font-semibold px-2 border border-blue-500 rounded-lg">
                        {thisIssue.upvote}
                      </span>{" "}
                      People have upvoted this issue
                    </p>
                  </div>
                  <button
                    className={`btn btn-sm md:btn-md mt-4 rounded-xl sm:mt-0 ${user?.email === thisIssue?.reporterEmail || thisUser?.block ? "cursor-not-allowed! bg-blue-300! border-none! text-white!" : "cursor-pointer"} ${upvoted ? "bg-primary text-white border-none" : "bg-surface text-accent border-blue-500"}`}
                    onClick={() => handleUpvote(thisIssue)}
                    disabled={
                      user?.email === thisIssue?.reporterEmail ||
                      thisUser?.block
                    }
                  >
                    {upvoted ? "Upvoted" : "Upvote"}
                  </button>
                </div>
              </div>

              {/* right side */}
              <div className="col-span-1 space-y-6">
                <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
                  <h2 className="text-xl font-semibold mb-2">Reported By</h2>
                  {loadingPeople ? (
                    <LoaderSpinner />
                  ) : (
                    <div className="flex items-center gap-4">
                      <img
                        src={reporterInfo?.photoURL}
                        className="w-14 h-14 object-cover rounded-full"
                        referrerPolicy="no-referrer"
                        alt=""
                      />
                      <div>
                        <p className="font-bold">{reporterInfo?.displayName}</p>
                        <p className="text-muted">{reporterInfo?.email}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
                  <h2 className="text-xl font-semibold mb-2">Assigned Staff</h2>
                  {loadingPeople ? (
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
                          {staffInfo?.displayName
                            ? staffInfo?.displayName
                            : "Not Assigned Yet"}
                        </p>
                        <p className="text-muted">
                          {staffInfo?.email ? staffInfo?.email : "-"}
                        </p>
                      </div>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {staffInfo?.phone ? staffInfo?.phone : "-"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
                  <h2 className="text-xl font-semibold mb-2">
                    Issue Statistics
                  </h2>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base">Reported At:</span>
                      <span className="text-muted text-sm md:text-base">
                        {new Date(thisIssue.created_at).toDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base">
                        Last Updated:
                      </span>
                      <span className="text-muted text-sm md:text-base">
                        {new Date(timeline[0]?.updated_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base">Upvote:</span>
                      <span className="text-muted text-sm md:text-base">
                        {thisIssue.upvote}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* timeline area */}
        {timelineLoading ? (
          <LoaderSpinner />
        ) : (
          <div className="mt-6 bg-surface p-4 border border-base rounded-xl flex flex-col items-start">
            <h3 className="text-xl lg:text-2xl flex items-center gap-2 font-semibold">
              <AiOutlineFieldTime className="text-2xl" />
              Issue Timeline
            </h3>

            <ul className="timeline timeline-vertical timeline-compact mt-4 w-full justify-start items-start">
              {timeline.map((log, index) => (
                <li key={log._id}>
                  <div className="timeline-middle flex items-start">
                    <div className="border-2 border-blue-500 p-1 rounded-full">
                      <WiTime4 className="text-2xl text-blue-500" />
                    </div>
                  </div>

                  <div className="timeline-end timeline-box p-3">
                    <h3
                      className={`text-base font-semibold text-white px-2 rounded-lg mb-2 w-fit ${
                        log.issueStatus.toLowerCase().includes("issue reported")
                          ? "bg-yellow-500"
                          : log.issueStatus
                                .toLowerCase()
                                .includes("staff assigned")
                            ? "bg-blue-500"
                            : log.issueStatus.toLowerCase() === "in progress"
                              ? "bg-purple-500"
                              : log.issueStatus.toLowerCase() === "working"
                                ? "bg-sky-600"
                                : log.issueStatus.toLowerCase() === "resolved"
                                  ? "bg-emerald-500"
                                  : log.issueStatus.toLowerCase() === "closed"
                                    ? "bg-slate-500"
                                    : "bg-red-500"
                      }`}
                    >
                      {log.issueStatus}
                    </h3>
                    <p className="text-base text-muted">
                      <span className="font-semibold text-secondary">By:</span>{" "}
                      <span>{log.updatedBy}</span>
                    </p>
                    <p className="text-sm md:text-base">
                      <span className="font-semibold text-secondary">
                        Updated at:
                      </span>{" "}
                      <span className="text-muted">
                        {new Date(log?.updated_at).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  {index !== timeline.length - 1 && <hr />}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* edit issue modal */}
        <dialog
          ref={editIssueModalRef}
          className="modal modal-bottom sm:modal-middle"
        >
          <EditIssueModal
            selectedIssue={selectedIssue}
            refetchMyIssues={refetchThisIssue}
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
      </Container>
    </div>
  );
};

export default IssueDetails;
