import React from 'react'
import './Register.css'
import { useState } from 'react';
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {auth,storage,db} from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Register = () => {
  const [myuserName,setUserName]=useState("");
  const [myemail,setEmail]=useState("");
  const [mypassword,setPassword]=useState("");
  const [myfile,setFile]=useState("");
  const [myerror,setError]=useState(false);
  const navigate=useNavigate();
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    const displayName=myuserName;
    const email=myemail;
    const password=mypassword;
    const file=myfile;
    console.log(displayName,email,password,file);

    try{
      const res=await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);

        await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {  

        await updateProfile(res.user, {
          displayName: displayName,
          photoURL: downloadURL,
        });

        await setDoc(doc(db, "users", res.user.uid),{
          uid:res.user.uid,
          displayName,
          email,
          photoURL:downloadURL,
        });

        await setDoc(doc(db, "userChat", res.user.uid), {});
        navigate('/');
        });

      }
    );  

    } catch (error) {
      console.log(error+"auth error");
      setError(true);
    }
  }

  return (
    <div className='container'>
      <div className='box'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

          <div className='form-group'>
            <label htmlFor='username'>UsernaMe</label>
            <input type='text' name='username' id='username' onChange={(e)=>setUserName(e.target.value)} required/>
          </div>
        
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' id='email' onChange={(e)=>setEmail(e.target.value)} required />
          </div>
        
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' onChange={(e)=>setPassword(e.target.value)} required/>
          </div>

          <div className='form-group'>
            {/* <label htmlFor='file' id='myfilelabel'>
              ProfilePicture
            </label> */}
            <input type='file' name='file' id='files' onChange={(e)=>setFile(e.target.files[0])} required />
          </div>

          <div className='form-group'>       
            <button type='submit' className='reg'>Register</button>
          </div>

          {myerror && <span style={{color:'red',display:'flex',justifyContent:'center',fontWeight:'bold'}}>Something went wrong</span>}

          <Link to='/login' className='user'>Already registered? Click to Login</Link>
          {/* <p className='user'></p> */}

        </form>
      </div>
    </div>
  )
}

export default Register
