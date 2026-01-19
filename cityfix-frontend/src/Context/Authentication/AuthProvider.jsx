import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase.config';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = ()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider);
    }

    const registerUser = (email, password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email,password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email, password);
    }

    const signOutUser = ()=>{
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (info)=>{
        setLoading(true);
        return updateProfile(auth.currentUser, info);
    }

    //send link to reset password, when user forgets password
    const forgetPassword = (email)=>{
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    }

    //update password
    const resetPassword = (newPassword)=>{
        setLoading(true);
        return updatePassword(user, newPassword);
    }

    const verifyEmail = ()=>{
        setLoading(true);
        return sendEmailVerification(auth.currentUser);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        })

        return (()=>{
            unsubscribe();
        })
    },[])
    
    const authInfo = {
        user,
        setUser,
        googleSignIn,
        registerUser,
        signInUser,
        signOutUser,
        updateUserProfile,
        forgetPassword,
        resetPassword,
        verifyEmail,
        loading,
        setLoading
    }

    return <AuthContext value={authInfo}>{children}</AuthContext>
};

export default AuthProvider;