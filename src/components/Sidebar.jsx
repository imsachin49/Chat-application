import React from 'react'
import './Sidebar.css'
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import { getDocs,getDoc } from "firebase/firestore";
import {setDoc} from "firebase/firestore";
// import {updateDoc} from"firebase/firestore";
import {doc} from "firebase/firestore";
import {serverTimestamp} from "firebase/firestore";
import { useEffect } from 'react';
import { onSnapshot } from "firebase/firestore";
import { ChatContext } from '../context/ChatContext';
import { type } from '@testing-library/user-event/dist/type';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const {currentUser}=useContext(AuthContext);
  const navigate=useNavigate();
  const [search,setSearch]=useState("");
  // search="test account"
  const [user,setUser]=useState(null);
  const [err,setErr]=useState(false);

  console.log(search);
  
  const handleSearch=async()=>{
      const q = query(collection(db, "users"),where("displayName", "==", search));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr(true);
      }
    };
    console.log(user);

    const handleKey=(e)=>{
      e.code==="Enter" 
      && handleSearch()
    }
    
    const handleClickOfsearch=()=>{
      console.log("clicked")
    }

  const handleLogout=()=>{
    signOut(auth).then(() => {
      console.log("logout");
      navigate('/login');
    }).catch((error) => {
      console.log(error)
      setErr(true);
    });
  }

  const handleSelect=async()=>{
    // console.log("some actions....");
    //creating or joining room
    // to create unique id for each room
    // this will create a room with unique id and will add the user to that room
    // currentUser.uid is the id of the user who is logged in
    // user.uid is the id of the user who is selected to chat
    // < is used to create unique id for each room
    // if we use > then it will create same id for each room
    // if we use < then it will create unique id for each room
    // if we use = then it will create same id for each room
    // if we use != then it will create unique id for each room
    // currentUser.uid+user.uid is the id of the room
    const commonId=currentUser.uid>user.uid?currentUser.uid+user.uid:user.uid+currentUser.uid; 
    try{
      const res=await getDoc(doc(db,"chats",commonId));
      // console.log(res);
      if(!res.exists()){
        await setDoc(doc(db,"chats",commonId),{messages:[]});

        //for the selected user
        await updateDoc(doc(db,"userChat",currentUser.uid),{
          [commonId+".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL,
          },
          [commonId+".date"]:serverTimestamp()
        });

        //for the current User
        await updateDoc(doc(db,"userChat",user.uid),{
          [commonId+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL,
          },
          [commonId+".date"]:serverTimestamp()
        });
    }
    }catch(err){
      console.log(err+"hii");
    }
    //to remove the selected user from the search bar
    setUser(null);
    setSearch("");
  }


  const [chats, setChats] = useState([]);
  // onSnapshot used for real time data fetching from firebase database 
  // unsub is used for unsubscribe the data fetching from firebase database
  // const {dispatch}=useContext(ChatContext);
  const {dispatch}=useContext(ChatContext);


  useEffect(()=>{
    const getChats=()=>{
      const unsub = onSnapshot(doc(db, "userChat", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
        return ()=>{
          unsub();
        }
      }
      currentUser.uid && getChats();
  },[currentUser.uid]);

  console.log("first")
  console.log(Object.entries(chats));
  // console.log(chats[1].date.nt);


  const handleSelectUserChat=(u)=>{
    dispatch({ type: "CHANGE_USER", payload: u });
  }  

  const days=["sun","mon","tue","wed","thu","fri","sat"];
  const months=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  return (
    <div className='side'>
      
      <div className='Nav'>

      <div className='wrap'>
        {err && <p style={{color:'red',fontWeight:'bold'}}>Something went wrong</p>}
        
        <div className='current'>
          <div className='for-content'>
            <img alt="no pic" src={currentUser.photoURL} style={{borderColor:'#0a67b8'}} />
            <h3 className='currentName'>{currentUser.displayName}</h3>
            <Button variant='contained' style={{backgroundColor:'black',color:'white',margin:'2px',margin:'0px 20px',marginLeft:'40px',padding:'2px'}} onClick={handleLogout} >Logout</Button>
          </div>
        </div>
        
        <div id='search' style={{border:'1px solid #d7d7d7',borderRadius:'20px',marginTop:'6px',marginBottom:'6px',padding:'5px 0px'}} >
          <SearchIcon style={{padding:'0px 10px'}}/>
          <input type='text' placeholder='SEARCH (Hii or test account)' style={{padding:'0% 1%',fontWeight:'bold',fontFamily:'cursive',height:'35px',width:'100%',outline:'none',borderRadius:'20px',border:'none'}} value={search} onKeyDown={handleKey} onChange={e=>setSearch(e.target.value)} onClick={handleClickOfsearch} />
        </div>

        {user && <div className='Nav__item' onClick={handleSelect} style={{border:'1px solid grey',marginBottom:'3px'}}>
          <img alt="no pic" src={user.photoURL} />
          <p><b>{user.displayName}</b><br/> 
          <span style={{color:'#7dadd6',fontWeight:'bolder'}}>we can chat</span></p>
        </div>}
        {user && <hr />} 
        
        {Object.entries(chats)?.sort((user1,user2)=>user2[1].date-user1[1].date).map((chat)=>{
  
          //date from firebase
          const day=days[chat[1].date && chat[1].date.toDate().getDay()];
          const dd=(chat[1].date && chat[1].date.toDate().getDate())
          const mm=(chat[1].date && chat[1].date.toDate().getMonth());
          const yy=(chat[1].date && chat[1].date.toDate().getFullYear())?.toString();
          const tt=(chat[1].date && chat[1].date.toDate().getHours())
          console.log(tt);
          const dyy=(yy?.substr(2,4));

          {/* const today=new Date();
          const tdd=days[today.getDay()];
          const tmm=
          console.log(tdd); */}
          

          return (<div className='Nav__item' key={chat[0]} style={{marginBottom:'1px'}} onClick={()=>handleSelectUserChat(chat[1].userInfo)}>
           {chat[1].userInfo?.photoURL && <img alt="no pic" src={chat[1].userInfo.photoURL} style={{marginLeft:'10px'}} />}
           <p className='mname'> {chat[1].userInfo?.displayName && <b>{chat[1].userInfo.displayName}</b>} <br/> 
            <span style={{color:'grey',fontWeight:'bolder'}}>{chat[1].lastMessage?.text ? chat[1].lastMessage?.text.substr(0,13) : "..."}</span></p>
            <p className='ltime'>{dd}/{mm+1}/{dyy}</p>
          </div>)})}

      </div>
      </div>
    </div>
  )
}

export default Sidebar

// Hosting URL: https://my-chat-app-37d5f.web.app
