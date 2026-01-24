import React from "react";
import useAuth from "../../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineDocumentReport } from "react-icons/hi";
import LoaderSpinner from "../../../../Components/LoaderSpinner";
import { MdOutlinePending } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { TbProgressBolt } from "react-icons/tb";
import { LiaTimesCircle, LiaToolsSolid } from "react-icons/lia";
import { GoIssueClosed } from "react-icons/go";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const IssueCountByStatus = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  const { data : issues = [], isLoading } = useQuery({
    queryKey: ["issue-status-group", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/citizen/issue-count-by-status/${user?.email}`,
      );
      /* console.log(response.data[0].byStatus)
      console.log("Total Count",response.data[0]?.total[0].totalCount) */
      return response.data;
    },
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-10">
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        issues[0].byStatus.map((data) => {
          return (
            <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-xl items-center md:items-start w-full">
              {data._id === "Pending" ? (
                <MdOutlinePending className="text-2xl text-yellow-500" />
              ) : data._id === "Staff Assigned" ? (
                <GrUserWorker className="text-2xl text-blue-500" />
              ) : data._id === "In Progress" ? (
                <TbProgressBolt className="text-2xl text-purple-500" />
              ) : data._id === "Working" ? (
                <LiaToolsSolid className="text-2xl text-slate-500" />
              ) : data._id === "Resolved" ? (
                <GoIssueClosed className="text-2xl text-emerald-500" />
              ) : data._id === "Closed" ? (
                <IoCheckmarkDoneCircleOutline className="text-2xl text-gray-500" />
              ) : (
                <LiaTimesCircle className="text-2xl mt-2 text-red-500" />
              )}

              <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
                {data._id}
              </h3>
              <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
                {data.count}
              </h3>
            </div>
          );
        })
      )}
      <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-xl items-center md:items-start w-full">
        <HiOutlineDocumentReport className="text-2xl text-accent" />

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Total Issues Reported
        </h3>
        <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
          {issues[0]?.total[0].totalCount}
        </h3>
      </div>
    </div>
  );
};

export default IssueCountByStatus;
