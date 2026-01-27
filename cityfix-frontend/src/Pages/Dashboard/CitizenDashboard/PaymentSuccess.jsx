import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecured from "../../../Hooks/Axios/useAxiosSecured";
import { useEffect } from "react";
import DashboardContainer from "../DashboardContainer";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  const axios = useAxiosSecured();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axios
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((response) => {
          // console.log(response.data);
          setPaymentInfo({
            transactionId: response.data.transactionId,
            issueTitle: response.data.issueTitle,
          });
        });

      confetti({
        particleCount: 200,
        spread: 80,
        colors: ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b"],
      });
    }
  }, [sessionId, axios]);

  return (
    <DashboardContainer>
      <title>Payment Success</title>
      <div className="bg-surface">
        <title>Payment Successful</title>
        <p className="text-xl text-center font-semibold py-5">Thank you.</p>
        <h1 className="text-2xl font-bold text-green-500 text-center my-5">
          Payment Successful!
        </h1>

        <div className="my-5 border-gray-300 rounded-md p-4 flex flex-col items-center space-y-2">
          <p>
            <span className="font-bold">Issue Title: </span>
            {paymentInfo?.issueTitle}
          </p>
          <p>
            <span className="font-bold">Transaction ID: </span>
            {paymentInfo?.transactionId}
          </p>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default PaymentSuccess;
