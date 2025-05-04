import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ShoppingDashboard = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          "http://localhost:3500/api/shoppingList/shopping-lists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShoppingLists(response.data.shoppingLists);
      } catch (err) {
        console.error("Error fetching shopping lists:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load shopping lists"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, []);

  const handleDateHover = (event, dateInfo) => {
    if (dateInfo) {
      setTooltipData(dateInfo);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    } else {
      setTooltipData(null);
    }
  };

  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  if (loading) return <div className="loading">Loading shopping lists...</div>;
  if (error)
    return (
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        No shopping lists found
      </div>
    );
  if (!shoppingLists || shoppingLists.length === 0)
    return <div>No shopping lists found</div>;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shoppingDates = shoppingLists.map((list) => {
    const date = new Date(list.shoppingDate);
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      listName: list.listName,
      shopVisitors: list.shopVisitors,
      listId: list._id,
    };
  });

  const chartData = shoppingLists
    .filter((list) => {
      const date = new Date(list.shoppingDate);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .map((list) => ({
      name: list.listName,
      visitors: list.shopVisitors.length,
      items: list.itemList ? list.itemList.length : 0,
    }));

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="date empty"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateInfo = shoppingDates.find(
      (d) => d.date === i && d.month === currentMonth && d.year === currentYear
    );
    days.push(
      <div
        key={i}
        className={`date ${dateInfo ? "shopping" : ""}`}
        onMouseEnter={(e) => handleDateHover(e, dateInfo)}
        onMouseLeave={() => handleDateHover(null, null)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="chart-container">
        <h2>
          Shopping List Statistics for {monthNames[currentMonth]} {currentYear}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visitors" fill="#c2a2ff" name="Visitors" />
            <Bar dataKey="items" fill="#9166cc" name="Items" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button
            onClick={() => changeMonth("prev")}
            className="month-nav"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FaChevronLeft />
          </button>
          <h2>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => changeMonth("next")}
            className="month-nav"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="calendar">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="day-label">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>

      {tooltipData && (
        <div
          className="shopping-tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            zIndex: 100,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            pointerEvents: "none",
          }}
        >
          <h4>{tooltipData.listName}</h4>
          <p>
            <strong>Date:</strong> {monthNames[tooltipData.month]}{" "}
            {tooltipData.date}, {tooltipData.year}
          </p>
          <p>
            <strong>Visitors:</strong> {tooltipData.shopVisitors.length}
          </p>
          <p>
            <strong>Items:</strong>{" "}
            {shoppingLists.find((list) => list._id === tooltipData.listId)
              ?.itemList?.length || 0}
          </p>
        </div>
      )}

      <style jsx>{`
        .dashboard {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          padding: 1rem;
          flex-wrap: wrap;
        }

        .chart-container {
          flex: 1;
          min-width: 300px;
          background: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .calendar-container {
          width: 400px;
          background: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .month-nav {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem;
        }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .day-label {
          font-weight: bold;
          text-align: center;
          padding: 0.5rem;
        }

        .date {
          text-align: center;
          padding: 0.5rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .date.empty {
          visibility: hidden;
        }

        .date:hover {
          background: #f0f0f0;
        }

        .date.shopping {
          background: #c2a2ff;
          color: white;
          font-weight: bold;
        }

        .date.shopping:hover {
          background: #9166cc;
        }

        .loading,
        .error {
          padding: 1rem;
          text-align: center;
          font-size: 1.2rem;
        }

        .error {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

export default ShoppingDashboard;
