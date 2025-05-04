import { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Alert, Form } from "react-bootstrap";
import { Cell, Tooltip, Legend } from "recharts";
import {
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
import { InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [viewItemModal, setViewItemModal] = useState(false);
  const [selectedItemToView, setSelectedItemToView] = useState(null);
  // const [expiringSoonItems, setExpiringSoonItems] = useState([]);

  const { t } = useTranslation();

  const viewItemToggle = () => {
    setViewItemModal(!viewItemModal);
  };

  const filteredInventories = inventories.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      item.itemName?.toLowerCase().includes(searchLower) ||
      item.categoryId?.category_name?.toLowerCase().includes(searchLower) ||
      item.supplierId?.supplier_name?.toLowerCase().includes(searchLower) ||
      item.itemType?.toLowerCase().includes(searchLower) ||
      item.quantity?.toString().includes(searchTerm) ||
      (item.expiryDate &&
        new Date(item.expiryDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower))
    );
  });

  const checkExpiryStatus = (items) => {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const expired = [];
    const expiringSoon = [];

    items.forEach((item) => {
      if (!item.expiryDate) return;

      const expiryDate = new Date(item.expiryDate);

      if (expiryDate <= now) {
        expired.push(item);
      } else if (expiryDate >= oneMonthFromNow) {
        expiringSoon.push(item);
      }
    });

    setExpiredItems(expired);
    // setExpiringSoonItems(expiringSoon);
  };

  const getRowClass = (item) => {
    if (!item.expiryDate) return "";

    const expiryDate = new Date(item.expiryDate);
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    if (expiryDate < now) {
      return "expired-row";
    } else if (expiryDate <= oneMonthFromNow) {
      return "expiring-soon-row";
    }
    return "";
  };

  const addInventoryToggle = async () => {
    setAddInventoryModal(!addInventoryModal);
    if (addInventoryModal) {
      await getAllInventoryItems();
    }
  };

  const deleteItemToggle = () => {
    setDeleteItemModal(!deleteItemModal);
  };

  const handleViewInventoryModal = (item) => {
    setSelectedItemToView(item);
    viewItemToggle();
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

  const fetchCategoryCounts = async () => {
    try {
      const data = await InventoryService.getInventoryCountByCategory(
        user?.homeID
      );

      const coloredData = data.map((item, index) => ({
        ...item,
        fill: colorPalette[index % colorPalette.length],
      }));

      setCategoryCounts(coloredData);
    } catch (error) {
      console.error("Error loading category data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, [user]);

  const getAllInventoryItems = async () => {
    try {
      setIsLoading(true);
      const data = await InventoryService.getAllInventoryItems(user?.homeID);
      setInventories(data || []);
      checkExpiryStatus(data || []);
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

  const colorPalette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d0743c",
    "#e377c2",
    "#17becf",
  ];

  const calculateCardHeight = () => {
    const rowHeight = 1.75;
    const headerHeight = 1.8;
    const totalRows = filteredInventories.length;
    const calculatedHeight = totalRows * rowHeight + headerHeight;
    setCardHeight(calculatedHeight);
  };

  useEffect(() => {
    calculateCardHeight();
  }, [filteredInventories]);

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
      <div className="inventory-category-section ms-2">
        <h5 className="ms-2 mb-2 fw-bold">{t("INVENTORY_CATEGORIES")}</h5>
        <div className="inventory-categories-container">
          {categoryCounts.map((category) => (
            <Card
              key={category.id}
              className="inventory-category-card"
              style={{ backgroundColor: "#ffffff" }}
            >
              <img
                src={
                  category.categoryImage
                    ? `http://localhost:3500${category.categoryImage}`
                    : DummyCategoryImage
                }
                alt={category.categoryName}
                className="inventory-category-image"
              />
              <div className="inventory-category-name">
                {category.categoryName}
              </div>
              <div className="inventory-category-item-count">
                {category.count}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card
        key="inventoryList"
        className="pt-3 ps-3 pe-3 pb-1 mt-3 ms-2 inventory-table-card"
        style={{ minHeight: cardHeight }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="ms-1 fw-bold">{t("INVENTORY_LIST")}</h5>
          <div className="d-flex align-items-center">
            <InputGroup className="me-3" style={{ width: "300px" }}>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t("SEARCH_INVENTORY_PLACEHOLDER")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
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
        </div>

        {/* Expired Items Alert Section */}
        <div className="mb-1 mt-2">
          {expiredItems.length > 0 ? (
            <Alert variant="danger" className="mb-0">
              <strong>⚠️ {t("EXPIRED_ITEMS_ALERT")}:</strong> {t("YOU_HAVE")}{" "}
              {expiredItems.length} {t("EXPIRED_ITEMS_COUNT")}
              <ul className="mb-0 mt-2">
                {expiredItems.map((item) => (
                  <li key={item._id}>
                    {item.itemName} ({t("EXPIRED_ON")}:{" "}
                    {new Date(item.expiryDate).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </Alert>
          ) : (
            <Alert variant="success" className="mb-0">
              {" "}
              {t("NO_EXPIRED_ITEMS")}
            </Alert>
          )}
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
              ) : filteredInventories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {searchTerm
                      ? t("NO_MATCHING_ITEMS")
                      : t("NO_INVENTORY_ITEMS_FOUND")}
                  </td>
                </tr>
              ) : (
                filteredInventories.map((item) => (
                  <tr key={item._id} className={getRowClass(item)}>
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
                          onClick={() => handleViewInventoryModal(item)}
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

      <Modal isOpen={viewItemModal} toggle={viewItemToggle} centered size="lg">
        <ModalHeader toggle={viewItemToggle} className="border-0">
          <h5 className="fw-bold mb-0">{t("INVENTORY_DETAILS")}</h5>
        </ModalHeader>

        <ModalBody>
          {selectedItemToView && (
            <div className="row">
              {/* Image Section */}
              <div className="col-md-4 mb-4 d-flex align-items-center justify-content-center">
                <div
                  className="rounded border bg-light"
                  style={{
                    width: "100%",
                    height: "250px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      selectedItemToView.categoryId?.category_image
                        ? `http://localhost:3500${selectedItemToView.categoryId?.category_image}`
                        : DummyCategoryImage
                    }
                    alt={selectedItemToView.itemName || "No image"}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="col-md-8">
                <div className="ps-md-3">
                  {/* Highlighted Item Name */}
                  <h3
                    className="fw-bold text-primary mb-3"
                    style={{ fontSize: "1.75rem" }}
                  >
                    {selectedItemToView.itemName}
                  </h3>

                  {/* Info Rows */}
                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("CATEGORY")}:{" "}
                    </span>
                    <span>
                      {selectedItemToView.categoryId?.category_name || "-"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("QUANTITY")}:{" "}
                    </span>
                    <span>{selectedItemToView.quantity || "-"}</span>
                  </div>

                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("ITEM_TYPE")}:{" "}
                    </span>
                    <span>{selectedItemToView.itemType || "-"}</span>
                  </div>

                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("EXPIRY_DATE")}:{" "}
                    </span>
                    <span>
                      {selectedItemToView.expiryDate
                        ? new Date(
                            selectedItemToView.expiryDate
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("SUPPLIER")}:{" "}
                    </span>
                    <span>
                      {selectedItemToView.supplierId?.supplier_name || "-"}
                    </span>
                  </div>

                  {selectedItemToView.description && (
                    <div className="mb-2">
                      <span className="fw-semibold text-muted">
                        {t("DESCRIPTION")}:{" "}
                      </span>
                      <span>{selectedItemToView.description}</span>
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="fw-semibold text-muted">
                      {t("LAST_UPDATED")}:{" "}
                    </span>
                    <span>
                      {new Date(selectedItemToView.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
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

      {/* Charts Section */}
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
              <BarChart
                data={inventories
                  .filter(
                    (item) =>
                      item.quantity !== undefined &&
                      item.lowStockLevel !== undefined
                  )
                  .map((item) => ({
                    name: item.itemName || t("UNNAMED_ITEM"),
                    existingLevel: item.quantity,
                    lowLevel: item.lowStockLevel,
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
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
                  {inventories
                    .filter((item) => item.quantity !== undefined)
                    .map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.quantity <= entry.lowStockLevel
                            ? "#FF0000"
                            : "#000000"
                        }
                      />
                    ))}
                </Bar>
                <Bar dataKey="lowLevel" fill="#BB87FA" name={t("LOW_LEVEL")} />
              </BarChart>
            </ResponsiveContainer>

            {inventories.some(
              (item) => item.quantity <= item.lowStockLevel
            ) && (
              <Alert variant="danger" className="mt-3 text-center">
                ⚠️ {t("YOU_MUST_RESTORE_ITEMS")}
              </Alert>
            )}
          </Card>
        </div>
      </ResponsiveGridLayout>
      <div style={{ height: "48px" }}></div>
    </div>
  );
};

export default Inventory;
