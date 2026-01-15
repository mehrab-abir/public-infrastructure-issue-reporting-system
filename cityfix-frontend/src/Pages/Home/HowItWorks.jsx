import React from "react";
import Container from "../../Components/Container";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaUserCheck } from "react-icons/fa6";
import { VscTools } from "react-icons/vsc";
import { CiCircleCheck } from "react-icons/ci";

const HowItWorks = () => {
  return (
    <div className="bg-base py-20">
      <div className="mb-12">
        <p className="bg-primary-soft text-accent mb-4 text-center w-fit mx-auto px-3 rounded-full">
          How It Works?
        </p>
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Simple 4-Step Process
        </h1>
        <p className="text-muted text-sm text-center md:text-lg w-11/12 md:w-[40%] mx-auto mt-4">
          From reporting to resolution, we've made the entire process
          transparent and efficient.
        </p>
      </div>

      <Container>
        <ul className="hidden md:block timeline timeline-vertical">
          <li>
            <div className="timeline-start timeline-box relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
              {/* Right icon */}
              <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-500 text-white">
                <HiOutlineDocumentReport className="text-3xl" />
              </div>

              {/* Right-aligned content */}
              <div className="ml-auto max-w-md text-right">
                <p className="text-sm font-semibold text-accent mr-15">
                  Step 01
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-primary mr-15">
                  Report Issue
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Submit a report with issue details, photos, and exact location
                  using our easy-to-use form.
                </p>
              </div>
            </div>
            <div className="timeline-middle">
              <h3 className="text-lg font-semibold">Step-1</h3>
            </div>
            <hr className="bg-primary-soft" />
          </li>

          <li>
            <div className="timeline-end timeline-box relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
              {/* Left icon */}
              <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-status-pending text-white">
                <FaUserCheck className="text-3xl" />
              </div>

              {/* Left-aligned content */}
              <div className="mr-auto max-w-md text-left">
                <p className="text-sm font-semibold text-accent ml-15">
                  Step 02
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-primary ml-15">
                  Admin Reviews
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Our admin team reviews your submission and assigns it to the
                  appropriate staff member.
                </p>
              </div>
            </div>

            <div className="timeline-middle">
              <h3 className="text-lg font-semibold">Step-2</h3>
            </div>
            <hr className="bg-primary-soft" />
          </li>
          <li>
            <div className="timeline-start timeline-box relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
              {/* Right icon */}
              <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-status-in-progress text-white">
                <VscTools className="text-3xl" />
              </div>

              {/* Right-aligned content */}
              <div className="ml-auto max-w-md text-right">
                <p className="text-sm font-semibold text-accent mr-15">
                  Step 03
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-primary mr-15">
                  Work In Progress
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Staff verifies the issue, starts the work, and provides
                  regular progress updates.
                </p>
              </div>
            </div>
            <div className="timeline-middle">
              <h3 className="text-lg font-semibold">Step-3</h3>
            </div>
            <hr className="bg-primary-soft" />
          </li>
          <li>
            <div className="timeline-end timeline-box relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
              {/* Right icon */}
              <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-status-resolved text-white">
                <CiCircleCheck className="text-3xl" />
              </div>

              {/* Left-aligned content */}
              <div className="mr-auto max-w-md text-left">
                <p className="text-sm font-semibold text-accent ml-15">
                  Step 04
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-primary ml-15">
                  Issue Resolved
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Once fixed, the issue is marked as resolved and you receive a
                  confirmation notification.
                </p>
              </div>
            </div>
            <div className="timeline-middle">
              <h3 className="text-lg font-semibold">Step-4</h3>
            </div>
            <hr className="bg-primary-soft" />
          </li>
        </ul>
      </Container>

      {/* for small screen */}
      <Container>
        <div className="space-y-2.5 md:hidden">
          <div className="relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
            {/* Right icon */}
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500 text-white">
              <HiOutlineDocumentReport className="text-3xl" />
            </div>

            {/* Right-aligned content */}
            <div className="max-w-md text-right">
              <p className="text-sm font-semibold text-accent mr-12">Step 01</p>

              <h3 className="text-xl font-semibold tracking-tight text-primary mr-12">
                Report Issue
              </h3>

              <p className="mt-4 text-base leading-7 text-muted">
                Submit a report with issue details, photos, and exact location
                using our easy-to-use form.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl bg-surface px-8 py-7 border  border-blue-500">
            {/* Left icon */}
            <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl bg-status-pending text-white">
              <FaUserCheck className="text-2xl" />
            </div>

            {/* Left-aligned content */}
            <div className="max-w-md text-left">
              <p className="text-sm font-semibold text-accent ml-12">Step 02</p>

              <h3 className="text-xl font-semibold tracking-tight text-primary ml-12">
                Admin Reviews
              </h3>

              <p className="mt-4 text-base leading-7 text-muted">
                Our admin team reviews your submission and assigns it to the
                appropriate staff member.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
            {/* Right icon */}
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl bg-status-in-progress text-white">
              <VscTools className="text-3xl" />
            </div>

            {/* Right-aligned content */}
            <div className="max-w-md text-right">
              <p className="text-sm font-semibold text-accent mr-12">Step 03</p>

              <h3 className="text-xl font-semibold tracking-tight text-primary mr-12">
                Work In Progress
              </h3>

              <p className="mt-4 text-base leading-7 text-muted">
                Staff verifies the issue, starts the work, and provides regular
                progress updates.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl bg-surface px-8 py-7 border border-blue-500">
            {/* Right icon */}
            <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl bg-status-resolved text-white">
              <CiCircleCheck className="text-2xl" />
            </div>

            {/* Left-aligned content */}
            <div className="max-w-md text-left">
              <p className="text-sm font-semibold text-accent ml-12">Step 04</p>

              <h3 className="text-xl font-semibold tracking-tight text-primary ml-12">
                Issue Resolved
              </h3>

              <p className="mt-4 text-base leading-7 text-muted">
                Once fixed, the issue is marked as resolved and you receive a
                confirmation notification.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HowItWorks;
