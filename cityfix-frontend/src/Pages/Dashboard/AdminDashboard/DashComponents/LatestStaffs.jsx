import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecured from '../../../../Hooks/Axios/useAxiosSecured';
import LoaderSpinner from '../../../../Components/LoaderSpinner';

const LatestStaffs = () => {
    const axios = useAxiosSecured();

    const {data : staffs = [], isLoading} = useQuery({
        queryKey : ['latest-staffs'],
        queryFn : async ()=>{
            const response = await axios.get('/all-staffs?recent=4');
            return response.data;
        }
    })


    return (
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Latest Registered Staffs</h1>
        <div className={`overflow-x-auto bg-surface rounded-lg w-full`}>
          <table className="table table-sm md:table-md">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Photo</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="col-span-6">
                    <LoaderSpinner></LoaderSpinner>
                  </td>
                </tr>
              ) : staffs.length === 0 ? (
                <tr>
                  <td className="text-muted text-center">No Staff Found</td>
                </tr>
              ) : (
                staffs.map((staff) => {
                  return (
                    <tr key={staff._id}>
                      <td className="font-semibold">{staff.displayName}</td>
                      <td>
                        <img
                          src={staff.photoURL}
                          className="w-10 h-10 md:w-14 md:h-12 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                          alt=""
                        />
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
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

export default LatestStaffs;