import React, { useRef } from "react";
import Container from "../../Components/Container";
import { Link, useNavigate } from "react-router";
import { LuCrown } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import useAuth from "../../Hooks/Auth/useAuth";
import useRole from "../../Hooks/Role/useRole";
import LoaderSpinner from "../../Components/LoaderSpinner";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../../Hooks/Axios/useAxiosSecured";
import Swal from "sweetalert2";

const GetStartedSection = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();
  const axios = useAxiosSecured();
  const navigate = useNavigate();

  const subscriptionModalRef = useRef();

  const {
    data: thisUser,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["this-user", user?.uid],
    queryFn: async () => {
      const response = await axios.get(`/users/${user?.uid}`);
      return response.data;
    },
  });

  const openPaymentModal = () => {
    if (!user) {
      navigate("/auth/signin", { replace: true });
      return;
    }
    subscriptionModalRef.current.showModal();
  };

  const handleSubscriptionPayment = async () => {
    try {
      const paymentInfo = {
        userEmail: user?.email,
      };

      const response = await axios.post(
        "/subscribe/create-checkout-session",
        paymentInfo,
      );
      window.location.assign(response.data.url);
    } catch {
      // console.log(error);
      Swal.fire({
        icon: "error",
        title: "Ooop...",
        text: "Something went wrong!",
      });
    } finally {
      subscriptionModalRef.current.close();
      refetchUser();
    }
  };

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
              {roleLoading ? (
                <LoaderSpinner />
              ) : user && (role === "admin" || role === "citizen") ? (
                <Link
                  to="report-issue"
                  className="btn bg-surface shadow-none border-none hover:bg-accent! hover:text-white!"
                >
                  Report an Issue
                </Link>
              ) : (
                <>
                  {role !== "staff" && (
                    <Link
                      to="/auth/register"
                      className="btn border-white bg-primary text-white shadow-none"
                    >
                      Register
                    </Link>
                  )}

                  {role === "staff" ? (
                    <Link
                      to="/all-issues"
                      className="btn bg-surface shadow-none border-none hover:bg-accent! hover:text-white!"
                    >
                      All Issues
                    </Link>
                  ) : (
                    <Link
                      to="/report-issue"
                      className="btn bg-surface shadow-none border-none hover:bg-accent! hover:text-white!"
                    >
                      Report an Issue
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            {isLoading ? (
              <LoaderSpinner />
            ) : (
              (!user || (user && thisUser?.isPremium === "no")) ? (
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
                  <button
                    onClick={() => openPaymentModal()}
                    className="bg-accent w-full btn border-none shadow-none text-white mt-3 hover:bg-orange-500! rounded-lg"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )
              :
              <div className="flex-col items-center justify-center hidden md:flex">
                <LuCrown className="text-4xl text-orange-500" />
                <h1 className="text-2xl lg:text-3xl text-white font-bold">Premium User</h1>
              </div>
            )}
          </div>
        </div>

        {/* subscription payment modal */}
        <dialog
          ref={subscriptionModalRef}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Upgrade To Premium</h3>
            <p className="py-4">
              Premium Users Can Report
              <span className="text-orange-500 font-semibold">
                {" "}
                Unlimited Issues
              </span>
            </p>
            <p className="text-lg font-semibold mt-2">Fees : $1000</p>
            <button
              className="mt-3 btn btn-sm text-white border-none bg-primary cursor-pointer"
              onClick={() => handleSubscriptionPayment()}
            >
              Proceed to Payment
            </button>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </Container>
    </div>
  );
};

export default GetStartedSection;
