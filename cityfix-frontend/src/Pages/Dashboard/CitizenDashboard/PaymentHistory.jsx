import React from "react";
import DashboardContainer from "../DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import useAuth from "../../../Hooks/Auth/useAuth";
import { Link } from "react-router";
import LoaderSpinner from "../../../Components/LoaderSpinner";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axios = useAxiosSecured();

  //issue boost payments
  const { data: myPayments = [], isLoading } = useQuery({
    queryKey: ["my-payment", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/citizen/payment-history/${user?.email}`,
      );
      return response.data;
    },
  });

  //subscription payment
  const { data: subscription, isLoading: subscriptionPaymentLoading } =
    useQuery({
      queryKey: ["subscribe-payment", user?.emasubscription],
      queryFn: async () => {
        const response = await axios.get(
          `/citizen/subscription-payment/${user?.email}`,
        );
        return response.data;
      },
    });

  return (
    <DashboardContainer>
      <title>Payment History</title>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Payment History</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            All Your Payment History Here
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${myPayments.length < 4 && "h-[50vh]"}`}
        >
          {myPayments.length === 0 ? (
            <div className="mt-10">
              <p className="text-muted text-center">
                -You do not have any payment history yet. Payment history will
                appear here after you make any payment-
              </p>
            </div>
          ) : (
            <table className="table table-sm md:table-md">
              {/* head */}
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Purpose</th>
                  <th>Amount($)</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="col-span-6">
                      <div>
                        <LoaderSpinner></LoaderSpinner>
                      </div>
                    </td>
                  </tr>
                ) : (
                  myPayments.map((payment) => {
                    return (
                      <tr key={payment._id}>
                        <td>
                          <Link
                            to={`/issue-details/${payment.issueId}`}
                            className="font-semibold hover:underline"
                          >
                            {payment.issueTitle}
                          </Link>
                        </td>
                        <td>{payment.paymentPurpose}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.transactionId}</td>
                        <td>{new Date(payment.paid_at).toDateString()}</td>
                      </tr>
                    );
                  })
                )}
                {subscriptionPaymentLoading ? (
                  <LoaderSpinner />
                ) : subscription ? (
                  <tr>
                    <td className="font-semibold">Upgrade To Premium</td>
                    <td>
                      <div className="text-orange-500 font-semibold">
                        {subscription.paymentPurpose}
                      </div>
                    </td>
                    <td>{subscription.amount}</td>
                    <td>{subscription.transactionId}</td>
                    <td>{new Date(subscription.paid_at).toDateString()}</td>
                  </tr>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

export default PaymentHistory;
