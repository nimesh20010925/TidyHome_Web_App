import React from 'react';
import heroImage from '../../assets/LandingPage/hero.png'
import LandingPageNavBar from './LandingPageNavBar';
import { Link } from 'react-router-dom';

const LandingPage = () => {


  return (
    <div>
      <LandingPageNavBar />
    <section className="hero">
      <div className="hero-text">
        <h1 className='hero-heading'>Your Ultimate Home Inventory & Shopping Planner!</h1>
        <ul className='landing-ul'>
          <li>Struggling to keep track of household items?</li>
          <li>Tired of forgetting essential groceries during shopping?</li>
          <li>Facing challenges in estimating your shopping budget?</li>
          <li>Worried about expired products going unnoticed?</li>
        </ul>

        <p className='hero-p'>Simply manage your home inventory with ease, create organized shopping lists, and plan your expenses accurately — all in one convenient web app! Stay prepared and stress-free with TidyHome.</p>
        <Link to="/auth/signup" className="learn-more">GET STARTED</Link>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Inventory Illustration" className='hero-img' />
        
      </div>
    </section>
    </div>
  );
};

export default LandingPage;
