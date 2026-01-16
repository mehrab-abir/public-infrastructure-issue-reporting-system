import React from "react";
import Container from "../Components/Container";
import { useForm } from "react-hook-form";
import { useState } from "react";

const ReportIssue = () => {
  const { register, handleSubmit, reset } = useForm();
  const [category, setCategory] = useState("Select Category");

  return (
    <div className="bg-base pt-36 pb-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Report an Issue
          </h1>
          <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
            Help Building Better City
          </p>
        </div>

        <div className="bg-surface drop-shadow-md rounded-xl p-8 w-11/12 md:w-9/12 lg:w-7/12 mx-auto">
          <h3 className="text-xl font-bold">Issue Details</h3>
          <p className="text-muted">
            Provide detailed information about the infrastructure issue
          </p>

          <form className="space-y-3 mt-5">
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Issue Title</label>
              <input
                type="text"
                {...register("issueTitle")}
                className="input w-full outline-none rounded-lg"
                placeholder="e.g. Broken street light on Bay St."
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Select Category</label>
              <select
                className="select focus:outline-2 focus:outline-blue-600 cursor-pointer w-full mt-2 md:mt-0 rounded-lg"
                {...register("category")}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Select Category" disabled>
                  Select Category
                </option>
                <option value="Street Light">Street Light</option>
                <option value="Pothole">Pothole</option>
                <option value="Garbage">Garbage</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Footpath">Footpath</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Description</label>
              <textarea
                type="text"
                {...register("description")}
                className="textarea w-full outline-none rounded-lg"
                placeholder="Provide a detailed description of the issue..."
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Location</label>
              <input
                type="text"
                {...register("location")}
                className="input w-full outline-none rounded-lg"
                placeholder="e.g. 1001 Bay St., Downtown"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Photo</label>
              <input
                type="file"
                {...register("issuePhoto")}
                className="file-input w-full outline-none rounded-lg"
                placeholder="e.g. 1001 Bay St., Downtown"
                required
              />
              <span className="text-xs text-muted">Add a photo to help illustrate the issue</span>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={()=>reset()} className="btn bg-surface-alt shadow-md w-1/2 cursor-pointer border-none rounded-lg">Cancel</button>
                <button className="btn w-1/2 bg-primary cursor-pointer border-none text-white rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ReportIssue;
