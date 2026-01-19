import React from 'react';
import useAuth from '../Auth/useAuth';
import useAxiosBasic from '../Axios/useAxiosBasic';
import { useQuery } from '@tanstack/react-query'

const useRole = () => {
    const {user} = useAuth();
    const axios = useAxiosBasic();

    const { data: role, isLoading: roleLoading } = useQuery({
      queryKey: ["user-role", user?.email],
      queryFn: async () => {
        const response = await axios.get(`/user/${user?.email}/role`);
        return response.data.role;
      },
    });

    return {role,roleLoading};
};

export default useRole;