import React from 'react';
import useAuth from '../Auth/useAuth';
import useAxiosBasic from '../Axios/useAxiosBasic';
import { useQuery } from '@tanstack/react-query'
import LoaderSpinner from '../../Components/LoaderSpinner';

const useRole = () => {
    const {user, loading} = useAuth();
    const axios = useAxiosBasic();

    const {data : role, isLoading} = useQuery({
        queryKey : ["user-role",user?.email],
        queryFn : async () =>{
            const response = await axios.get(`/user/${user?.email}/role`);
            return response.data.role;
        }
    })

    if(loading){
        return <LoaderSpinner></LoaderSpinner>
    }
    return {role,isLoading};
};

export default useRole;