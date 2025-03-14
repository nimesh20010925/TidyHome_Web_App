import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginImage from "../../assets/login/login.jpg";
import Logo from "../../assets/logo/TidyHome_Logo.png";

const Login = () => {
  const { t } = useTranslation();

  return (
    <section className="section">
      {/* Left Image Box */}
      <div className="imgBx">
        <img src={LoginImage} alt="Signup" />
      </div>

      {/* Right Content Box */}
      <div className="contentBx">
        <div className="formBx">
          {/* Centered Logo & Heading */}
          <div>
            <img src={Logo} alt="TidyHome Logo" className="loginlogo" />
            <div className='loginh2'>
            <h2>{t("LOGIN")}</h2>
            </div>
            
          </div>

          <form action="">
            <div className="signupinputBx">
              <span>{t("EMAIL")}</span>
              <input type="text" className="signupinput" placeholder={t("EXEMAIL")} />
            </div>
            <div className="signupinputBx">
              <span>{t("PASSWORD")}</span>
              <input type="password" className="signupinput" placeholder={t("EXPASSWORD")} />
            </div>

            <div className="remember">
              <label>
                <input type="checkbox" /> {t("REMEMBERME")}
                <Link to="/login" className="fogotpasswordlink">{t("FOGOTPASSWORD")}</Link>
              </label>
            </div>

            <div className="signupinputBx">
              <input type="submit" value={t("LOGIN")} className="signupbutton" />
            </div>

            <div>
              <p className="signuppara">
                {t("DONTHAVEANACCOUNT")}{" "}
                <Link to="/signup" className="signuplink">{t("SIGNUP")}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
