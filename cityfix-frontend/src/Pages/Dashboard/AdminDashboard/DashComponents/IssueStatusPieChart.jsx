import React from "react";
import {
  Legend,
  Tooltip,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import LoaderSpinner from "../../../../Components/LoaderSpinner";

const RADIAN = Math.PI / 180;
const COLORS = [
  "#0369c2",
  "#029d33",
  "#02a083",
  "#d74c4c",
  "#9002c0",
  "#29a59d",
  "#edab05",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

const IssueStatusPieChart = ({ isAnimationActive = true }) => {
  const axios = useAxiosSecured();

  const { data : data = [], isLoading } = useQuery({
    queryKey: ["group-issues"],
    queryFn: async () => {
      const response = await axios.get("/group-issues-by-status");
      return response.data;
    },
  });

  const pieData = data.filter((item) => item._id !== "Rejected");

  return (
    <div
      style={{ width: "100%", maxWidth: 500, height: 380 }}
      className="self-center"
    >
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
              label={renderCustomizedLabel}
              isAnimationActive={isAnimationActive}
            >
              {pieData?.map((entry, index) => (
                <Cell
                  key={`cell-${entry._id ?? index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => [value, props?.payload?._id]}
            />
            <Legend formatter={(value) => value} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IssueStatusPieChart;
