import React from 'react';
import { SlLocationPin } from "react-icons/sl";
import { IoArrowUp } from "react-icons/io5";
import { IoMdEye } from 'react-icons/io';
import { Link } from 'react-router';

const IssueCard = ({issue}) => {
    return (
      <div className="shadow-md rounded-xl overflow-hidden relative">
        <div className="overflow-hidden">
          <img
            src={issue.photoURL}
            alt=""
            className="object-cover hover:scale-105 transition-all duration-300 w-full h-52"
          />
          <span
            className={`text-white rounded-xl px-2 text-sm absolute top-2 right-2 ${issue?.priority?.toLowerCase().startsWith("normal") ? "bg-gray-500" : "bg-red-500"}`}
          >
            {issue.priority} Priority
          </span>
        </div>

        <div className="bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="btn btn-xs bg-surface-alt border-none text-sm drop-shadow-sm">
              {issue.category}
            </span>
            <span
              className={` text-white px-2 rounded-xl text-sm ${
                issue?.status?.toLowerCase() === "pending"
                  ? "bg-yellow-500"
                  : issue?.status?.toLowerCase() === "staff assigned"
                    ? "bg-blue-500"
                    : issue?.status?.toLowerCase() === "in progress"
                      ? "bg-purple-500"
                      : issue?.status?.toLowerCase() === "working"
                        ? "bg-sky-600"
                        : issue?.status?.toLowerCase() === "resolved"
                          ? "bg-emerald-500"
                          : issue?.status?.toLowerCase() === "closed"
                            ? "bg-slate-500"
                            : "bg-red-500"
              }`}
            >
              {issue.status}
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold h-18">
            {issue.issueTitle}
          </h2>
          <p className="flex items-center gap-1 text-muted text-sm md:text-base">
            <SlLocationPin className="" />
            {issue.location}
          </p>
          <div className="flex items-center justify-between">
            <button
              className="btn btn-sm flex items-center gap-1 bg-surface-alt text-accent border border-blue-500 rounded-lg cursor-pointer tooltip"
              data-tip="upvote"
            >
              <IoArrowUp className="text-lg" />
              <span>{issue.upvote}</span>
            </button>
            <Link
              to={`/issue-details/${issue._id}`}
              className="btn btn-sm hover:bg-primary-hover hover:text-white! text-sm md:text-base border-base"
            >
              <IoMdEye className="text-xl" />
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
};

export default IssueCard;