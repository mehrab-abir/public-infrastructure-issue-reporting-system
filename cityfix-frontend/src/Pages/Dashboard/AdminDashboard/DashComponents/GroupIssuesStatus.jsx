import React from "react";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import LoaderSpinner from "../../../../Components/LoaderSpinner";
import { LiaTimesCircle } from "react-icons/lia";
import { GoIssueClosed } from "react-icons/go";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { TbProgressBolt } from "react-icons/tb";
import { LiaToolsSolid } from "react-icons/lia";
import { MdOutlinePending } from "react-icons/md";

const GroupIssuesStatus = () => {
  const axios = useAxiosSecured();

  const { data, isLoading } = useQuery({
    queryKey: ["group-issues"],
    queryFn: async () => {
      const response = await axios.get("/group-issues-by-status");
      return response.data;
    },
  });

  console.log(data);

  return (
    <div className="mt-6">
      <h1 className="text-xl md:text-2xl font-bold mb-2">Number of Issues By Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          data.map((stat) => {
            return (
              <div key={stat._id} className="py-3 flex flex-col items-center justify-center bg-surface rounded-xl">
                {
                    stat._id === "Pending" ? <MdOutlinePending className="text-2xl text-yellow-500" />
                    :
                    stat._id === "Staff Assigned" ? <GrUserWorker className="text-2xl text-blue-500" />
                    :
                    stat._id === "In Progress" ? <TbProgressBolt className="text-2xl text-purple-500" />
                    :
                    stat._id === "Working" ? <LiaToolsSolid className="text-2xl text-slate-500" />
                    :
                    stat._id === "Resolved" ? <GoIssueClosed className="text-2xl text-emerald-500" />
                    :
                    stat._id === "Closed" ? <IoCheckmarkDoneCircleOutline className="text-2xl text-gray-500" />
                    :
                    <LiaTimesCircle className="text-2xl mt-2 text-red-500" />
                }
                <div className="my-2 text-3xl font-bold">{stat.count}</div>
                <div className="text-nowrap text-center text-lg text-secondary mt-3">{stat._id}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GroupIssuesStatus;
