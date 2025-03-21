import { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaCalculator,
  FaDollarSign,
  FaShoppingBag,
} from "react-icons/fa";
import AddShoppingListItemsModal from "./Modals/addShoppingListItemsModal.jsx";

const cardData = [
  {
    icon: <FaChartLine />,
    value: "50",
    text: "Today's used items",
    bgColor: "#E3F2FD",
  },
  {
    icon: <FaCalculator />,
    value: "$250,423",
    text: "Yearly usage",
    bgColor: "#F3E5F5",
  },
  {
    icon: <FaDollarSign />,
    value: "300",
    text: "Supplier list",
    bgColor: "#FFF3E0",
  },
  {
    icon: <FaShoppingBag />,
    value: "343",
    text: "Products",
    bgColor: "#FFEBEE",
  },
];

// Data for Shopping Lists
const shoppingLists = [
  {
    title: "Vegetable Shopping List",
    date: "2025-03-21",
    items: ["No items yet"],
    color: "#A576DD",
  },
  {
    title: "Fruits Shopping List",
    date: "2025-03-21",
    items: [
      "Orange - 10 pcs",
      "Strawberry - 100g",
      "Mango - 1 kg",
      "Pineapple - 1 kg",
      "Banana - 500g",
    ],
    color: "#AC9EFF",
  },
  {
    title: "Dry Goods Shopping List",
    date: "2025-03-21",
    items: [
      "White Rice - 5 kg",
      "Spaghetti - 1 pack",
      "Whole Wheat Flour - 1 kg",
      "White Rice - 5 kg",
      "Spaghetti - 1 pack",
      "Whole Wheat Flour - 1 kg",
      "White Rice - 5 kg",
      "Spaghetti - 1 pack",
      "Whole Wheat Flour - 1 kg",
      "White Rice - 5 kg",
      "Spaghetti - 1 pack",
      "Whole Wheat Flour - 1 kg",
      "White Rice - 5 kg",
      "Spaghetti - 1 pack",
      "Whole Wheat Flour - 1 kg",
    ],
    color: "#C5BCFF",
  },
  {
    title: "Frozen Foods List",
    date: "2025-03-21",
    items: ["Chicken Wings - 2 kg", "Frozen Fish - 1 kg"],
    color: "#E8D5FD",
  },
  {
    title: "Bakery Shopping List",
    date: "2025-03-31",
    items: ["Bread - 2 loaves", "Cake - 1 kg"],
    color: "#C799FF",
  },
  {
    title: "Personal & Beauty Care Shopping List",
    date: "2025-03-31",
    items: [
      "Makeup & Cosmetics - 1",
      "Hair Care & Styling Products - 2",
      "Deodorants & Perfumes - 3",
      "Nail Care & Grooming - 1",
    ],
    color: "#F2D3FC",
  },
];

// Pie Chart Data
const pieData = [
  { name: "List 1", value: 6 },
  { name: "List 2", value: 2 },
  { name: "List 3", value: 9 },
  { name: "List 4", value: 5 },
  { name: "List 5", value: 1 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666"];

// Bar Chart Data
const barData = [
  { name: "List 1", total: 18000, urgent: 7000 },
  { name: "List 2", total: 12000, urgent: 4000 },
  { name: "List 3", total: 19000, urgent: 9000 },
  { name: "List 4", total: 14000, urgent: 5000 },
  { name: "List 5", total: 16000, urgent: 6000 },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const summaryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, staggerChildren: 0.2 },
  },
};

const ShoppingList = () => {
  const [addShoppingItemsModal, setAddShoppingItemsModal] = useState(false);

  const addShoppingItemsToggle = () =>
    setAddShoppingItemsModal(!addShoppingItemsModal);

  return (
    <div className="shopping-container">
      {/* Summary Cards */}
      <motion.div
        className="summary-cards"
        variants={summaryVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="summary-container">
          <h4>Home Summary</h4>
          <div className="summary-card-section">
            {cardData.map((item, index) => (
              <motion.div
                key={index}
                className="summary-card"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="shopping-home-summary-icon"
                  style={{ backgroundColor: item.bgColor }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="value">{item.value}</div>
                  <div className="text">{item.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Shopping Lists */}
      <div className="shopping-container">
        <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
          <h4 className="fw-bold">Shopping Lists</h4>
          <h5 className="shopping-cost">
            Shopping Lists Total Cost :- Rs. 15,000.00
          </h5>
        </div>

        <div className="shopping-list-section">
          {shoppingLists.map((list, index) => (
            <motion.div
              key={index}
              className="shopping-card"
              style={{ backgroundColor: list.color }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="shopping-card-header">
                <h5>{list.title}</h5>
              </div>
              <p className="shopping-date">{list.date}</p>
              <div className="shopping-card-content">
                {list.items.map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </div>
              <div className="shopping-card-icon-group">
                <FaEye className="shopping-card-icon view-icon" />
                <FaEdit
                  className="shopping-card-icon edit-icon"
                  onClick={addShoppingItemsToggle}
                />
                <FaTrash className="shopping-card-icon delete-icon" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AddShoppingListItemsModal
        isOpen={addShoppingItemsModal}
        toggle={addShoppingItemsToggle}
      />

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div
          className="chart-container"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h5 className="mb-4">Shopping Item Count Summary</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-container"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h5 className="mb-5">Shopping Estimated Cost Summary</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
              <Bar dataKey="urgent" fill="#ff6666" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default ShoppingList;
