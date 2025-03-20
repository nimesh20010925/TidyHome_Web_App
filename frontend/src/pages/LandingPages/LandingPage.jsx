import React from 'react';
import heroImage from '../../assets/LandingPage/hero.png';
import herobackground from '../../assets/LandingPage/hero-background.jpeg';
import LandingPageNavBar from './LandingPageNavBar';
import phone from '../../assets/LandingPage/phone.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <LandingPageNavBar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>TidyHome:<br /> Your Ultimate Home Inventory & Shopping Planner!</h1>
          <ul className='landing-ul'>
            <li>Struggling to keep track of household items?</li>
            <li>Tired of forgetting essential groceries during shopping?</li>
            <li>Facing challenges in estimating your shopping budget?</li>
            <li>Worried about expired products going unnoticed?</li>
          </ul>
          <p className='hero-p'>
            Simply manage your home inventory with ease, create organized shopping lists, and plan your expenses accurately — all in one convenient web app! Stay prepared and stress-free with TidyHome.
          </p>
          <Link to="/auth/signup" className="learn-more">Get Started</Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Inventory Illustration" className='hero-img' />
        </div>
      </section>

      {/* About Section */}
      <section className='landing-about'>
       
        <div className='landing-about-left'>
          <img src={herobackground} alt="Background" className='landing-about-backimg' />
          <img src={phone} alt="Mobile Preview" className='landing-about-frontimg' />
        </div>
        <div className='landing-about-right'>
          <p>
            TidyHome helps you efficiently manage your household inventory, reduce waste, and make shopping stress-free. Stay in control of your groceries and expenses with our user-friendly platform.
          </p>
          <p>
            TidyHome helps you efficiently manage your household inventory, reduce waste, and make shopping stress-free. Stay in control of your groceries and expenses with our user-friendly platform.
          </p>
          <p>
            TidyHome helps you efficiently manage your household inventory, reduce waste, and make shopping stress-free. Stay in control of your groceries and expenses with our user-friendly platform.
          </p>
          <p>
            TidyHome helps you efficiently manage your household inventory, reduce waste, and make shopping stress-free. Stay in control of your groceries and expenses with our user-friendly platform.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
