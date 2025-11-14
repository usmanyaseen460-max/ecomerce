import React from 'react'
import './hero.css'


const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
            <div className="hand-icon">
                <p>New</p>
            <img src="https://i.ibb.co/zTpDcrRc/download.png" alt="" />
              </div>     
           <p>Collection</p>
            <p>For everyone</p>
            </div>
      
          <div className="hero-latest-button">
           <a href="/product">
            <div>Latest Collection</div>
         </a>
          </div>
        </div>
        <div className="hero-right">
<img src="https://gracefabrics.com/cdn/shop/files/Wash_and_wear_bacff586-719b-418f-96ec-530a1ab417e2.png?v=1759478370&width=740" alt="" />
        </div>

    </div>
  )
}

export default Hero