import React from "react";
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
import DummyCategoryImage from "../../assets/inventory/dummy-category.png";
import viewIcon from "../../assets/inventory/eye-purple.png";
import editIcon from "../../assets/inventory/edit-purple.png";
import deleteIcon from "../../assets/inventory/delete-red.png";
import addIcon from "../../assets/inventory/image.png";

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

const inventoryData = [
  {
    id: 1,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 2,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
  {
    id: 3,
    name: "Samba Rice",
    category: "Grains & Cereals",
    quantity: 20,
    itemType: "Kg",
    expiryDate: "2026-05-12",
    createdDate: "2025-02-26",
    supplier: "FoodCity",
  },
];

const pieData = {
  labels: ["Household Items", "Beverages", "Dairy Products", "Food", "Bakery", "Fruits & Vegetables", "Other"],
  datasets: [
    {
      data: [7, 22.5, 37.5, 27.5, 5, 12, 4.5],
      backgroundColor: ["#1E90FF", "#FFD700", "#FF4500", "#8A2BE2", "#32CD32", "#FFC688", "#FF3458"],
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
        <h5 className="ms-2 mb-2 fw-bold">Inventory Categories</h5>
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
          <h5 className="ms-1 fw-bold">Inventory List</h5>
          <Button className="add-inventory-button fw-bold">
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

        <div className="inventory-table-wrapper">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Item Type</th>
                <th>Manfactured</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.itemType}</td>
                  <td>{item.expiryDate}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.supplier}</td>
                  <td className="inventory-actions-row">
                    <Button className="inventory-actions-no-bg">
                      <img src={viewIcon} alt="View" />
                    </Button>
                    <Button className="inventory-actions-no-bg">
                      <img src={editIcon} alt="Edit" />
                    </Button>
                    <Button className="inventory-actions-no-bg">
                      <img src={deleteIcon} alt="Delete" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Charts */}
      <Row className="justify-content-center mt-4">
        {/* Bar Chart */}
        <Col md={11}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-4">Low Inventory Items</h5>
            <ResponsiveContainer width="90%" height={400}>
              <BarChart data={lowInventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, maxValue]} />
                <Tooltip />
                <Legend
                  payload={[
                    {
                      value: "Existing Level",
                      type: "square",
                      color: "#000000",
                    },
                    { value: "Low Level", type: "square", color: "#BB87FA" },
                    {
                      value: "Critical Level",
                      type: "square",
                      color: "#FF0000",
                    },
                  ]}
                />

                <Bar
                  dataKey="existingLevel"
                  name="Existing Level"
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

                <Bar dataKey="lowLevel" fill="#BB87FA" name="Low Level" />
              </BarChart>
            </ResponsiveContainer>

            {hasCriticalItems && (
              <Alert variant="danger" className="mt-3 text-center">
                ⚠️ You must immediately restore the lowest inventory items.
              </Alert>
            )}
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        {/* Pie Chart */}
        <Col md={5}>
          <Card className="inventory-pie-chart p-3 shadow-sm">
            <h5>Inventory Items Summary by Categories</h5>
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
            <h5 className="mb-4">Monthly Inventory Cost Summary</h5>
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
