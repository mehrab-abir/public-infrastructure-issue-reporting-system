import React from "react";
import Container from "./Container";
import logo from "../assets/logo.png";
import { CiFacebook } from "react-icons/ci";
import { RiTwitterXFill } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";
import { PiInstagramLogo } from "react-icons/pi";
import { Link } from "react-router";
import { SlLocationPin } from "react-icons/sl";
import { PiPhoneCallThin } from "react-icons/pi";
import { CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="bg-surface pt-10 pb-5 border-t border-base">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center md:items-start justify-between border-b border-base pb-10">
          <div className="flex-1 text-center md:text-start flex flex-col items-center md:items-start justify-center">
            <Link to="/" className="flex items-center w-12 mr-20 md:mr-0">
              <img src={logo} alt="" />
              <h2 className="text-2xl font-semibold">CityFix</h2>
            </Link>
            <p className="text-sm text-muted mt-3 w-[80%] md:w-[90%]">
              Empowering citizens to report and track public infrastructure
              issues for a better community.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <Link to="https://github.com/mehrab-abir" target="blank">
                <FiGithub className="text-2xl text-muted" />
              </Link>
              <Link>
                <RiTwitterXFill className="text-2xl text-muted" />
              </Link>
              <Link>
                <PiInstagramLogo className="text-2xl text-muted" />
              </Link>
            </div>
          </div>
          <div className="flex-1 mt-10 md:mt-0 text-center md:text-start">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="mt-6 flex flex-col space-y-3 text-sm text-muted">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/all-issues" className="hover:underline">
                All Issues
              </Link>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex-1 mt-10 lg:mt-0 text-center md:text-start">
            <h4 className="font-semibold">Services</h4>
            <div className="mt-6 flex flex-col space-y-3 text-sm text-muted">
              <Link to="/report-issue" className="hover:underline">
                Report Issue
              </Link>
              <Link to="/track-status" className="hover:underline">
                Track Status
              </Link>
              <Link to="/be-premium-citizen" className="hover:underline">
                Premium Plan
              </Link>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </div>
          </div>
          <div className="flex-1 mt-10 lg:mt-0 mx-auto md:mx-0">
            <h4 className="font-semibold text-center md:text-start">
              Contact Us
            </h4>
            <div className="mt-6 flex flex-col space-y-4 text-sm text-muted">
              <p className="flex items-center gap-2">
                <SlLocationPin className="text-2xl" /> 123 ABC St, City Hall,
                Toronto, ON
              </p>
              <p className="flex items-center gap-2 text-center md:text-start">
                <PiPhoneCallThin className="text-2xl" />
                +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2 text-center md:text-start">
                <CiMail className="text-2xl" /> support@cityfix.gov
              </p>
            </div>
          </div>
        </div>{" "}
        {/* parent div */}
        {/* footer of the Footer */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-5 md:px-10">
          <div className="text-center md:text-start mt-5 md:mt-0">
            <p className="text-muted text-sm">
              &copy; {new Date().getFullYear()} CityFix. All Rights Reserved.
            </p>
            <Link
              to="https://github.com/mehrab-abir"
              target="blank"
              className="text-cyan-700 hover:underline"
            >
              Mehrab Jalil Abir
            </Link>
          </div>

          <div className="flex items-center gap-6 text-muted text-sm mt-4 md:mt-0">
            <Link>Privacy Policy</Link>
            <Link>Terms of Service</Link>
            <Link>Accessibility</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
