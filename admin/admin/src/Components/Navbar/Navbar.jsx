import React from 'react'
import './Navbar.css'
import shopLogo from '../../assets/shoplogo.png'
import navProfile from '../../assets/navProfile.jpg'
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navlogo">
    <img src={shopLogo} alt=""  />
    </div>
    <div className="nav-profile">
    <img src={navProfile} alt="" />
    </div>
    </div>
  )
}

export default Navbar