import React, { useState } from "react";
import Container from "../Components/Container";
import { IoIosSearch, IoMdEye } from "react-icons/io";
import sampleImg from "../assets/pothole.jfif";
import { SlLocationPin } from "react-icons/sl";
import { IoArrowUp } from "react-icons/io5";

const All_Issues = () => {
  const [categories, setCategories] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  return (
    <div className="bg-surface-alt pt-36 pb-24">
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

        <p className="text-sm text-muted my-4">Showing 10 of 10 Issues</p>

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
          {[...Array(10)].map((item, index) => {
            return (
              <div key={index} className="shadow-md rounded-xl overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={sampleImg}
                    alt=""
                    className="object-cover hover:scale-105 transition-all duration-300 w-full h-52"
                  />
                </div>

                <div className="bg-surface p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-sm md:text-base">
                      Pothole(category)
                    </span>
                    <span className="bg-green-500 text-white px-2 rounded-xl text-sm md:text-base">
                      Resolved
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-semibold">
                    Large Pothole On Bloor St.
                  </h2>
                  <p className="flex items-center gap-1 text-muted text-sm md:text-base">
                    <SlLocationPin className="" />
                    324 Bloor St. W, Toronto
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      className="btn btn-sm flex items-center gap-1 bg-surface-alt text-accent border border-blue-500 rounded-lg cursor-pointer tooltip"
                      data-tip="upvote"
                    >
                      <IoArrowUp className="text-lg" />
                      <span>25</span>
                    </button>
                    <button className="btn btn-sm lg:btn-md hover:bg-primary-hover hover:text-white! text-sm md:text-base border-base">
                      <IoMdEye className="text-xl" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default All_Issues;
