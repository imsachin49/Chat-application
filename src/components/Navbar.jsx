import React from 'react'
import { Button } from '@mui/material'

const Navbar = () => {
  
  return (
    <div className='userNav' style={{width:'100%'}}>
      {/* <div className='logo' style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <img src='https://cdn-icons-png.flaticon.com/128/1041/1041916.png' alt='logo' width="40px" height="40px" /> 
          <span style={{fontWeight:'bolder',marginleft:'10px',fontSize:'xx-large'}}>ChatHub</span>
      </div> */}

      <div className='you' style={{display:'flex',justifyContent:'center',padding:'10px',border:'1px solid white',alignItems:'center',marginTop:'15px',borderRadius:'5px',marginBottom:'5px',backgroundColor:'whitesmoke'}}>
        <img src='https://cdn-icons-png.flaticon.com/512/924/924915.png' height='30px' style={{border:'1px solid white',borderRadius:'50%',padding:'2px',backgroundColor:'white'}}/>
        <span style={{fontSize:"x-large"}}>Dummy User</span>
        {/* <Button variant='conytained' size='small' style={{backgroundColor:'black',color:'white',paddingRight:'10px'}}>Logout</Button> */}
      </div>

    </div>
  )
}

export default Navbar
