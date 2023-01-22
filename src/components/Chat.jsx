import React from 'react'
import './Chat.css'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Message from './Message';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useState,useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import {db} from '../firebase';
import { doc } from 'firebase/firestore';
import Write from './Write';

const Chat = () => {
  const [message,setMessage]=useState([]);
  const {data}=useContext(ChatContext);
  
  useEffect(()=>{
    const unSubscribe=onSnapshot(doc(db,'chats',data.chatId),(doc)=>{
      doc.exists() && setMessage(doc.data().messages);
      // console.log(doc.data().messages);
      // console.log(doc.exists());
    })

    return ()=>{
      unSubscribe()
    }
  },[data.chatId])

  return (
    <div className='chat'>
      <div className='top'>
        <div className='chat-user'>
          <Avatar alt="No dp" src={data.user.photoURL} className='avatar'/>
          <p style={{color:'white',textTransform:'capitalize'}}>{data.user.displayName}</p>
        </div>

        <div className='chat-media'>
        {/* <Tooltip title="mode" arrow>
          <IconButton style={{color:"white"}}>
            <DarkModeIcon/>
          </IconButton>
        </Tooltip> */}

        <Tooltip title="not active" arrow>
          <IconButton style={{color:"white"}}>
            <LocalPhoneIcon/>
          </IconButton>
        </Tooltip>

        {/* <Tooltip title="video call" arrow>
          <IconButton style={{color:"white"}}>
            <VideocamIcon/>
          </IconButton>
        </Tooltip> */}

        <Tooltip title="not active" arrow>
          <IconButton style={{color:"white"}}>
            <MoreVertIcon/>
          </IconButton>
        </Tooltip>
        </div> 
      </div>

      <div className='write-style'>
        <Write />
      </div>
      
      <div className='down'>
        {message.map((message)=>{
          return (<Message message={message} key={message.id} />)
        })}                
      </div>
    </div>
  )
}

export default Chat;
