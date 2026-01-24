import React from "react";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";
import LoaderSpinner from "../../../../Components/LoaderSpinner";

const IssuesByMonthsBarChart = () => {
  const axios = useAxiosSecured();
  const { data, isLoading } = useQuery({
    queryKey: ["issues-by-month"],
    queryFn: async () => {
      const response = await axios.get("/group-issue-by-months");
      console.log(response.data);
      return response.data;
    },
  });

  const chartData = data.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    count: item.count,
  }));
  return (
    <>
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <BarChart
          style={{
            width: "100%",
            maxWidth: "100%",
            maxHeight: "500px",
            aspectRatio: 1.618,
          }}
          responsive
          data={chartData}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Legend />
          <Tooltip />
          <Bar dataKey="count" name="Issue count per month" fill="#2563EB" />
        </BarChart>
      )}
    </>
  );
};

export default IssuesByMonthsBarChart;
