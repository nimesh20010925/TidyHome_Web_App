import React from "react";
import { useTranslation } from "react-i18next";
const HomeSummary = () => {
    const { t } = useTranslation();
  const summaryData = [
    { icon: "📈", value: 50, label: "Today's used items" },
    { icon: "📅", value: "$250,423", label: "Yearly usage" },
    { icon: "💰", value: 300, label: "Supplier list" },
    { icon: "🛍️", value: 343, label: "Products" },
  ];

  return (
    <div className="home-summary">
      <h2 className="home-summary-h2">{t("HOMESUMMRY")}</h2>
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
