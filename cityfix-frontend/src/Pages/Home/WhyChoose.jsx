import React from "react";
import Container from "../../Components/Container";
import { IoTrendingUpSharp } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { IoIosPeople } from "react-icons/io";

const WhyChoose = () => {
  return (
    <div className="bg-surface-alt py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Why Choose CityFix?
        </h1>
        <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[50%] mx-auto mt-4">
          Making infrastructure management transparent and efficient
        </p>
      </div>

      <Container>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="px-6 py-10 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start md:h-64 w-full">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <IoTrendingUpSharp className="text-2xl text-accent" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Improved Transparency
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Track every step of the resolution process with complete
              visibility
            </p>
          </div>
          <div className="px-6 py-10 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start md:h-64 w-full">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <CiClock2 className="text-2xl text-accent" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Faster Response
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Reduce response time with automated workflows and priority
              management
            </p>
          </div>
          <div className="px-6 py-10 bg-surface shadow-md flex flex-col space-y-3 rounded-lg items-center md:items-start md:h-64 w-full">
            <span className="bg-primary-soft p-2 w-fit rounded-lg">
              <IoIosPeople className="text-2xl text-accent" />
            </span>

            <h3 className="text-xl font-semibold flex items-center my-2">
              Community Driven
            </h3>
            <p className="text-muted text-sm mt-3 text-center md:text-start">
              Upvote important issues to help prioritize what matters most
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WhyChoose;
