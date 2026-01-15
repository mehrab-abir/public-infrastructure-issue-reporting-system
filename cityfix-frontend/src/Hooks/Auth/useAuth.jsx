import React, { use } from 'react';
import { AuthContext } from '../../Context/Authentication/AuthContext';

const useAuth = () => {
    const authInfo = use(AuthContext);

    return authInfo;
};

export default useAuth;