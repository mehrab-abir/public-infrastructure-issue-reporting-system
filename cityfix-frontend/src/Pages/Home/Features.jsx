import React from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import Container from "../../Components/Container";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineWatchLater } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

const Features = () => {
  return (
    <div className="bg-surface-alt py-20">
      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Platform Features
        </h1>
        <p className="text-muted text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
          Our platform provides all the tools you need to effectively report
          infrastructure issues and track their resolution in real-time.
        </p>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <HiOutlineDocumentReport className="text-2xl text-accent" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Easy Reporting
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Submit issues with photos and location in seconds
            </p>
          </div>

          <div className="p-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <IoNotificationsOutline className="text-2xl text-green-500" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Real Time Updates
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Get notified about progress on your reported issues
            </p>
          </div>

          <div className="p-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <MdOutlineWatchLater className="text-2xl text-red-500" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Priority Tracking
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Boost important issues to ensure they get addressed faster by the
              team.
            </p>
          </div>

          <div className="p-6 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <TbBrandGoogleAnalytics className="text-2xl text-purple-500" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Analytics Dashboard
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Track your contribution with detailed statistics and progress
              reports.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Features;
