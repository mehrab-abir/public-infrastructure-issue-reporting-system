import React from 'react';
import { useEffect } from 'react';
import useAuth from '../Auth/useAuth';
import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecured = () => {
    const {user, loading, signOutUser} = useAuth();
    const isLoggingOutRef = useRef(false);
    const navigate = useNavigate();

    useEffect(()=>{
        //request interceptor
        const reqInterceptor = axiosInstance.interceptors.request.use(
            async (config)=>{
                if(loading || !user){
                    return config;
                }

                const token = await user.getIdToken();

                config.headers = config.headers ?? {};
                config.headers.authorization = `Bearer ${token}`;

                return config;

            },(error)=> Promise.reject(error)
        );

        //response interceptor
        const responseInterceptor = axiosInstance.interceptors.response.use((response)=>{
            return response;
        },async (error)=>{
            const statusCode = error?.response?.status;

            if(!user || loading) return Promise.reject(error);

            if((statusCode === 401 || statusCode === 403) && !isLoggingOutRef.current){
                isLoggingOutRef.current = true;

                //leave private route first
                navigate('/',{replace:true});
                try{
                    await signOutUser();
                }
                finally{
                    setTimeout(()=>{
                        isLoggingOutRef.current = false; //for future sign out
                    },1000);
                }
            }
            return Promise.reject(error);
        });

        return (()=>{
            axiosInstance.interceptors.request.eject(reqInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        })

    },[user, loading, navigate, signOutUser])


    return axiosInstance;
};

export default useAxiosSecured;