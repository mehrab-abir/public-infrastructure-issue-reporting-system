import React from "react";
import { useQuery } from "@tanstack/react-query";
import LoaderSpinner from "../../../../Components/LoaderSpinner";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { FaPeopleGroup } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GrUserWorker } from "react-icons/gr";
import { FaRegMoneyBill1 } from "react-icons/fa6";

const Counts = () => {
  const axios = useAxiosSecured();

  //get number of issues
  const { data: issueCount, isLoading: issueLoading } = useQuery({
    queryKey: ["issue-count"],
    queryFn: async () => {
      const response = await axios.get("/issue-count");
      return response.data;
    },
  });

  //get number of registered citizen
  const { data: citizenCount, isLoading: citizenLoading } = useQuery({
    queryKey: ["issue-count"],
    queryFn: async () => {
      const response = await axios.get("/citizen-count");
      return response.data;
    },
  });

  //get number of staffs
  const { data: staffCount, isLoading: staffLoading } = useQuery({
    queryKey: ["staff-count"],
    queryFn: async () => {
      const response = await axios.get("/staff-count");
      return response.data;
    },
  });

  //total revenue
  const { data: totalRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["total-revenue"],
    queryFn: async () => {
      const response = await axios.get("/total-revenue");
      return response.data;
    },
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-10">
      <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start w-full">
        <span className="bg-primary-soft p-2 w-fit rounded-lg">
          <HiOutlineDocumentReport className="text-2xl text-accent" />
        </span>

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Total Issues
        </h3>
        {issueLoading ? (
          <LoaderSpinner />
        ) : (
          <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
            {issueCount}
          </h3>
        )}
      </div>
      <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start w-full">
        <span className="bg-primary-soft p-2 w-fit rounded-lg">
          <FaPeopleGroup className="text-2xl text-accent" />
        </span>

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Registered Citizens
        </h3>
        {citizenLoading ? (
          <LoaderSpinner />
        ) : (
          <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
            {citizenCount}
          </h3>
        )}
      </div>
      <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start w-full">
        <span className="bg-primary-soft p-2 w-fit rounded-lg">
          <GrUserWorker className="text-2xl text-accent" />
        </span>

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Number of Staffs
        </h3>
        {staffLoading ? (
          <LoaderSpinner />
        ) : (
          <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
            {staffCount}
          </h3>
        )}
      </div>

      <div className="pl-4 py-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start w-full">
        <span className="bg-primary-soft p-2 w-fit rounded-lg">
          <FaRegMoneyBill1 className="text-2xl text-accent" />
        </span>

        <h3 className="text-xl text-secondary font-semibold flex items-center my-2">
          Total Revenue
        </h3>
        {revenueLoading ? (
          <LoaderSpinner />
        ) : (
          <h3 className="text-2xl font-bold mt-3 text-center md:text-start">
            ${totalRevenue}
          </h3>
        )}
      </div>
    </div>
  );
};

export default Counts;
