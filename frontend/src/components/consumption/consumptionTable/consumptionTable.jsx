// Frontend/src/components/ConsumptionTable.jsx
import { useEffect, useState } from "react";
import { ConsumptionService } from "../../../services/consumptionServices";
import ViewModal from "../consumptionViewModel/consumptionViewModel";
import EditModal from "../consumptionEditModel/consumptionEditModel";
import DeleteModal from "../consumptionDeleteModel/consumptionDeleteModel";
import "./ConsumptionTable.css";

const ConsumptionTable = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
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
        setConsumptions(data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchConsumptions();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...consumptions].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setConsumptions(sortedData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consumptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consumptions.length / itemsPerPage);

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
    setOpenEditModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await ConsumptionService.deleteConsumption(id);
      setConsumptions((prev) => prev.filter((item) => item._id !== id));
      setOpenDeleteModal(false);
    } catch {
      setError("Failed to delete data");
    }
  };

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
                    { label: "Home", key: "homeId" },
                    { label: "Date", key: "date" },
                    { label: "Remaining Stock", key: "remaining_stock" },
                    { label: "Notes", key: "notes" },
                    { label: "Action", key: "null" },
                  ].map((header) => (
                    <th
                      key={header.label}
                      scope="col"
                      onClick={() => header.key && handleSort(header.key)}
                      className={header.key ? "sortable" : ""}
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
                    <td data-label="Product Name">{item.product_name}</td>
                    <td data-label="Amount Used">{item.amount_used}</td>
                    <td data-label="Home">
                      {item.homeId?.homeName || "Unknown Home"}
                    </td>
                    <td data-label="Date">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td data-label="Remaining Stock">{item.remaining_stock}</td>
                    <td data-label="Notes">{item.notes}</td>
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
