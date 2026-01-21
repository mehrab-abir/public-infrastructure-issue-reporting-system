import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../Components/Container";
import { IoIosSearch, IoMdEye } from "react-icons/io";
import IssueCard from "../Components/IssueCard";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../Components/LoaderSpinner";

const All_Issues = () => {
  const axios = useAxiosSecured();

  const [categories, setCategories] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const {data : all_issues = [], isLoading} = useQuery({
    queryKey : ["all-issues"],
    queryFn : async ()=>{
      const response = await axios.get("/all-issues");
      return response.data;
    }
  })

  return (
    <div className="bg-base pt-36 pb-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            All Reported Issues
          </h1>
          <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
            Browse all infrastructure issues reported by citizens. Filter by
            category, status, or priority to find specific issues.
          </p>
        </div>

        {/* search issues */}
        <div className="relative">
          <input
            type="text"
            className="input w-full outline-none rounded-lg px-8"
            placeholder="Search by title, location or category"
          />
          <IoIosSearch className="absolute top-3 left-3 text-muted text-lg" />
        </div>

        <p className="text-sm text-muted my-4">Showing {all_issues.length} Issues</p>

        {/* filter issues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            <option value="Street Light">Street Light</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Footpath">Footpath</option>
            <option value="Drainage">Drainage</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
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
            <option value="all">All Priorities</option>
            <option value="High Priority">High Priority</option>
            <option value="Normal Priority">Normal Priority</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-10">
          {
            isLoading ? <LoaderSpinner />
            :
            
          
          all_issues.map((issue,index) => {
            return <IssueCard key={index} issue={issue}></IssueCard>;
          })}
        </div>
      </Container>
    </div>
  );
};

export default All_Issues;
