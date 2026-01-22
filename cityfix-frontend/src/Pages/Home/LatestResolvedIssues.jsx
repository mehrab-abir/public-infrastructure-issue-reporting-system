import React from "react";
import Container from "../../Components/Container";
import { Link } from "react-router";
import IssueCard from "../../Components/IssueCard";
import useAxiosSecured from "../../Hooks/Axios/useAxiosSecured";
import { useQuery } from "@tanstack/react-query";

const LatestResolvedIssues = () => {
  /* const axios = useAxiosSecured();
  const {data: latest_six = [], isLoading} = useQuery({
    queryKey : ["latest-six"],
    queryFn : async ()=>{
      const response = await axios.get("/latest-six");
      return response.data;
    }
  }) */
  return (
    <div className="bg-base py-15">
      <Container>
        <div className="mb-15">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            Recently Resolved Issues
          </h1>
          <p className="mt-6 text-muted text-sm md:text-base lg:text-lg text-center w-11/12 md:w-8/12 mx-auto">
            See how we're making a difference in our community. These issues
            were reported by citizens like you and resolved by our dedicated
            team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 1, 1, 1, 1, 1].map((issue, index) => {
            return <IssueCard key={index} issue={issue}></IssueCard>;
          })}
        </div>
        <div className="flex items-center justify-center mt-10">
            <Link to='all-issues' className="btn bg-primary text-white">View All Issues</Link>
        </div>
      </Container>
    </div>
  );
};

export default LatestResolvedIssues;
