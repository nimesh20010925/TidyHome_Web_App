import { useEffect, useState } from "react";
import { ConsumptionService } from "../../../services/consumptionServices";
import ViewModal from "../consumptionViewModel/consumptionViewModel";
import EditModal from "../consumptionEditModel/consumptionEditModel";
import DeleteModal from "../consumptionDeleteModel/consumptionDeleteModel";
import { Form, InputGroup } from "react-bootstrap";
import "./ConsumptionTable.css";

const ConsumptionTable = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [filteredConsumptions, setFilteredConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    product_name: "",
    amount_used: "",
    item_type: "",
    date: "",
    remaining_stock: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.homeID) {
          setError("User does not belong to any home");
          setLoading(false);
          return;
        }
        const data = await ConsumptionService.getAllConsumptions(user.homeID);
        console.log("Fetched consumption data:", data); // Debug log
        setConsumptions(data);
        setFilteredConsumptions(data);
      } catch (err) {
        console.error("Error fetching consumptions:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchConsumptions();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...consumptions];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        [
          item.product_name?.toLowerCase(),
          item.item_type?.toLowerCase(),
          item.notes?.toLowerCase(),
        ].some((field) => field?.includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.product_name) {
      filtered = filtered.filter((item) =>
        item.product_name
          ?.toLowerCase()
          .includes(filters.product_name.toLowerCase())
      );
    }
    if (filters.amount_used) {
      filtered = filtered.filter(
        (item) => item.amount_used >= parseFloat(filters.amount_used)
      );
    }
    if (filters.item_type) {
      filtered = filtered.filter(
        (item) =>
          item.item_type?.toLowerCase() === filters.item_type.toLowerCase()
      );
    }
    if (filters.date) {
      filtered = filtered.filter(
        (item) => item.date.split("T")[0] === filters.date
      );
    }
    if (filters.remaining_stock) {
      filtered = filtered.filter(
        (item) => item.remaining_stock >= parseFloat(filters.remaining_stock)
      );
    }

    setFilteredConsumptions(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, filters, consumptions]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredConsumptions].sort((a, b) => {
      const aValue = a[key] || "";
      const bValue = b[key] || "";
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredConsumptions(sortedData);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsumptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredConsumptions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleSave = (editedItem) => {
    const updatedConsumptions = consumptions.map((item) =>
      item._id === editedItem._id ? editedItem : item
    );
    setConsumptions(updatedConsumptions);
    setFilteredConsumptions(updatedConsumptions);
    setOpenEditModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await ConsumptionService.deleteConsumption(id);
      const updatedConsumptions = consumptions.filter(
        (item) => item._id !== id
      );
      setConsumptions(updatedConsumptions);
      setFilteredConsumptions(updatedConsumptions);
      setOpenDeleteModal(false);
    } catch {
      setError("Failed to delete data");
    }
  };

  // Get unique values for filter dropdowns
  const uniqueProductNames = [
    ...new Set(consumptions.map((item) => item.product_name)),
  ];
  const uniqueItemTypes = [
    ...new Set(consumptions.map((item) => item.item_type).filter(Boolean)),
  ];

  const shouldScroll = currentItems.length > 4;

  let content;

  if (loading) {
    content = (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading data, please wait...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  } else {
    content = (
      <>
        {/* Search and Filter Section */}
        <div className="mb-4">
          <InputGroup className="mb-3">
            <InputGroup.Text>Search</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by product name, item type, or notes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <div className="d-flex flex-wrap gap-3">
            <Form.Group style={{ width: "200px" }}>
              <Form.Label>Product Name</Form.Label>
              <Form.Select
                name="product_name"
                value={filters.product_name}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {uniqueProductNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group style={{ width: "150px" }}>
              <Form.Label>Amount Used</Form.Label>
              <Form.Control
                type="number"
                name="amount_used"
                value={filters.amount_used}
                onChange={handleFilterChange}
                placeholder="Min amount"
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group style={{ width: "150px" }}>
              <Form.Label>Item Type</Form.Label>
              <Form.Select
                name="item_type"
                value={filters.item_type}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {uniqueItemTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group style={{ width: "150px" }}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group style={{ width: "150px" }}>
              <Form.Label>Remaining Stock</Form.Label>
              <Form.Control
                type="number"
                name="remaining_stock"
                value={filters.remaining_stock}
                onChange={handleFilterChange}
                placeholder="Min stock"
                min="0"
                step="0.01"
              />
            </Form.Group>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <div
            className="table-wrapper"
            style={
              shouldScroll ? { maxHeight: "550px", overflowY: "auto" } : {}
            }
          >
            <table className="table table-hover advanced-table">
              <thead className="table-dark">
                <tr>
                  {[
                    { label: "Product Name", key: "product_name" },
                    { label: "Amount Used", key: "amount_used" },
                    { label: "Item Type", key: "item_type" },
                    { label: "Home", key: "homeId" },
                    { label: "Date", key: "date" },
                    { label: "Remaining Stock", key: "remaining_stock" },
                    { label: "Notes", key: "notes" },
                    { label: "Action", key: null },
                  ].map((header) => (
                    <th
                      key={header.label}
                      scope="col"
                      onClick={() => header.key && handleSort(header.key)}
                      className={`${header.key ? "sortable" : ""} action`}
                    >
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span>
                          {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Product Name">
                      {item.product_name || "-"}
                    </td>
                    <td data-label="Amount Used">{item.amount_used || "-"}</td>
                    <td data-label="Item Type">{item.item_type || "-"}</td>
                    <td data-label="Home">
                      {item.homeId?.homeName || "Unknown Home"}
                    </td>
                    <td data-label="Date">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td data-label="Remaining Stock">
                      {item.remaining_stock || "-"}
                    </td>
                    <td data-label="Notes">{item.notes || "-"}</td>
                    <td data-label="Action">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm bt"
                          onClick={() => handleView(item)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm bt"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm bt"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <nav aria-label="Table pagination" className="mt-3">
            <ul className="pagination justify-content-center flex-wrap">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </>
    );
  }

  return (
    <div className="container-fluid py-1">
      {content}
      <ViewModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        item={selectedItem}
      />
      <EditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        item={selectedItem}
        onSave={handleSave}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        item={selectedItem}
        onDelete={() => handleDelete(selectedItem._id)}
      />
    </div>
  );
};

export default ConsumptionTable;
