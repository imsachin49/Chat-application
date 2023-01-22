import React, { useContext } from 'react'
import './Message.css'
import { useState,useEffect } from 'react'
import {arrayUnion, onSnapshot, Timestamp, updateDoc} from "firebase/firestore";
import {db} from '../firebase'
import {doc} from 'firebase/firestore'
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
import { ChatContext } from '../context/ChatContext';
import {v4 as uuid} from 'uuid'; 
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import {storage} from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TelegramIcon from '@mui/icons-material/Telegram';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';


const Write=()=>{
    const [file,setFile]=useState('');
    const [text,setText]=useState('');
    const [emojis,setEmojis]=useState('');
    const [showPicker,setShowPicker]=useState(false);
    console.log(file);
    const {data}=useContext(ChatContext);
    const {currentUser}=useContext(AuthContext);
    const [warn,setWarn]=useState(false);

    const onEmojiClick = (event, emojiObject) => {
      setText(prevInput => prevInput + event.emoji);
      setShowPicker(false);
    };

    const handleFile=(e)=>{
      setFile(e.target.files[0]);
      toast.success("Your image is ready to upload",{
        position:"bottom-center",
        theme:'dark'
      })
    }
  
    const handleSubmit=async(e)=>{
      e.preventDefault();

      if((file===null && text==='')){
        toast.warning("Please enter a message or select a file to send",{
          position:"bottom-center", 
          theme:'dark'
        });
      }

      else{
        if(file){
        const storageRef=ref(storage,uuid());
        await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
        });
       }
       
       else if(text){
        await updateDoc(doc(db,'chats',data.chatId),{
          messages:arrayUnion({
            id:uuid(),
            text,
            senderId:currentUser.uid,
            date:Timestamp.now(),
          })
        })
       }

       else{
        toast.warning("Please enter a message or select a file to send",{
          position:"bottom-center", 
          theme:'dark'
        });
       }

      // to update the last message and date for the current user
      await updateDoc(doc(db, "userChat", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      //to update the last message and date for the other user
      await updateDoc(doc(db, "userChat", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

    }
    console.log('submited successfully...');
    setText('');
    setFile(null);
  }

    return (
      <>
        {showPicker && <Picker style={{width:'600px',height:'600px'}} onEmojiClick={onEmojiClick} />}
        <BottomNavigation sx={{position:'fixed',bottom:0}} id='send'>
        <form className='write-message' onSubmit={handleSubmit}>
        <div className='write-message1'>
          <SentimentSatisfiedAltIcon className='write-message-input-icon' onClick={() => setShowPicker(val => !val)} />
          <input type='text' placeholder='Type a message' value={text} className='write-message-input-field' onChange={e=>setText(e.target.value)} />
          <div className='file'>
            <input type='file' id='file' onChange={handleFile}/>
            <label htmlFor='file'>
              {/* <AttachFileIcon className='wicon' /> */}
              <img src='https://cdn-icons-png.flaticon.com/128/8744/8744024.png' className='wicon' height='25px' />
            </label>
          </div> 
        </div>
        <button className='write-message-button' type='submit'><TelegramIcon/></button>
        </form>
        </BottomNavigation>
        <ToastContainer />
      </>
    )
}

export default Write;
