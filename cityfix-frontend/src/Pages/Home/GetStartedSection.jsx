import React from "react";
import Container from "../../Components/Container";
import { Link } from "react-router";
import { LuCrown } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import useAuth from "../../Hooks/Auth/useAuth";

const GetStartedSection = () => {
  const { user } = useAuth();

  return (
    <div className="bg-linear-to-t from-[#0575e6] to-[#021b79] py-16">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 text-center md:text-start">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Ready to Make a Difference?
            </h1>
            <p className="text-white my-6 md:text-lg">
              Join thousands of citizens who are actively helping to improve our
              city's infrastructure. Report issues, track progress, and see real
              change happen.
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start mt-8">
              {user ? (
                <Link
                  to="report-issue"
                  className="btn bg-surface shadow-none border-none hover:bg-accent! hover:text-white!"
                >
                  Report an Issue
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/register"
                    className="btn border-white bg-primary text-white shadow-none"
                  >
                    Register
                  </Link>
                  <Link
                    to="report-issue"
                    className="btn bg-surface shadow-none border-none hover:bg-accent! hover:text-white!"
                  >
                    Report an Issue
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col space-y-3 bg-primary p-6 sm:w-full lg:w-2/3 lg:justify-self-end rounded-lg mt-10 md:mt-0">
              <div className="flex items-center gap-2">
                <div>
                  <LuCrown className="text-3xl text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Premium Benefits
                  </h4>
                  <p className="text-white">Upgrade for more features</p>
                </div>
              </div>
              <ul className="text-white pl-2 space-y-2 text-sm mt-2">
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Unlimited Issue Subscription
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Priority Support & Faster Response
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Boost Issue Visibility
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Premium Badge On Profile
                </li>
                <li className="flex items-center gap-1">
                  <IoMdCheckmark /> Detailed Analytics Access
                </li>
              </ul>
              <button className="bg-accent w-full btn border-none shadow-none text-white mt-3 hover:bg-orange-500! rounded-lg">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default GetStartedSection;
