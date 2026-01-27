import React from "react";
import { useEffect } from "react";
import useAxiosSecured from "../Hooks/Axios/useAxiosSecured";
import { useState } from "react";
import { useSearchParams } from "react-router";
import Container from "../Components/Container";
import confetti from "canvas-confetti";

const SubscriptionPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  const axios = useAxiosSecured();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axios
        .patch(`/subscription/payment-success?session_id=${sessionId}`)
        .then((response) => {
          setPaymentInfo({
            transactionId: response.data.transactionId,
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
    <div className="bg-base py-36">
      <title>Payment Success</title>
      <Container>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="bg-surface">
            <title>Payment Successful</title>
            <p className="text-xl text-center font-semibold py-5">Thank you.</p>
            <h1 className="text-2xl font-bold text-green-500 text-center my-5">
              Payment Successful!
            </h1>

            <div className="my-5 border-gray-300 rounded-md p-4 flex flex-col items-center space-y-2">
              <h1 className="text-3xl font-bold text-accent">
                Premium Subscription Completed!
              </h1>
              <p>
                <span className="font-bold">Transaction ID: </span>
                {paymentInfo?.transactionId}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SubscriptionPaymentSuccess;
