import { useEffect, useState } from "react";
import { ConsumptionService } from "../../../services/consumptionServices";
import ViewModal from "../consumptionViewModel/consumptionViewModel";
import EditModal from "../consumptionEditModel/consumptionEditModel";
import DeleteModal from "../consumptionDeleteModel/consumptionDeleteModel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Explicit import
import { saveAs } from "file-saver";
import logo from "../../../assets/logo/TidyHome_Logo.png";
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
        const data = await ConsumptionService.getAllConsumptions();
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Get page width for centering calculations
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add logo (centered)
    const logoWidth = 20;
    const logoHeight = 17;
    const logoXOffset = (pageWidth - logoWidth) / 2; // Center the logo
    doc.addImage(logo, "PNG", logoXOffset, 10, logoWidth, logoHeight);

    // Add title (centered)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = "Consumption Report";
    const titleWidth = doc.getTextWidth(title);
    const titleXOffset = (pageWidth - titleWidth) / 2;
    doc.text(title, titleXOffset, 40);

    // Add report details (centered)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const generatedOn = `Generated on: ${new Date().toLocaleDateString()}`;
    const totalRecords = `Total Records: ${consumptions.length}`;
    const generatedOnWidth = doc.getTextWidth(generatedOn);
    const totalRecordsWidth = doc.getTextWidth(totalRecords);
    const generatedOnXOffset = (pageWidth - generatedOnWidth) / 2;
    const totalRecordsXOffset = (pageWidth - totalRecordsWidth) / 2;
    doc.text(generatedOn, generatedOnXOffset, 50);
    doc.text(totalRecords, totalRecordsXOffset, 60);

    // Define table columns
    const tableColumns = [
      "Product Name",
      "Amount Used",
      "User",
      "Date",
      "Remaining Stock",
      "Notes",
    ];
    const tableRows = consumptions.map((item) => [
      item.product_name,
      item.amount_used,
      item.user?.name || "Unknown User",
      new Date(item.date).toLocaleDateString(),
      item.remaining_stock,
      item.notes,
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 70,
      theme: "grid",
      headStyles: { fillColor: [33, 37, 41], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        "Generated by xAI Consumption Management",
        10,
        doc.internal.pageSize.height - 10
      );
    }

    // Save PDF
    doc.save("Consumption_Report.pdf");
  };

  const generateCSV = () => {
    const headers = [
      "Product Name",
      "Amount Used",
      "User",
      "Date",
      "Remaining Stock",
      "Notes",
    ];
    const rows = consumptions.map((item) => [
      `"${item.product_name}"`,
      item.amount_used,
      `"${item.user?.name || "Unknown User"}"`,
      new Date(item.date).toLocaleDateString(),
      item.remaining_stock,
      `"${item.notes}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Consumption_Report.csv");
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
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={generatePDF}
            disabled={consumptions.length === 0}
          >
            Export to PDF
          </button>
          <button
            className="btn btn-success"
            onClick={generateCSV}
            disabled={consumptions.length === 0}
          >
            Export to CSV
          </button>
        </div>
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
                    { label: "User", key: "user" },
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
                    <td data-label="User">
                      {item.user?.name || "Unknown User"}
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
