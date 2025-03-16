import React from 'react';
import LandingPageNavBar from './LandingPageNavBar';
import LandingImage from '../../assets/LandingPage/womenbringbox.png'; // Replace with actual image path
import { useNavigate } from 'react-router-dom';

// Importing the specific icons from react-icons
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landingpage-container">
      <LandingPageNavBar />
      <div className="landingpage-content">
        {/* Left Side Heading */}
        <div className="landingpage-text">
          <h1>Welcome to TidyHome</h1>
          <p>Your ultimate solution for home grocery management.</p>
          <button className="get-started-btn" onClick={() => navigate('/auth/signup')}>Get Started</button>
        </div>
        {/* Right Side Image */}
        <div className="landingpage-image">
          <img src={LandingImage} alt="TidyHome Preview" />
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="social-media-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <span className="icon-container">
            <FaFacebookF size={24} />
            <span className="icon-name">Facebook</span>
          </span>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <span className="icon-container">
            <FaTwitter size={24} />
            <span className="icon-name">Twitter</span>
          </span>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <span className="icon-container">
            <FaInstagram size={24} />
            <span className="icon-name">Instagram</span>
          </span>
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
          <span className="icon-container">
            <FaLinkedinIn size={24} />
            <span className="icon-name">LinkedIn</span>
          </span>
        </a>
      </div>

      {/* About Us Section */}
      <section className="about-us-section">
        <h2>About Us</h2>
        <p>
          TidyHome is dedicated to simplifying your home grocery management. We provide an easy-to-use platform to track your inventory, manage shopping lists, and keep your groceries fresh.
        </p>
        <p>
          Our mission is to help you stay organized, save time, and reduce waste. Whether you’re managing your household’s inventory or looking for new recipes, TidyHome has everything you need.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="feature-item">
          <h3>Inventory Management</h3>
          <p>Keep track of your groceries, manage stock levels, and get notified when items are about to expire.</p>
        </div>
        <div className="feature-item">
          <h3>Shopping Lists</h3>
          <p>Create shopping lists, categorize items, and easily manage your grocery shopping.</p>
        </div>
        <div className="feature-item">
          <h3>Supplier Integration</h3>
          <p>Get access to nearby shops and suppliers directly from the app to make your shopping experience seamless.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"TidyHome has completely transformed how I manage groceries at home. It's incredibly easy to use, and I love the inventory tracking feature!"</p>
          <h4>- Sarah, Home Manager</h4>
        </div>
        <div className="testimonial">
          <p>"As a busy working mom, TidyHome helps me stay organized and on top of grocery shopping. I can't imagine going back to old ways!"</p>
          <h4>- Emily, Working Mom</h4>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us-section">
        <h2>Contact Us</h2>
        <p>
          We’d love to hear from you! If you have any questions, feedback, or inquiries, feel free to reach out to us.
        </p>
        <p>Email: <a href="mailto:support@tidyhome.com">support@tidyhome.com</a></p>
        <p>Phone: +1 (123) 456-7890</p>
        <p>Address: 123 TidyHome St., CleanCity, XY 12345</p>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Sign up today and start managing your groceries effortlessly with TidyHome.</p>
        <button className="cta-btn" onClick={() => navigate('/auth/signup')}>Get Started</button>
      </section>
    </div>
  );
};

export default LandingPage;
