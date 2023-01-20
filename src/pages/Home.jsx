import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import './Home.css'

const Home = () => {
  return (
    <div className='home-container'>
        <div className='home'>
            <Sidebar className='sidebar' />
            <Chat className='chat'/>
        </div>
    </div>
  )
}

export default Home
