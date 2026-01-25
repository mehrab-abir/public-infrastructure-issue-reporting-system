import React from "react";
import useAuth from "../../../../Hooks/Auth/useAuth";
import useAxiosSecured from "../../../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";
import {
  Legend,
  Tooltip,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
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

const IssuesbyStatus = ({ isAnimationActive = true }) => {
  const { user } = useAuth();
  const axios = useAxiosSecured();
  const { data, isLoading } = useQuery({
    queryKey: ["issues-by-status", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/group-issues-by-status?email=${user?.email}`,
      );
      return response.data;
    },
  });
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
              data={data}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
              label={renderCustomizedLabel}
              isAnimationActive={isAnimationActive}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${entry._id ?? index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => [value, props?.payload?._id]}
            />
            <Legend
              formatter={(value) => value === "Staff Assigned" ? "Assigned":value}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IssuesbyStatus;
