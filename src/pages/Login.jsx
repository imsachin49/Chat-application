import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase'
import './Register.css';

const Login = () => {
  const [myemail,setEmail]=useState("");
  const [mypassword,setPassword]=useState("");
  const [myerror,setError]=useState(false);
  const navigate=useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const email=myemail;
    const password=mypassword;

  try{
    await signInWithEmailAndPassword(auth, email, password)
    console.log("login success");
    navigate('/');  
  }catch (error) {
    console.log(error+"auth error");
    setError(true);
    }
  }

  return (
    <div className='container'>
      <div className='box'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
        
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' id='email' required onChange={(e)=>setEmail(e.target.value)}/>
          </div>
        
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' required onChange={(e)=>setPassword(e.target.value)} />
          </div>

          <div className='form-group'>       
            <button type='submit' className='reg'>Login</button>
          </div>

          {myerror && <span style={{color:'red',display:'flex',justifyContent:'center',fontWeight:'bold'}}>Something went wrong</span>}

          <Link className='user' to='/register'>New User? Click to create an account</Link>

        </form>
      </div>
    </div>
  )
}

export default Login
