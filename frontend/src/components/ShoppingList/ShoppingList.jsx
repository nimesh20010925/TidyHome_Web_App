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
  CartesianGrid,
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
  FaFileDownload,
} from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AddShoppingListItemsModal from "./Modals/addShoppingListItemsModal.jsx";
import ShoppingListModal from "./Modals/viewShoppingListModal.jsx";
// import { ShoppingListService } from "../../services/ShoppingListSevices.jsx";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, Col, Row, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import ShoppingListPDF from "./ShoppingListPDF.jsx";

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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666"];

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
  const [viewShoppingListModal, setViewShoppingListModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState();
  const [totalShoppingCost, setTotalShoppingCost] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  // useEffect(() => {
  //   const fetchShoppingLists = async () => {
  //     try {
  //       const lists = await ShoppingListService.getShoppingLists();
  //       console.log("Fetched Shopping Lists:", lists);

  //       if (Array.isArray(lists.shoppingLists)) {
  //         setShoppingLists(lists.shoppingLists);
  //       } else {
  //         console.error("Unexpected response format", lists);
  //         setShoppingLists([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching shopping lists:", error);
  //     }
  //   };

  //   fetchShoppingLists();
  // }, [!addShoppingItemsModal]);

  useEffect(() => {
    const calculateTotalCost = () => {
      const total = shoppingLists.reduce((sum, list) => {
        const listTotal = Array.isArray(list.itemList)
          ? list.itemList.reduce((listSum, item) => {
              return listSum + (item.estimatedItemCost || 0);
            }, 0)
          : 0;
        return sum + listTotal;
      }, 0);

      setTotalShoppingCost(total);
    };

    calculateTotalCost();
  }, [shoppingLists]);

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

      console.log("Fetched Shopping Lists Response:", response.data);

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

  const viewShoppingListToggle = () => {
    setViewShoppingListModal(!viewShoppingListModal);
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

  const addShoppingItemsToggle = async () => {
    setAddShoppingItemsModal(!addShoppingItemsModal);
    if (addShoppingItemsModal) {
      await fetchShoppingLists();
    }
  };

  const handleBtnSelectToView = (list) => {
    viewShoppingListToggle();
    setSelectedShoppingList(list);
  };

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

  // 1. First, define the formatYAxis function (add this above your component)
  const formatYAxis = (tick) => {
    // Format numbers as currency in LKR
    return `${tick.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const pieData =
    shoppingLists?.map((list) => ({
      name: list.listName,
      value: list.itemList.length,
    })) || [];

  const generateBarChartData = () => {
    return shoppingLists.map((list) => {
      // Calculate total cost for this list
      const totalCost = Array.isArray(list.itemList)
        ? list.itemList.reduce(
            (sum, item) => sum + (item.estimatedItemCost || 0),
            0
          )
        : 0;

      // Calculate urgent items cost based on isUrgent field
      const urgentCost = Array.isArray(list.itemList)
        ? list.itemList.reduce((sum, item) => {
            // Check if the item is marked as urgent
            const isUrgent = item.isUrgent === true;
            return isUrgent ? sum + (item.estimatedItemCost || 0) : sum;
          }, 0)
        : 0;

      return {
        name: list.listName || `List ${list._id}`,
        total: totalCost,
        urgent: urgentCost,
      };
    });
  };

  // Then use it in your component
  const barData = generateBarChartData();

  return (
    <div className="shopping-container">
      {/* Summary Cards */}
      <motion.div
        className=""
        variants={summaryVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="shopping-list-summary-container">
          <h4>Home Summary</h4>
          <div className="shopping-list-summary-card-section">
            {cardData.map((item, index) => (
              <motion.div
                key={index}
                className="shopping-list-summary-card"
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
            Shopping Lists Total Cost :-{" "}
            {totalShoppingCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            LKR
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
                <FaEye
                  className="shopping-card-icon view-icon"
                  onClick={() => handleBtnSelectToView(list)}
                />
                <FaEdit
                  className="shopping-card-icon edit-icon"
                  onClick={() => handleAddShoppingItemsBtnSelect(list)}
                />
                <FaTrash
                  className="shopping-card-icon delete-icon"
                  style={{ color: "#A50034" }}
                  onClick={() => handleDeleteShoppingListModal(list._id)}
                />
                <PDFDownloadLink
                  document={<ShoppingListPDF selectedShoppingList={list} />}
                  fileName={`${list.listName.replace(/\s+/g, "_")}.pdf`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaFileDownload className="shopping-card-icon delete-icon" />
                </PDFDownloadLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ShoppingListModal
        isOpen={viewShoppingListModal}
        toggle={viewShoppingListToggle}
        selectedShoppingList={selectedShoppingList}
      />

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
      <div className="shopping-list-charts-section">
        <motion.div
          className="shopping-list-chart-container"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="chart-header">
            <h5 className="mb-4">Shopping Item Distribution</h5>
            <div className="total-items-badge">
              {pieData.reduce((sum, item) => sum + item.value, 0)} items
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pie-label"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} items`, `${name}`]}
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.96)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: "24px",
                }}
                formatter={(value, entry) => (
                  <span className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: entry.color }}
                    />
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <style>{`
            .chart-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 16px;
            }

            .total-items-badge {
              background: #f0f2f5;
              padding: 4px 12px;
              border-radius: 16px;
              font-weight: 600;
              font-size: 14px;
              color: #555;
            }

            .pie-label {
              font-size: 12px;
              font-weight: 600;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .legend-item {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-size: 13px;
              color: #666;
            }
          `}</style>
        </motion.div>

        <motion.div
          className="shopping-list-chart-container"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h5 className="mb-4">Shopping Estimated Cost Summary</h5>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart
              data={barData}
              margin={{
                bottom: 100,
                left: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value) => [
                  `${value}`,
                  value === value ? "Total Cost" : "Urgent Cost",
                ]}
                labelFormatter={(label) => `List: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="total"
                name="Total Cost"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="urgent"
                name="Urgent Cost"
                fill="#ff6666"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default ShoppingList;
