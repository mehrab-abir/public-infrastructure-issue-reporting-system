import React from 'react';
import { CiClock2 } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { BsFillPeopleFill } from "react-icons/bs";
import Container from '../../Components/Container';
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdTrendingUp } from "react-icons/io";

const Stats = () => {
    return (
      <div className="bg-base py-10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 rounded-md">
            <div className="flex flex-col items-center space-y-2 w-full py-8 shadow-md md:shadow-none bg-surface rounded-lg md:rounded-none">
              <span className="bg-surface-alt p-3 rounded-xl">
                <CiCircleCheck className="text-2xl text-accent font-semibold" />
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                2,165
              </h1>
              <span className="text-muted">Issues Resolved</span>
              <span className="text-green-500">+12% this month</span>
            </div>

            <div className="flex flex-col items-center space-y-2 w-full py-8 shadow-md md:shadow-none bg-surface rounded-lg md:rounded-none">
              <span className="bg-surface-alt p-3 rounded-xl">
                <BsFillPeopleFill className="text-2xl text-accent font-semibold" />
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                15,000+
              </h1>
              <span className="text-muted">Registered Citizens</span>
              <span className="text-green-500">+8% this month</span>
            </div>

            <div className=" flex flex-col items-center space-y-2 w-full py-8 shadow-md md:shadow-none bg-surface rounded-lg md:rounded-none">
              <span className="bg-surface-alt p-3 rounded-xl">
                <CiClock2 className="text-2xl text-accent font-semibold" />
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                1.5 Days
              </h1>
              <span className="text-muted">Average Response Time</span>
              <span className="text-green-500">10% faster</span>
            </div>

            <div className="flex flex-col items-center space-y-2 w-full py-8 shadow-md md:shadow-none bg-surface rounded-lg md:rounded-none">
              <span className="bg-surface-alt p-3 rounded-xl">
                <IoMdTrendingUp className="text-2xl font-semibold text-accent" />
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                94%
              </h1>
              <span className="text-muted">Satisfaction Rate</span>
              <span className="text-green-500">+3% this month</span>
            </div>
          </div>
        </Container>
      </div>
    );
};

export default Stats;