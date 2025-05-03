import "react";
import PropTypes from "prop-types";

const ExportButtons = ({ onExportPDF, onExportCSV, disabled }) => {
  return (
    <div className="d-flex justify-content-end">
      <button
        className="btn btn-primary me-2 report-button"
        onClick={onExportPDF}
        disabled={disabled}
        style={{
          margin: "20px 10px",
          background: "linear-gradient(90deg, #007bff, #00aaff)",
          border: "none",
        }}
      >
        Export to PDF
      </button>
      <button
        className="btn btn-success report-button"
        onClick={onExportCSV}
        disabled={disabled}
        style={{
          margin: "20px 10px",
          background: "linear-gradient(90deg,rgb(0, 173, 69),rgb(0, 151, 93))",
          border: "none",
        }}
      >
        Export to CSV
      </button>
    </div>
  );
};
ExportButtons.propTypes = {
  onExportPDF: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ExportButtons;
