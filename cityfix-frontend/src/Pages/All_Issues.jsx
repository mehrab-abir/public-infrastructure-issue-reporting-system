import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "../Components/Container";
import { IoIosSearch } from "react-icons/io";
import IssueCard from "../Components/IssueCard";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../Components/LoaderSpinner";
import { useEffect } from "react";

const All_Issues = () => {
  const axios = useAxiosSecured();

  const [category, setCategory] = useState("");

  //for filtering
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [searchText, setSearchText] = useState('');


  //for pagination
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 9;

  const { data : result = [], isLoading } = useQuery({
    queryKey: ["all-issues", category, status, priority, searchText, currentPage],
    queryFn: async () => {
      const response = await axios.get(`/all-issues?category=${category}&status=${status}&priority=${priority}&searchText=${searchText}&recent=${limit}&skip=${currentPage*limit}`);
      // console.log(response.data);
      return response.data;
    },
  });

  useEffect(()=>{
    if(!result) return;

    const setPaginationValues = ()=>{
      const count = Number(result?.totalCount) || 0;
      setTotalCount(count);

      const pages = Math.ceil(result?.totalCount / limit);
      setTotalPage(pages);
    }

    setPaginationValues();

  },[result])

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
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IoIosSearch className="absolute top-3 left-3 text-muted text-lg" />
        </div>

        <p className="text-sm text-muted my-4">
          Showing {result?.issues?.length} of {totalCount} Issues
        </p>

        {/* filter issues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Street Light">Street Light</option>
            <option value="Traffic Light">Traffic Light</option>
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Sidewalk">Sidewalk</option>
            <option value="Drainage">Drainage</option>
            <option value="Road Block">Road Block</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Staff Assigned">Staff Assigned</option>
            <option value="Working">Working</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-10">
          {isLoading ? (
            <LoaderSpinner />
          ) : (
            result?.issues?.map((issue, index) => {
              return <IssueCard key={index} issue={issue}></IssueCard>;
            })
          )}
        </div>


        {/* pagination buttons */}
        <div className="mt-6 flex items-center gap-3 justify-center">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`btn btn-xs bg-primary text-white ${currentPage === 0 && "hidden"}`}
          >
            &lt; Prev
          </button>
          {totalPage > 0 && [...Array(totalPage).keys()].map((i) => {
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`${currentPage === i && "underline text-blue-500 font-semibold"} text-lg cursor-pointer p-1`}
              >
                {i}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`btn btn-xs bg-primary text-white ${currentPage === totalPage - 1 && "hidden"}`}
          >
            Next &gt;
          </button>
        </div>
      </Container>
    </div>
  );
};

export default All_Issues;
