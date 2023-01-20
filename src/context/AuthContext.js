import { onAuthStateChanged } from 'firebase/auth';
import {createContext, useEffect, useState} from 'react'
import { auth } from '../firebase';

export const AuthContext=createContext();

export const AuthContextProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState({});
    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
            console.log(user);
        });
        
        return () => {
            unsubscribe();
        };

    },[]);

    return(
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    ) 
}

// If Firebase Authentication has previously authenticated on the page and saved a token to localStorage, 
// then onAuthStateChanged is called with Firebase Authentication's currentUse.
// If Firebase Authentication has not previously authenticated on the page, then onAuthStateChanged is called with null    