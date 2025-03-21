import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const data = [
  { name: "List 1", uv: 7000, pv: 19000 },
  { name: "List 2", uv: 5000, pv: 14000 },
  { name: "List 3", uv: 6000, pv: 16000 },
  { name: "List 4", uv: 3000, pv: 19000 },
  { name: "List 5", uv: 13000, pv: 13000 },
];

const shoppingDates = [6, 8, 9, 19, 28];

const ShoppingDashboard = () => {
  return (
    <div className="dashboard">
      {/* Bar Chart Section */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="uv" fill="#c2a2ff" />
            <Bar dataKey="pv" fill="#9166cc" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Calendar Section */}
      <div className="calendar-container">
        <h2>Shopping Dates</h2>
        <div className="month-header">February</div>
        <div className="calendar">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="day-label">
              {day}
            </div>
          ))}
          {Array.from({ length: 27 }, (_, i) => i + 1).map((date) => (
            <div key={date} className={`date ${shoppingDates.includes(date) ? "shopping" : ""}`}>
              {date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingDashboard;
