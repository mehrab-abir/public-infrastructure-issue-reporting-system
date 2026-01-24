import React from 'react';
import useAxiosSecured from '../../../../Hooks/Axios/useAxiosSecured';
import { useQuery } from '@tanstack/react-query';
import LoaderSpinner from '../../../../Components/LoaderSpinner';

const LatestCitizens = () => {
    const axios = useAxiosSecured();
    const {data : citizens, isLoading} = useQuery({
        queryKey : ["latest-citizens"],
        queryFn : async ()=>{
            const response = await axios.get('/users?role=citizen&recent=4');
            return response.data;
        }
    })
    return (
      <div>
        <h1 className="text-xl md:text-2xl font-bold">
          Latest Registered Citizens
        </h1>

        <div
          className={`overflow-x-auto bg-surface rounded-lg w-full`}
        >
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Photo</th>
                <th>Email</th>
                <th>Premium</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="col-span-6">
                    <LoaderSpinner></LoaderSpinner>
                  </td>
                </tr>
              ) : (
                citizens.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user.displayName}</td>
                      <td>
                        <img
                          src={user.photoURL}
                          className="w-10 md:w-14 h-10 md:h-14 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                          alt=""
                        />
                      </td>
                      <td>{user.email}</td>
                      <td>{user.isPremium === "yes" ? "Yes" : "No"}</td>
                      <td>{user.role.toUpperCase()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default LatestCitizens;