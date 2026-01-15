import React from 'react';
import sampleImg from "../assets/pothole.jfif";
import { SlLocationPin } from "react-icons/sl";
import { IoArrowUp } from "react-icons/io5";
import { IoMdEye } from 'react-icons/io';

const IssueCard = () => {
    return (
      <div className="shadow-md rounded-xl overflow-hidden relative">
        <div className="overflow-hidden">
          <img
            src={sampleImg}
            alt=""
            className="object-cover hover:scale-105 transition-all duration-300 w-full h-52"
          />
          <span className='bg-red-500 text-white rounded-xl px-2 text-sm absolute top-2 right-2'>High Priority</span>
        </div>

        <div className="bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="btn btn-xs bg-surface-alt border-none text-sm drop-shadow-sm">
              Pothole
            </span>
            <span className="bg-green-500 text-white px-2 rounded-xl text-sm">
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
            <button className="btn btn-sm hover:bg-primary-hover hover:text-white! text-sm md:text-base border-base">
              <IoMdEye className="text-xl" />
              View Details
            </button>
          </div>
        </div>
      </div>
    );
};

export default IssueCard;