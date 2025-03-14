import React from 'react'
import HomeImage from "../../assets/home/home.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateHome = () => {
    const { t } = useTranslation();

  return (
    <section className="section">
      <div className="imgBx">
        <img src={HomeImage} alt="Signup" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2 className="signuph2">{t("CREATEHOME")}</h2>
          <form action="">
            <div className="signupinputBx">
              <span>{t("HOMENAME")}</span>
              <input type="text" className="signupinput" placeholder=""/>
            </div>
            <div className="signupinputBx">
              <span>{t("OWNERNAME")}</span>
              <input type="text" className="signupinput" placeholder=""/>
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEPHONENUMBER")}</span>
              <input type="tel" className="signupinput" placeholder=""/>
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEADDRESS")}</span>
              <input type="text" className="signupinput" placeholder=""/>
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEMEMBERS")}</span>
              <input type="number" className="signupinput" placeholder=""/>
            </div>
            
            <div className="signupinputBx">
              <input type="submit" value={t("CREATEHOME")} className="signupbutton" />
            </div>
            
          </form>
        </div>
      </div>
    </section>
  )
}

export default CreateHome