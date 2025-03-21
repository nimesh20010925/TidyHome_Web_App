import React, { useState } from "react";


const SpecialNotices = () => {
  const [notices, setNotices] = useState([
    "🚨 Tomorrow we will clean the store. Please remove personal items before 5 PM.",
    "🚨 Old item disposal will be done this Friday. Mark items to be discarded."
  ]);

  const removeNotice = (index) => {
    const updatedNotices = notices.filter((_, i) => i !== index);
    setNotices(updatedNotices);
  };

  return (
    <div className="special-notices">
      <h2>Special Notices</h2>
      {notices.map((notice, index) => (
        <div className="notice" key={index}>
          <span>{notice}</span>
          <button className="close-btn" onClick={() => removeNotice(index)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default SpecialNotices;
