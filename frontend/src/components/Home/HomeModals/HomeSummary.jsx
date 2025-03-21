import React from "react";

const HomeSummary = () => {
  const summaryData = [
    { icon: "📈", value: 50, label: "Today's used items" },
    { icon: "📅", value: "$250,423", label: "Yearly usage" },
    { icon: "💰", value: 300, label: "Supplier list" },
    { icon: "🛍️", value: 343, label: "Products" },
  ];

  return (
    <div className="home-summary">
      <h2 className="home-summary-h2">Home Summary</h2>
      <div className="summary-cards">
        {summaryData.map((item, index) => (
          <div className="summary-card" key={index}>
            <div className="icon">{item.icon}</div>
            <div className="summary-value">{item.value}</div>
            <div className="summary-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSummary;
