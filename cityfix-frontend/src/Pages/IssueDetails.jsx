import React from "react";
import { SlLocationPin } from "react-icons/sl";
import Container from "../Components/Container";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../Components/LoaderSpinner";
import { useState, useEffect } from "react";

const IssueDetails = () => {
  const { issueId } = useParams();
  const axios = useAxiosSecured();

  const [reporterInfo, setReporterInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);

  const { data: thisIssue, isLoading } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const response = await axios.get(`/issue/details/${issueId}`);
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

  return (
    <div className="bg-base pt-28 pb-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            <LoaderSpinner />
          ) : (
            <>
              {/* left side  */}
              <div className="col-span-1 md:col-span-2 bg-surface p-4 space-y-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="px-2 text-gray-600 bg-surface-alt rounded-xl">
                    {thisIssue.category}
                  </span>
                  <span
                    className={`px-2 text-white rounded-xl ${
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
                    className={`text-white rounded-xl px-2 text-sm absolute top-2 right-2 ${thisIssue?.priority?.toLowerCase().startsWith("normal") ? "bg-gray-500" : "bg-red-500"}`}
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
                      {thisIssue.upvote} People have upvoted this issue
                    </p>
                  </div>
                  <button className="bg-primary text-white btn btn-sm md:btn-md cursor-pointer mt-4 rounded-xl sm:mt-0">
                    Upvote
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
                        src={staffInfo?.photoURL}
                        className="w-14 h-14 object-cover rounded-full"
                        referrerPolicy="no-referrer"
                        alt=""
                      />
                      <div>
                        <p className="font-bold">{staffInfo?.displayName}</p>
                        <p className="text-muted">{staffInfo?.email}</p>
                      </div>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {staffInfo?.phone}
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
                      <span className="text-sm md:text-base text-red-500">
                        --Last Updated--:
                      </span>
                      <span className="text-muted text-sm md:text-base">
                        {new Date().toDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* timeline area */}
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          <div className="mt-6 bg-surface p-4 border border-base rounded-xl"></div>
        )}
      </Container>
    </div>
  );
};

export default IssueDetails;
