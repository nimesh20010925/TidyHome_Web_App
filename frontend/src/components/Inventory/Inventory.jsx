import { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import DummyCategoryImage from "../../assets/inventory/dummy-category.png";
import viewIcon from "../../assets/inventory/eye-purple.png";
import editIcon from "../../assets/inventory/edit-purple.png";
import deleteIcon from "../../assets/inventory/delete-red.png";
import addIcon from "../../assets/inventory/image.png";
import AddInventoryModal from "./Modals/addInventoryModal.jsx";
import UpdateInventoryModal from "./Modals/updateInventoryModal.jsx";
import { InventoryService } from "../../services/InventoryServices.jsx";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const categories = [
  { id: 1, name: "Grains & Cereals", image: DummyCategoryImage, itemCount: 10 },
  { id: 2, name: "Dairy Products", image: DummyCategoryImage, itemCount: 12 },
  { id: 3, name: "Beverages", image: DummyCategoryImage, itemCount: 4 },
  { id: 4, name: "Household Items", image: DummyCategoryImage, itemCount: 5 },
  { id: 5, name: "Frozen Foods", image: DummyCategoryImage, itemCount: 18 },
  {
    id: 6,
    name: "Fruits & Vegetables",
    image: DummyCategoryImage,
    itemCount: 2,
  },
  { id: 7, name: "Meat & Seafood", image: DummyCategoryImage, itemCount: 1 },
  { id: 8, name: "Snacks", image: DummyCategoryImage, itemCount: 25 },
  { id: 9, name: "Bakery", image: DummyCategoryImage, itemCount: 3 },
  { id: 10, name: "Personal Care", image: DummyCategoryImage, itemCount: 4 },
  {
    id: 11,
    name: "Cleaning Supplies",
    image: DummyCategoryImage,
    itemCount: 10,
  },
  {
    id: 12,
    name: "Condiments & Spices",
    image: DummyCategoryImage,
    itemCount: 12,
  },
];

const pieData = {
  labels: [
    "Household Items",
    "Beverages",
    "Dairy Products",
    "Food",
    "Bakery",
    "Fruits & Vegetables",
    "Other",
  ],
  datasets: [
    {
      data: [7, 22.5, 37.5, 27.5, 5, 12, 4.5],
      backgroundColor: [
        "#1E90FF",
        "#FFD700",
        "#FF4500",
        "#8A2BE2",
        "#32CD32",
        "#FFC688",
        "#FF3458",
      ],
    },
  ],
};

const lineData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Inventory Cost",
      data: [
        20000, 15000, 30000, 60000, 25000, 40000, 45000, 30000, 28000, 50000,
        55000, 70000,
      ],
      borderColor: "#8A2BE2",
      fill: false,
    },
  ],
};

const lowInventoryData = [
  { name: "Item A", unit: "unit", existingLevel: 4, lowLevel: 10 },
  { name: "Item B", unit: "kg", existingLevel: 0.5, lowLevel: 2 },
  { name: "Item C", unit: "litre", existingLevel: 18, lowLevel: 20 },
  { name: "Item D", unit: "metre", existingLevel: 5, lowLevel: 8 },
  { name: "Item E", unit: "litre", existingLevel: 8, lowLevel: 20 },
  { name: "Item F", unit: "metre", existingLevel: 5, lowLevel: 8 },
];

const ResponsiveGridLayout = WidthProvider(Responsive);

