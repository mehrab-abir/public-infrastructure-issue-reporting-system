import React from 'react';
import Container from '../../Components/Container';
import { SlLocationPin } from 'react-icons/sl';
import { Link } from 'react-router';
import fin from '../../assets/hero-images/img-1.JPG'
import george from '../../assets/hero-images/img-2.JPG'
import cn from '../../assets/hero-images/img-5.jpeg'

const Banner = () => {
    return (
      <div className="bg-hero py-36 md:pt-56 pb-10 md:pb-56">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between">
            <div className="flex flex-col space-y-3.5 flex-1 px-4">
              <span className="text-sm md:text-base flex items-center px-3 py-1 rounded-full text-accent bg-base w-fit">
                <SlLocationPin className="text-lg md:text-xl" />
                &nbsp;Serving Metro City & Beyond
              </span>
              <h1 className="text-center md:text-start text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
                Report Issues, <span className="text-accent">Build Better</span>{" "}
                City
              </h1>
              <p className="text-secondary md:w-[90%] text-center md:text-start mt-2">
                Easily report potholes, broken streetlights, water leakage, and
                other infrastructure problems. Track progress in real-time and
                help make your community safer.
              </p>

              <div className="flex items-center md:items-start justify-center md:justify-start gap-4 mt-5">
                <Link to="report-issue" className="btn bg-accent border-none shadow-lg text-primary">
                  Report Issue
                </Link>
                <Link to="all-issues" className="btn bg-surface-alt border border-gray-500 shadow-lg hover:bg-accent! text-primary">
                  All Issues
                </Link>
              </div>
            </div>
            <div className="hidden flex-1 md:relative md:flex mt-10 lg:mt-0">
              <div
                className="p-1 bg-surface-alt w-1/3 md:absolute 
             md:-top-50 md:right-20 lg:-top-50 lg:right-20 z-15 rounded-xl"
              >
                <img src={george} alt="" className="object-cover rounded-xl" />
              </div>
              <div className="p-1 bg-surface w-1/3 md:absolute md:left-30 md:-top-20 lg:left-40 lg:-top-20 z-20 rounded-xl">
                <img src={cn} alt="" className="object-cover rounded-xl" />
              </div>
              <div className="p-1 bg-surface w-1/3 md:absolute md:-top-15 md:right-0 lg:top-0 lg:right-0 z-10 rounded-xl">
                <img src={fin} alt="" className="object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
};

export default Banner;