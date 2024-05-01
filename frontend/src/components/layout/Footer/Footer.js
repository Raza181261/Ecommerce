import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"

const Footer = () => {
  return (
     <footer id='footer'>
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt='playStore'/>
            <img src={appStore} alt='appStore'/>
        </div> 

        <div className="midFooter">
            <h1>ECOMMERCE.</h1>
            <p>High Quality is our first priority</p>
            <p>CopyRights 2024 &copy; virtualDev</p>

        </div>

        <div className='rightFooter'>
            <h4>Follow us</h4>
            <a href='http://instagram.com/virtualDev'>Instagram</a>
            <a href='http://youtube.com/virtualDev'>YouTube</a>
            <a href='http://facebook.com/virtualDev'>Facebook</a>
        </div>

     </footer>
  )
}

export default Footer