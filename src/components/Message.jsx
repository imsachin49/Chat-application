import React, { useContext, useRef } from 'react'
import './Message.css'
import { useState,useEffect } from 'react'
import {onSnapshot} from "firebase/firestore";
import {db} from '../firebase'
import { doc } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Picker from 'emoji-picker-react';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Write from './Write';
import {v4 as uui} from 'uuid'; 
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import {storage} from '../firebase';
import {arrayUnion, Timestamp, updateDoc} from "firebase/firestore";
import { ChatContext } from '../context/ChatContext';
import TelegramIcon from '@mui/icons-material/Telegram';

const Message = ({message}) => {
  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);
  console.log("this is daTA");
  console.log(data);

  let isOtherUser=true;
  if(currentUser.uid===message.senderId){
    isOtherUser=false;
  }
  console.log("this is isOtherUser");
  console.log(isOtherUser)

  // const ref=useRef();
  // useEffect(()=>{
    // ref.current?.scrollIntoView({behavior:'smooth'})
  // },[message])

  return (
    <div className='allmsg'>
      <div className='message'>
    {/* <div className='allmsg'> */}
      {/* <div className='message' ref={ref}> */}
        <div style={{display:'flex',alignItems:'center',flexDirection:'column'}} className='msgdiv'>
        <div class="left-point"></div>
          <div style={{display:'flex',justifyContent:'center',flexDirection:'column',width:'400px'}}>
            {message.img && <img src={message.img} alt='send picture' style={{borderRadius:'10px',height:'fitContent',width:'fitContent',margin:'20px 0px'}} />}
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',wordWrap:'break-word'}}>
              <img className='imgs' src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} height='17px' style={{borderRadius:'50%',backgroundColor:'black'}} /> 
              {/* {message.img && <img src={message.img} alt='send picture' style={{borderRadius:'10px',height:'fitContent',width:'fitContent',margin:'20px 0px'}} />} */}
              {isOtherUser && <p className='mymsg'>{message.text}<p className='tym'>just</p></p>}
              {!isOtherUser && <p className='mymsg1'>{message.text}<p className='tym1'>just</p></p>}
            </div>
          </div>
{/* 
          <div style={{display:'flex',alignItems:'center',flexDirection:'column'}} >
           <img src='https://media.tenor.com/mbOQniznQRsAAAAM/desimarketer-aashish-karia.gif' alt='send picture' style={{borderRadius:'10px',height:'200px'}} /><br/>
           <div style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:'-35px'}}>
              <img src="https://png.pngtree.com/png-clipart/20221207/ourmid/pngtree-business-man-avatar-png-image_6514640.png" height='32px' style={{borderRadius:'50%'}} /> 
              <p className='mymsg'>I'm doing Great! 😢😊💖</p>
            </div>
          </div> */}

          {/* <div style={{display:'flex',alignItems:'center',flexDirection:'column'}} >
            <img src='https://media.tenor.com/DAiq0iW5pLEAAAAM/desimarketer-aashish-karia.gif' alt='send picture' style={{borderRadius:'10px',height:'200px'}} /><br/>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:'-35px'}}>
              <img className='imgs' src="https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png" height='32px' style={{borderRadius:'50%'}} /> 
              <p className='mymsg'>Sorry! 😍😍😍 </p>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  )
}

export default Message
