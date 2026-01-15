import React from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

const useAxiosBasic = () => {
    return axiosInstance;
};

export default useAxiosBasic;