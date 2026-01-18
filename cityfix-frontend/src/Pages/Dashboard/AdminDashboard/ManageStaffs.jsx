import React from "react";
import DashboardContainer from "../DashboardContainer";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router";

const ManageStaffs = () => {
  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">All Staffs</h1>
          <p className="text-muted text-sm md:text-lg mt-2">
            Manage All Registered Staffs
          </p>
        </div>
        <div className="my-5 md:my-0">
          <Link
            to="/dashboard/add-new-staff"
            className="text-white btn btn-sm md:btn-md bg-primary"
          >
            <FiPlus className="text-xl" />
            Add New Staff
          </Link>
        </div>
      </div>
      <p>Showing Staffs: {0}</p>
    </DashboardContainer>
  );
};

export default ManageStaffs;
