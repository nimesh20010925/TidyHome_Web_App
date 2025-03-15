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
import { InventoryService } from "../../services/InventoryServices.jsx";
import { useTranslation } from "react-i18next";

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

const Inventory = () => {
  const [addInventoryModal, setAddInventoryModal] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  const { t } = useTranslation();

  const addInventoryToggle = () => setAddInventoryModal(!addInventoryModal);

  const deleteItemToggle = () => {
    setDeleteItemModal(!deleteItemModal);
  };

  const getAllInventoryItems = async () => {
    const data = await InventoryService.getAllInventoryItems();
    setInventories(data);
  };

  useEffect(() => {
    getAllInventoryItems();
  }, []);

  const handleDeleteInventory = async (id) => {
    try {
      await InventoryService.deleteInventoryItem(id);
      alert("Inventory item deleted successfully!");
      deleteItemToggle();
      getAllInventoryItems();
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      alert("Failed to delete inventory item.");
    }
  };

  const handleDeleteInventoryModal = (itemId) => {
    setSelectedItem(itemId);
    deleteItemToggle();
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

  return (
    <div className="inventory-container mt-2">
      {/* Categories Section */}
      <div className="inventory-category-section">
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
      <Card className="p-3 shadow-sm mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="ms-1 fw-bold">{t("INVENTORY_LIST")}</h5>
          <Button
            onClick={addInventoryToggle}
            className="rounded-pill border-0 add-inventory-button fw-bold"
          >
            <img
              src={addIcon}
              alt="Add Item"
              width={16}
              height={16}
              className="mb-1 me-1"
            />{" "}
            {t("ADD_INVENTORY")}
          </Button>
        </div>

        <AddInventoryModal
          isOpen={addInventoryModal}
          toggle={addInventoryToggle}
        />

        <div className="inventory-table-wrapper">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>{t("PRODUCT_NAME")}</th>
                <th>{t("CATEGORY")}</th>
                <th>{t("QUANTITY")}</th>
                <th>{t("ITEM_TYPE")}</th>
                <th>{t("MANUFACTURED")}</th>
                <th>{t("EXPIRY_DATE")}</th>
                <th>{t("SUPPLIER")}</th>
                <th>{t("ACTIONS")}</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {inventories.map((item) => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>
                  <td>{item.categoryId ? item.categoryId.name : "-"}</td>
                  <td>{item.quantity || "-"}</td>
                  <td>{item.itemType || "-"}</td>
                  <td>
                    {item.manufacturedDate
                      ? new Date(item.manufacturedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{item.supplierId ? item.supplierId.name : "-"}</td>
                  <td className="inventory-actions-cell">
                    <div className="inventory-actions-row">
                      <Button className="inventory-actions-no-bg">
                        <img src={viewIcon} alt="View" />
                      </Button>
                      <Button className="inventory-actions-no-bg">
                        <img src={editIcon} alt="Edit" />
                      </Button>
                      <Button
                        className="inventory-actions-no-bg"
                        onClick={() => handleDeleteInventoryModal(item._id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Charts */}
      <Row className="justify-content-center mt-4">
        {/* Bar Chart */}
        <Col md={11}>
          <Card className="p-3 shadow-sm">
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
        </Col>
      </Row>
      <Row className="mt-4 mb-2">
        {/* Pie Chart */}
        <Col md={5}>
          <Card className="inventory-pie-chart p-3 shadow-sm">
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
        </Col>

        {/* Line Chart */}
        <Col md={7}>
          <Card className="inventory-line-chart p-3 shadow-sm">
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
        </Col>
      </Row>
    </div>
  );
};

export default Inventory;
