import React from "react";
import Container from "../../Components/Container";
import sampleImg from "../../assets/pothole.jfif";
import { SlLocationPin } from "react-icons/sl";
import { IoArrowUp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router";

const LatestResolvedIssues = () => {
  return (
    <div className="bg-base py-15">
      <Container>
        <div className="mb-15">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            Recently Resolved Issues
          </h1>
          <p className="mt-6 text-muted text-sm md:text-base lg:text-lg text-center w-11/12 md:w-8/12 mx-auto">
            See how we're making a difference in our community. These issues
            were reported by citizens like you and resolved by our dedicated
            team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 1, 1, 1, 1, 1].map((issue, index) => {
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
                  <h2 className="text xl md:text-2xl font-semibold">
                    Large Pothole On Bloor St.
                  </h2>
                  <p className="flex items-center gap-1 text-muted text-sm md:text-base">
                    <SlLocationPin className="" />
                    324 Bloor St. W, Toronto
                  </p>
                  <div className="flex items-center justify-between">
                    <button className="btn btn-sm flex items-center gap-1 bg-surface-alt text-accent border border-blue-500 rounded-lg cursor-pointer tooltip" data-tip="upvote">
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
        <div className="flex items-center justify-center mt-10">
            <Link to='all-issues' className="btn bg-primary text-white">View All Issues</Link>
        </div>
      </Container>
    </div>
  );
};

export default LatestResolvedIssues;
