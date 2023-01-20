import React from 'react'
import './Sidebar.css'
import { useState } from 'react';
import { Divider } from '@mui/material'
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

  const handleSelectUserChat=(u)=>{
    dispatch({ type: "CHANGE_USER", payload: u });
  }  

  return (
    <div className='side'>
      
      <div className='Nav'>

      <div className='wrap'>
        {err && <p style={{color:'red',fontWeight:'bold'}}>Something went wrong</p>}
        
        <div id='current'>       
          <div style={{display:'flex',alignItems:'center',float:'left'}}>
            <img alt="no pic" src={currentUser.photoURL} style={{borderColor:'#0a67b8'}} />
            <span style={{color:'greenred',fontWeight:'bold'}}>{currentUser.displayName}</span>
          </div>
            <Button variant='contained' size='small' style={{backgroundColor:'brown',color:'white',paddingRight:'10px'}} onClick={handleLogout} >Logout</Button>
        </div>
        
        <div id='search' style={{border:'1px solid grey',borderRadius:'20px',marginTop:'6px',marginBottom:'6px',padding:'0px'}} >
          {/* <SearchIcon /> */}
          <input type='text' placeholder='Search user to chat..' style={{padding:'0% 1%',fontWeight:'bold',fontFamily:'cursive',height:'35px',width:'100%',outline:'none',borderRadius:'20px',border:'none'}} value={search} onKeyDown={handleKey} onChange={e=>setSearch(e.target.value)} onClick={handleClickOfsearch} />
        </div>

        {user && <div className='Nav__item' onClick={handleSelect} style={{border:'1px solid grey',marginBottom:'3px'}}>
          <img alt="no pic" src={user.photoURL} />
          <p><b>{user.displayName}</b><br/> 
          <span style={{color:'green',fontWeight:'bolder'}}>typing...</span></p>
        </div>}
        {user && <hr />} 
        
        {Object.entries(chats)?.sort((user1,user2)=>user2[1].date-user1[1].date).map((chat)=>{
          console.log(chat[1].date);
          return (<div className='Nav__item' key={chat[0]} style={{border:'1px solid grey',marginBottom:'1px'}} onClick={()=>handleSelectUserChat(chat[1].userInfo)}>
           <img alt="no pic" src={chat[1].userInfo.photoURL} />
            <p> <b>{chat[1].userInfo.displayName}</b> <br/> 
            <span style={{color:'grey',fontWeight:'bolder'}}>{chat[1].lastMessage?.text ? chat[1].lastMessage?.text.substr(0,10) : "..."}...</span></p>
            
            {/* <span style={{color:'green',fontWeight:'bolder'}}>typing...</span></p> */}
        </div>)})}
        
        {/* <Divider /> */}
        
        {/* <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-clipart/20221207/ourmid/pngtree-business-man-avatar-png-image_6514640.png' />
          <p><b>Ankit xyz</b> <br />
          <span>Latest message</span></p>
        </div>
        <Divider />

        <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-clipart/20220401/ourmid/pngtree-d-rendering-gentleman-male-avatar-with-black-suit-and-red-butterfly-png-image_4521690.png' />
          <p><b>Bsdke Xyz</b> <br/>
          <span>Latest message</span> </p>
        </div>
        <Divider />

        <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-vector/20220430/ourmid/pngtree-smiling-people-avatar-set-different-men-and-women-characters-collection-png-image_4526736.png' />
          <p><b>Random user</b> <br />
          <span style={{color:'green',fontWeight:'bolder'}}>typing...</span></p>
        </div>
        <Divider />

        <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-vector/20220701/ourmid/pngtree-beautiful-muslim-hijab-girl-woman-avatar-profile-flat-icon-vector-illustration-png-image_5628400.png' />
            <p><b>Nageswar nag</b> <br />
            <span>Latest message</span></p>
        </div>
        <Divider /> */}
        
        {/* <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-vector/20220701/ourmid/pngtree-beautiful-muslim-hijab-girl-woman-avatar-profile-flat-icon-vector-illustration-png-image_5628400.png' />
          <p><b>Nageswar nag</b><br />
          <span>Latest message</span></p>
        </div>
        <Divider />
        
        <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-vector/20220701/ourmid/pngtree-beautiful-muslim-hijab-girl-woman-avatar-profile-flat-icon-vector-illustration-png-image_5628400.png' />
          <p><b>Nageswar nag</b><br />
          <span>Latest message</span></p>
        </div>
        <Divider />
        
        <div className='Nav__item'>
          <img alt="no pic" src='https://png.pngtree.com/png-vector/20220701/ourmid/pngtree-beautiful-muslim-hijab-girl-woman-avatar-profile-flat-icon-vector-illustration-png-image_5628400.png' />
          <p><b>Nageswar nag</b><br />
          <span>Latest message</span></p>
        </div>
        <Divider /> */}

      </div>
      </div>
    </div>
  )
}

export default Sidebar