const Inventory = () => {
  const [addInventoryModal, setAddInventoryModal] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [updateItemModal, setUpdateItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedItemToUpdate, setSelectedItemToUpdate] = useState();
  const [cardHeight, setCardHeight] = useState();
  const [user, setUser] = useState();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const addInventoryToggle = async () => {
    setAddInventoryModal(!addInventoryModal);
    if (addInventoryModal) {
      await getAllInventoryItems();
    }
  };

  const deleteItemToggle = () => {
    setDeleteItemModal(!deleteItemModal);
  };

  const updateItemToggle = async () => {
    setUpdateItemModal(!updateItemModal);
    if (updateItemModal) {
      await getAllInventoryItems();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setIsUserLoaded(true);
  }, []);

  const getAllInventoryItems = async () => {
    try {
      setIsLoading(true);
      const data = await InventoryService.getAllInventoryItems(user?.homeID);
      setInventories(data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error(t("INVENTORY_FETCH_FAILED"));
      setInventories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.homeID) {
      getAllInventoryItems();
    }
  }, [user?.homeID]);

  const handleDeleteInventory = async (id) => {
    try {
      await InventoryService.deleteInventoryItem(id);
      toast.success(t("INVENTORY_ITEM_DELETED_SUCCESS"), {
        style: {
          background: "#4caf50",
          color: "#fff",
        },
      });
      deleteItemToggle();
      getAllInventoryItems();
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      toast.error(t("INVENTORY_ITEM_DELETE_FAILED"), {
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    }
  };

  const handleDeleteInventoryModal = (itemId) => {
    setSelectedItem(itemId);
    deleteItemToggle();
  };

  const handleUpdateInventoryModal = (item) => {
    console.log(item);
    setSelectedItemToUpdate(item);
    updateItemToggle();
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

  const pieChartData = pieData.labels.map((label, index) => ({
    name: label,
    value: pieData.datasets[0].data[index],
    fill: pieData.datasets[0].backgroundColor[index],
  }));

  const lineChartData = lineData.labels.map((label, index) => ({
    name: label,
    Cost: lineData.datasets[0].data[index],
  }));

  const maxValue = lowInventoryData.reduce((max, item) => {
    return Math.max(max, item.existingLevel, item.lowLevel);
  }, 0);

  const hasCriticalItems = lowInventoryData.some(
    (item) => item.existingLevel <= 1
  );

  // Function to calculate the card height based on the number of rows in the table
  const calculateCardHeight = () => {
    const rowHeight = 1.75;
    const headerHeight = 1.8;

    const totalRows = inventories.length;

    const calculatedHeight = totalRows * rowHeight + headerHeight;

    console.log(totalRows);

    setCardHeight(calculatedHeight);

    console.log(cardHeight);
  };

  // Recalculate the card height whenever the number of inventories changes
  useEffect(() => {
    calculateCardHeight();
  }, [inventories]);

  // Handle resizing of the card and update table height
  // const onResizeStop = (layout, oldItem, newItem) => {
  //   if (newItem.i === "inventoryList") {
  //     const rowHeight = 1.75;
  //     const headerHeight = 1.8;
  //     const totalRows = inventories.length;
  //     const maxHeight = totalRows * rowHeight + headerHeight;
  //     const calculatedHeight = Math.min(newItem.h * rowHeight, maxHeight);
  //     setCardHeight(calculatedHeight);
  //   }
  // };

  // Layout configuration
  const layout = [
    {
      i: "inventoryList",
      x: 0,
      y: 0,
      w: 12,
      h: 13,
      minW: 11,
      minH: 13,
      maxH: cardHeight,
    },
    { i: "barChart", x: 0, y: 0, w: 12, h: 4 },
    { i: "pieChart", x: 0, y: 0, w: 4.9, h: 3.05 },
    { i: "lineChart", x: 9, y: 0, w: 6.9, h: 3.05 },
  ];

  if (!isUserLoaded) return null;

  return (
    <div className="inventory-container mt-4 ms-2">
      {/* Categories Section */}
      <div className="inventory-category-section ms-2">
        <h5 className="ms-2 mb-2 fw-bold">{t("INVENTORY_CATEGORIES")}</h5>
        <div className="inventory-categories-container">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="inventory-category-card"
              style={{ backgroundColor: "#ffffff" }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="inventory-category-image"
              />
              <div className="inventory-category-name">{category.name}</div>
              <div className="inventory-category-item-count">
                {category.itemCount}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Inventory List */}

      <Card
        key="inventoryList"
        className="pt-3 ps-3 pe-3 pb-1 mt-3 ms-2 inventory-table-card"
        style={{ mixHeight: cardHeight }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="ms-1 fw-bold">Inventory List</h5>
          <Button
            onClick={addInventoryToggle}
            onMouseDown={(e) => e.stopPropagation()}
            className="rounded-pill border-0 add-inventory-button fw-bold"
          >
            <img
              src={addIcon}
              alt="Add Item"
              width={16}
              height={16}
              className="mb-1 me-1"
            />{" "}
            Add Inventory
          </Button>
        </div>

        <AddInventoryModal
          isOpen={addInventoryModal}
          toggle={addInventoryToggle}
        />

        <div className="inventory-table-wrapper">
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>{t("PRODUCT_NAME")}</th>
                <th>{t("CATEGORY")}</th>
                <th>{t("QUANTITY")}</th>
                <th>{t("ITEM_TYPE")}</th>
                <th>{t("EXPIRY_DATE")}</th>
                <th>{t("SUPPLIER")}</th>
                <th>{t("ACTIONS")}</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="d-flex justify-content-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : inventories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {t("NO_INVENTORY_ITEMS_FOUND")}
                  </td>
                </tr>
              ) : (
                inventories.map((item) => (
                  <tr key={item._id}>
                    <td>{item.itemName}</td>
                    <td>
                      {item.categoryId ? item.categoryId.category_name : "-"}
                    </td>
                    <td>{item.quantity || "-"}</td>
                    <td>{item.itemType || "-"}</td>
                    <td>
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {item.supplierId ? item.supplierId.supplier_name : "-"}
                    </td>
                    <td className="inventory-actions-cell">
                      <div className="inventory-actions-row">
                        <Button
                          className="inventory-actions-no-bg"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <img src={viewIcon} alt="View" />
                        </Button>
                        <Button
                          className="inventory-actions-no-bg"
                          onClick={() => handleUpdateInventoryModal(item)}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <img src={editIcon} alt="Edit" />
                        </Button>
                        <Button
                          className="inventory-actions-no-bg"
                          onClick={() => handleDeleteInventoryModal(item._id)}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

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
                  onClick={() => handleDeleteInventory(selectedItem)}
                  className="ps-4 pe-4 border-0 rounded-pill ms-3 fw-bold"
                >
                  {t("DELETE")}
                </Button>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>

      <UpdateInventoryModal
        isOpen={updateItemModal}
        toggle={updateItemToggle}
        selectedItem={selectedItemToUpdate}
      />

      {/* Charts */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
        rowHeight={150}
        isResizable={false}
        isDraggable={true}
        margin={[0, 0]}
        containerPadding={[0, 0]}
      >
        <div key="barChart" style={{ marginTop: "42px" }}>
          <Card className="p-3 shadow-sm justify-content-center inventory-barchart ms-2">
            <h5 className="mb-4">{t("LOW_INVENTORY_ITEMS")}</h5>
            <ResponsiveContainer width="90%" height={400}>
              <BarChart data={lowInventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, maxValue]} />
                <Tooltip />
                <Legend
                  payload={[
                    {
                      value: t("EXISTING_QUANTITY"),
                      type: "square",
                      color: "#000000",
                    },
                    {
                      value: t("LOW_LEVEL"),
                      type: "square",
                      color: "#BB87FA",
                    },
                    {
                      value: t("CRITICAL_LEVEL"),
                      type: "square",
                      color: "#FF0000",
                    },
                  ]}
                />

                <Bar
                  dataKey="existingLevel"
                  name={t("EXISTING_QUANTITY")}
                  fill="#8884d8"
                >
                  {lowInventoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.existingLevel <= 1
                          ? "#FF0000" // Critical Level
                          : "#000000" // Existing Level
                      }
                    />
                  ))}
                </Bar>

                <Bar dataKey="lowLevel" fill="#BB87FA" name={t("LOW_LEVEL")} />
              </BarChart>
            </ResponsiveContainer>

            {hasCriticalItems && (
              <Alert variant="danger" className="mt-3 text-center">
                ⚠️ {t("YOU_MUST_RESTORE_ITEMS")}
              </Alert>
            )}
          </Card>
        </div>

        <Card
          key="pieChart"
          className="inventory-pie-chart p-3 shadow-sm ms-2"
          style={{ marginTop: "36px", marginBottom: "36px" }}
        >
          <h5>{t("INVENTORY_ITEMS_SUMMARY_BY_CATEGORIES")}</h5>
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>

        <Card
          key="lineChart"
          className="inventory-line-chart p-3 shadow-sm mb-4"
          style={{ marginTop: "36px" }}
        >
          <h5 className="mb-4">{t("MONTHLY_INVENTORY_COST_SUMMARY")}</h5>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Cost" stroke="#8A2BE2" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </ResponsiveGridLayout>
      <div style={{ height: "48px" }}></div>
    </div>
  );
};

export default Inventory;
