import { useEffect, useState } from "react";
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
import { ShoppingListService } from "../../services/ShoppingListSevices.jsx";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, Col, Row, Button } from "reactstrap";
import { useTranslation } from "react-i18next";

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
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState([]);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const lists = await ShoppingListService.getShoppingLists();
        console.log("Fetched Shopping Lists:", lists);

        if (Array.isArray(lists.shoppingLists)) {
          setShoppingLists(lists.shoppingLists);
        } else {
          console.error("Unexpected response format", lists);
          setShoppingLists([]);
        }
      } catch (error) {
        console.error("Error fetching shopping lists:", error);
      }
    };

    fetchShoppingLists();
  }, []);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const lists = await ShoppingListService.getShoppingLists();
        console.log("Fetched Shopping Lists:", lists);

        if (Array.isArray(lists.shoppingLists)) {
          setShoppingLists(lists.shoppingLists);
        } else {
          console.error("Unexpected response format", lists);
          setShoppingLists([]);
        }
      } catch (error) {
        console.error("Error fetching shopping lists:", error);
      }
    };

    fetchShoppingLists();
  }, [!addShoppingItemsModal]);

  const fetchShoppingLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3500/api/shoppingList/shopping-lists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched Shopping Lists Response:", response.data); // Log to confirm structure

      // Extract the shoppingLists array from the response
      if (response.data && Array.isArray(response.data.shoppingLists)) {
        setShoppingLists(response.data.shoppingLists);
      } else {
        console.error("Unexpected response format:", response.data);
        setShoppingLists([]); // Ensure state is always an array
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      setShoppingLists([]); // Prevent UI errors
    }
  };

  const deleteItemToggle = () => {
    setDeleteItemModal(!deleteItemModal);
  };

  const handleDelete = async (listId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3500/api/shoppingList/shopping-lists/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      deleteItemToggle();
      fetchShoppingLists();
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  const addShoppingItemsToggle = () =>
    setAddShoppingItemsModal(!addShoppingItemsModal);

  const handleAddShoppingItemsBtnSelect = (list) => {
    addShoppingItemsToggle();
    setSelectedShoppingList(list);
  };

  const handleDeleteShoppingListModal = (itemId) => {
    setSelectedItemId(itemId);
    deleteItemToggle();
  };

  // Function to generate random purple shades
  const getRandomLightPurplePinkBlueShade = () => {
    const hue = Math.random() * 60 + 210;
    const saturation = Math.floor(Math.random() * 40) + 60;
    const lightness = Math.floor(Math.random() * 20) + 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const closeDeleteItemBtn = (
    <button className="close-btn" onClick={deleteItemToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

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
              style={{ backgroundColor: getRandomLightPurplePinkBlueShade() }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="shopping-card-header">
                <h5>{list.listName}</h5>
              </div>
              <p className="shopping-date">
                {new Date(list.shoppingDate).toISOString().split("T")[0]}
              </p>
              <div className="shopping-card-content">
                {Array.isArray(list.itemList) && list.itemList.length > 0 ? (
                  list.itemList.map((item, index) => (
                    <div key={index}>
                      {item.itemName} - {item.quantity}{" "}
                      {item.itemType !== "Unit" && item.itemType}
                    </div>
                  ))
                ) : (
                  <p>No items added yet.</p>
                )}
              </div>
              <div className="shopping-card-icon-group">
                <FaEye className="shopping-card-icon view-icon" />
                <FaEdit
                  className="shopping-card-icon edit-icon"
                  onClick={() => handleAddShoppingItemsBtnSelect(list)}
                />
                <FaTrash
                  className="shopping-card-icon delete-icon"
                  // onClick={() => handleDelete(list._id)}
                  onClick={() => handleDeleteShoppingListModal(list._id)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={deleteItemModal}
        toggle={deleteItemToggle}
        centered
        scrollable
      >
        <ModalHeader
          toggle={deleteItemToggle}
          close={closeDeleteItemBtn}
          className="border-0 pb-0 pr-4 pl-4 ms-2 mr-2 fw-bold"
        >
          {t("INVENTORY_DELETION_CONFIRMATION")}
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column">
            <div className="form-group mb-4 ms-3 justify-content-center align-items-center">
              {t("ARE_YOU_SURE_INVENTORY_DELETION")}
            </div>
            <Row className="form-group mb-2 mr-1 d-flex justify-content-end">
              <Col xs="auto">
                <Button
                  style={{ cursor: "pointer" }}
                  onClick={deleteItemToggle}
                  className="ps-4 pe-4 border-0 rounded-pill bg-black fw-bold"
                >
                  {t("CANCEL")}
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  style={{
                    backgroundColor: "#ff0000",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(selectedItemId)}
                  className="ps-4 pe-4 border-0 rounded-pill ms-3 fw-bold"
                >
                  {t("DELETE")}
                </Button>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
      <AddShoppingListItemsModal
        isOpen={addShoppingItemsModal}
        toggle={addShoppingItemsToggle}
        selectedShoppingList={selectedShoppingList}
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
