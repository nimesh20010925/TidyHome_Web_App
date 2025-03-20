import React from 'react'
import Logo from "../../assets/logo/TidyHome_Logo.png";
import heroImage from '../../assets/LandingPage/hero.png';
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import './LandingHomePage.css';
const LandingHomePage = () => {
    return (
        <div className='landing-body'>
        <div className="landing-container">
            <div className="landing-home-nav">
                <div className="landing-home-logo">
                    <img src={Logo} alt="TidyHome Logo" className="logo-image" />
                </div>
                <div className="landing-home-links">
                    <div className=''>
                        <span><IoSearch /></span>
                    </div>
                    <div className=''>
                        ENG<span><IoIosArrowDown /></span>
                    </div>
                    <div className=''>
                        About
                    </div>
                    <div className=''>
                        Contact
                    </div>
                </div>
            </div>
            <div className="landing-home-content">
                <div className="landing-home-image">
                    <img src={heroImage} alt="" />
                </div>
                <div className="landing-home-header">
                    <h1>TidyHome</h1>
                    <p>GET STARTED</p>
                </div>
                <div className="landing-home-featured">
                    <h4>FEATURED</h4>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="contact">
                    <span><FaPhoneAlt /></span>0753391069
                </div>
            </div>
            <div className="landing-home-footer">
                <div className="landing-home-socials">
                    <span>Facebook</span>
                    <span>Twitter</span>
                    <span>Google</span>
                </div>
                <div className="slides">02<span>/05</span></div>
            </div>
        </div>
        </div>
    )
}

export default LandingHomePage