import React from "react";
import DashboardContainer from "../DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import LoaderSpinner from "../../../Components/LoaderSpinner";
import { Link } from "react-router";

const AllPayments = () => {
  const axios = useAxiosSecured();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await axios.get("/admin/all-payments");
      return response.data;
    },
  });

  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Payments</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            All Payments Made By Citizens
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full ${payments.length < 4 && "h-[50vh]"}`}
        >
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Issue</th>
                <th>Paid By</th>
                <th>Purpose</th>
                <th>Amount($)</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="col-span-6">
                    <LoaderSpinner></LoaderSpinner>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  return (
                    <tr key={payment._id}>
                      <td>
                        <Link to={`/issue-details/${payment.issueId}`} className="font-semibold hover:underline">
                          {payment.issueTitle}
                        </Link>
                      </td>
                      <td>{payment.reporterEmail}</td>
                      <td>{payment.paymentPurpose}</td>
                      <td>{payment.amount}</td>
                      <td>{new Date(payment.paid_at).toDateString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default AllPayments;
