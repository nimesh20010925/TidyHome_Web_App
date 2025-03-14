import React from "react";
import SignupImage from "../../assets/login/signup.jpeg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();

  return (
    <section className="section">
      <div className="imgBx">
        <img src={SignupImage} alt="Signup" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2 className="signuph2">{t("SIGNUP")}</h2>
          <form action="">
            <div className="signupinputBx">
              <span>{t("USERNAME")}</span>
              <input type="text" className="signupinput" placeholder={t("EXJOHNPERERA")}/>
            </div>
            <div className="signupinputBx">
              <span>{t("EMAIL")}</span>
              <input type="text" className="signupinput" placeholder={t("EXEMAIL")}/>
            </div>
            <div className="signupinputBx">
              <span>{t("PASSWORD")}</span>
              <input type="password" className="signupinput" placeholder={t("EXPASSWORD")}/>
            </div>
            <div className="signupinputBx">
              <span>{t("PHONE")}</span>
              <input type="tel" className="signupinput" placeholder={t("EXPHONE")}/>
            </div>
            <div className="signupinputBx">
              <span>{t("ADDRESS")}</span>
              <input type="text" className="signupinput" placeholder={t("EXADDRESS")}/>
            </div>
            <div className="remember">
              <label>
                <input type="checkbox" /> {t("REMEMBERME")}
              </label>
            </div>
            <div className="signupinputBx">
              <input type="submit" value={t("SIGNUP")} className="signupbutton" />
            </div>
            <div>
              <p className="signuppara">
                {t("ALREADYHAVEANACCOUNT")}{" "}
                <Link to="/login" className="signuplink">
                {t("SIGNUP")}
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
