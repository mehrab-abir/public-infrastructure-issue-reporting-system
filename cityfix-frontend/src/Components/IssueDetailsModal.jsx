import React from 'react';
import LoaderSpinner from './LoaderSpinner';
import defaultAvatar from "../assets/defaultAvatar.png";

const IssueDetailsModal = ({selectedIssue,staffInfo,reporterInfo,loadingPeople}) => {
    return (
      <div className="modal-box">
        <h3 className="text-xl font-semibold">{selectedIssue?.issueTitle}</h3>
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
            <span
              className={`px-2 rounded-xl text-sm text-white ${
                selectedIssue?.status?.toLowerCase() === "pending"
                  ? "bg-yellow-500"
                  : selectedIssue?.status?.toLowerCase() === "staff assigned"
                    ? "bg-blue-500"
                    : selectedIssue?.status?.toLowerCase() === "in progress"
                      ? "bg-purple-500"
                      : selectedIssue?.status?.toLowerCase() === "working"
                        ? "bg-sky-600"
                        : selectedIssue?.status?.toLowerCase() === "resolved"
                          ? "bg-emerald-500"
                          : selectedIssue?.status?.toLowerCase() === "closed"
                            ? "bg-slate-500"
                            : "bg-red-500"
              }`}
            >
              {selectedIssue?.status
                ? selectedIssue?.status?.toUpperCase()
                : "-"}
            </span>
            <span
              className={`px-2 rounded-xl text-sm text-white ${selectedIssue?.priority === "Normal" ? "bg-gray-500" : "bg-red-500"}`}
            >
              {selectedIssue?.priority
                ? selectedIssue?.priority?.toUpperCase()
                : "-"}
            </span>
          </div>
          <p className="text-secondary my-2">{selectedIssue?.description}</p>
          <p>
            <span className="font-semibold">Posted At:</span>{" "}
            <span>{new Date(selectedIssue?.created_at).toDateString()}</span>
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
                  <p className="font-bold">{reporterInfo?.displayName || ""}</p>
                  <p className="text-muted">{reporterInfo?.email || ""}</p>
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
              <div className="flex flex-col gap-2 mb-2">
                <img
                  src={staffInfo?.photoURL || defaultAvatar}
                  className="w-14 h-14 object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <div>
                  <p className="font-bold">{staffInfo?.displayName || "Not Assigned Yet"}</p>
                  <p className="text-muted">Email: {staffInfo?.email || "staff not assigned yet"}</p>
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
    );
};

export default IssueDetailsModal;