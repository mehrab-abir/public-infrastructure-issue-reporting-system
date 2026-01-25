import React from 'react';
import useAuth from '../../../../Hooks/Auth/useAuth';
import useAxiosSecured from '../../../../Hooks/Axios/useAxiosSecured';
import { useQuery } from '@tanstack/react-query';
import LoaderSpinner from '../../../../Components/LoaderSpinner';
import { Link } from 'react-router';

const LatestPayments = () => {
    const {user} = useAuth();
    const axios = useAxiosSecured();

    const {data : payments = [], isLoading} = useQuery({
        queryKey : ["recent-payments", user?.email],
        queryFn : async ()=>{
            const response = await axios.get(`/citizen/payment-history/${user?.email}?recent=2`);
            return response.data;
        }
    })

    //subscription payment
      const { data:subscription, isLoading: subscriptionPaymentLoading } = useQuery({
        queryKey: ["subscribe-payment", user?.emasubscription],
        queryFn: async () => {
          const response = await axios.get(
            `/citizen/subscription-payment/${user?.email}`,
          );
          console.log(response.data);
          return response.data;
        },
      });
    


    return (
      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold">Recent Payment(s)</h1>
        <div className="">
          <div className={`overflow-x-auto bg-surface rounded-lg w-full`}>
            {payments.length === 0 ? (
              <div className="mt-10">
                <p className="text-muted text-center">
                  -You have not made any payment recently-
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
                        <LoaderSpinner></LoaderSpinner>
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => {
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
                </tbody>
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
              </table>
            )}
          </div>
        </div>
      </div>
    );
};

export default LatestPayments;