import React from "react";
import Container from "../../Components/Container";
import { SlLocationPin } from "react-icons/sl";
import { Link } from "react-router";
import useRole from "../../Hooks/Role/useRole";
import LoaderSpinner from "../../Components/LoaderSpinner";
import useAuth from "../../Hooks/Auth/useAuth";
import BannerSlider from "./BannerSlider";

const Banner = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();

  return (
    <div className="bg-hero pt-36 md:pt-42 pb-10 ">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between space-y-8 md:space-y-0">
          {/* left side  */}
          <div className="flex flex-col space-y-3.5 flex-1 px-4">
            <span className="text-sm md:text-base flex items-center px-3 py-1 rounded-full text-accent bg-base w-fit">
              <SlLocationPin className="md:text-xl" />
              &nbsp;Serving Metro City & Beyond
            </span>
            <h1 className="text-center md:text-start text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
              Report Issues, <span className="text-accent">Build Better</span>{" "}
              City
            </h1>
            <p className="text-secondary md:w-[90%] text-center md:text-start mt-2">
              Easily report potholes, broken streetlights, water leakage, and
              other infrastructure problems. Track progress in real-time and
              help make your community safer.
            </p>

            <div className="flex items-center md:items-start justify-center md:justify-start gap-4 mt-5">
              {roleLoading ? (
                <LoaderSpinner />
              ) : user && (role === "admin" || role === "citizen") ? (
                <>
                  <Link
                    to="report-issue"
                    className="btn bg-accent border-none shadow-lg text-white"
                  >
                    Report Issue
                  </Link>

                  <Link
                    to="all-issues"
                    className="btn bg-surface-alt border border-gray-500 shadow-lg hover:bg-accent! text-primary"
                  >
                    All Issues
                  </Link>
                </>
              ) : !user ? (
                <>
                  <Link
                    to="all-issues"
                    className="btn bg-surface-alt border border-gray-500 shadow-lg hover:bg-accent! text-primary"
                  >
                    All Issues
                  </Link>

                  <Link
                    to="report-issue"
                    className="btn bg-accent border-none shadow-lg text-white"
                  >
                    Report Issue
                  </Link>
                </>
              ) : user && role === "staff" ? (
                <>
                  <Link
                    to="all-issues"
                    className="btn bg-surface-alt border border-gray-500 shadow-lg hover:bg-accent! text-primary"
                  >
                    All Issues
                  </Link>

                  <Link
                    to="/about"
                    className="btn bg-accent border-none shadow-lg text-white"
                  >
                    About Us
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* image slider here */}
          <BannerSlider></BannerSlider>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
