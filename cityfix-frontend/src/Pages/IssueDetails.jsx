import React from "react";
import sampleImg from "../assets/pothole.jfif";
import sampleStaff from "../assets/staffsImg.png";
import sampleReporter from "../assets/defaultAvatar.png";
import { SlLocationPin } from "react-icons/sl";
import Container from "../Components/Container";

const IssueDetails = () => {
  return (
    <div className="bg-base pt-28 pb-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left side  */}
          <div className="col-span-1 md:col-span-2 bg-surface p-4 space-y-6 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="px-2 text-gray-600 bg-surface-alt rounded-xl">
                Category
              </span>
              <span className="px-2 text-white bg-status-resolved rounded-xl">
                Status
              </span>
              <span className="px-2 text-white bg-red-400 rounded-xl">
                Priority
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
              Large Pothole on Oak Avenue
            </h1>

            <img src={sampleImg} className="rounded-xl object-cover" alt="" />

            <div className="">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-muted mt-1">
                A significant pothole has formed on Oak Avenue causing damage to
                vehicles. Immediate attention needed.
              </p>
            </div>

            <div className="bg-surface-alt flex items-center gap-4 px-2 py-3 rounded-xl">
              <SlLocationPin className="text-lg text-accent" />
              <div>
                <h4 className="text-lg font-semibold">Location</h4>
                <p className="text-secondary">123 Bloor St E, Toronto, ON</p>
              </div>
            </div>

            <div className="border border-base rounded-xl flex flex-col sm:flex-row sm:items-center justify-between px-2 py-3">
              <div>
                <h4 className="text-xl font-semibold">Community Support</h4>
                <p className="text-muted">
                  {85} People have upvoted this issue
                </p>
              </div>
              <button className="bg-primary text-white btn btn-sm md:btn-md cursor-pointer mt-4 rounded-xl sm:mt-0">
                Upvote
              </button>
            </div>
          </div>

          {/* right side */}
          <div className="col-span-1 space-y-6">
            <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
              <h2 className="text-xl font-semibold mb-2">Reported By</h2>
              <div className="flex items-center gap-4">
                <img
                  src={sampleReporter}
                  className="w-14 h-14 object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <div>
                  <p className="font-bold">Sarah Smith</p>
                  <p className="text-muted">sarah@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
              <h2 className="text-xl font-semibold mb-2">Assigned Staff</h2>
              <div className="flex flex-col gap-4 mb-2">
                <img
                  src={sampleStaff}
                  className="w-14 h-14 object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <div>
                  <p className="font-bold">Emilia Clark</p>
                  <p className="text-muted">emilia@gmail.com</p>
                </div>
                <p>Phone : +946519856</p>
              </div>
            </div>
            <div className="bg-surface p-6 rounded-xl border border-base shadow-md">
              <h2 className="text-xl font-semibold mb-2">Issue Statistics</h2>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base">Reported At:</span>
                  <span className="text-muted text-sm md:text-base">
                    {new Date().toDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-base">Last Updated:</span>
                  <span className="text-muted text-sm md:text-base">
                    {new Date().toDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* timeline area */}
        <div className="mt-6 bg-surface p-4 border border-base rounded-xl"></div>
      </Container>
    </div>
  );
};

export default IssueDetails;
