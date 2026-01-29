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
import { MdOutlinePending } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { TbProgressBolt } from "react-icons/tb";
import { LiaTimesCircle, LiaToolsSolid } from "react-icons/lia";
import { GoIssueClosed } from "react-icons/go";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

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

  // console.log(data);
  return (
    <div className="flex flex-col w-full">
      {isLoading ? (
        "..."
      ) : data.length === 0 ? (
        ""
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {data.map((stat) => {
            return (
              <div
                key={stat._id}
                className="py-3 flex flex-col items-center justify-center bg-surface rounded-xl shadow-md"
              >
                {stat._id === "Pending" ? (
                  <MdOutlinePending className="text-2xl text-yellow-500" />
                ) : stat._id === "Staff Assigned" ? (
                  <GrUserWorker className="text-2xl text-blue-500" />
                ) : stat._id === "In Progress" ? (
                  <TbProgressBolt className="text-2xl text-purple-500" />
                ) : stat._id === "Working" ? (
                  <LiaToolsSolid className="text-2xl text-slate-500" />
                ) : stat._id === "Resolved" ? (
                  <GoIssueClosed className="text-2xl text-emerald-500" />
                ) : stat._id === "Closed" ? (
                  <IoCheckmarkDoneCircleOutline className="text-2xl text-gray-500" />
                ) : (
                  <LiaTimesCircle className="text-2xl mt-2 text-red-500" />
                )}
                <div className="my-2 text-3xl font-bold">{stat.count}</div>
                <div className="text-center text-sm xl:text-lg text-secondary mt-3">
                  {stat._id === "Staff Assigned" ? "Assinged" : stat._id}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isLoading ? (
        ""
      ) : data.length === 0 ? (
        <p className="text-center text-muted my-4">"No Data Available. Analytics will be available once you are assigned at least on task"</p>
        
      ) : (
        <div
          style={{ width: "100%", maxWidth: 500, height: 380 }}
          className="self-center"
        >
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
                formatter={(value) =>
                  value === "Staff Assigned" ? "Assigned" : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default IssuesbyStatus;
