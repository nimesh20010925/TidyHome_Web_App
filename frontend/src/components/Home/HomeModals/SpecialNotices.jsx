import React, { useState } from "react";

const SpecialNotices = () => {
  const [notices, setNotices] = useState([
    "🚨 Tomorrow we will clean the store. Please remove personal items before 5 PM.",
    "🚨 Old item disposal will be done this Friday. Mark items to be discarded.",
    "🚨 Reminder: Submit your inventory updates by Wednesday evening.",
    "🚨 Safety drill scheduled for next Monday. Please be prepared.",
    "🚨 Store hours will change next month. Check the notice board for details."
  ]);

  const removeNotice = (index) => {
    setNotices((prevNotices) => prevNotices.filter((_, i) => i !== index));
  };

  return (
    <div className="special-notices-container">
      <h2>Special Notices</h2>
      <div className="notices-wrapper">
        {notices.map((notice, index) => (
          <div className="notice" key={index}>
            <span>{notice}</span>
            <button className="close-btn" onClick={() => removeNotice(index)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialNotices;
