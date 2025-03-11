import React from "react";
import SignupImage from "../../assets/login/signup.jpeg";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <section className="section">
      <div className="imgBx">
        <img src={SignupImage} alt="Signup" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2 className="signuph2">Sign Up</h2>
          <form action="">
            <div className="signupinputBx">
              <span>UserName</span>
              <input type="text" className="signupinput" />
            </div>
            <div className="signupinputBx">
              <span>Email</span>
              <input type="text" className="signupinput" />
            </div>
            <div className="signupinputBx">
              <span>Password</span>
              <input type="password" className="signupinput" />
            </div>
            <div className="signupinputBx">
              <span>Phone</span>
              <input type="tel" className="signupinput" />
            </div>
            <div className="signupinputBx">
              <span>Address</span>
              <input type="text" className="signupinput" />
            </div>
            <div className="signupinputBx">
              <span>Security Answer</span>
              <input type="text" className="signupinput" />
            </div>
            <div className="remember">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
            </div>
            <div className="signupinputBx">
              <input type="submit" value="Sign Up" className="signupbutton" />
            </div>
            <div>
              <p className="signuppara">
                Already have an account?{" "}
                <Link to="/login" className="signuplink">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
