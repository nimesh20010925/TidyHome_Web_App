import React, { useState } from 'react';
import './store_table.css'; // Importing the CSS file

const SupplierTable = () => {
  // State for showing the add new supplier modal
  const [showModal, setShowModal] = useState(false);

  // State for showing the view details modal
  const [viewModal, setViewModal] = useState(false);

  // State for showing the delete confirmation modal
  const [deleteModal, setDeleteModal] = useState(false);

  // State for showing the edit supplier modal
  const [editModal, setEditModal] = useState(false); // New state for editing

  // State for form inputs
  const [supplierName, setSupplierName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // State for supplier list
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Mark Otto', contact: '123-456-7890', email: 'mark@example.com', address: '1234 Elm St, Springfield' },
    { id: 2, name: 'Jacob Thornton', contact: '987-654-3210', email: 'jacob@example.com', address: '5678 Oak St, Shelbyville' },
    { id: 3, name: 'Larry the Bird', contact: '555-123-4567', email: 'larry@example.com', address: '9101 Pine St, Capital City' }
  ]);

  // State for the selected supplier details (for viewing)
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // State for the supplier to delete
  const [selectedSupplierForDelete, setSelectedSupplierForDelete] = useState(null);

  // State for the supplier to edit
  const [selectedSupplierForEdit, setSelectedSupplierForEdit] = useState(null); // New state for editing supplier

  // Function to toggle the add new supplier modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to handle form submission (adding new supplier)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Create a new supplier object
    const newSupplier = {
      id: suppliers.length + 1,
      name: supplierName,
      contact: contact,
      email: email,
      address: address,
    };

    // Add the new supplier to the list
    setSuppliers([...suppliers, newSupplier]);

    // Reset form fields and close the modal
    setSupplierName('');
    setContact('');
    setEmail('');
    setAddress('');
    setShowModal(false);
  };

  // Function to open the view modal with the selected supplier details
  const viewSupplierDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setViewModal(true);
  };

  // Function to close the view modal
  const closeViewModal = () => {
    setViewModal(false);
  };

  // Function to open the delete confirmation modal
  const confirmDelete = (supplier) => {
    setSelectedSupplierForDelete(supplier);
    setDeleteModal(true);
  };

  // Function to handle deleting the supplier
  const handleDelete = () => {
    // Remove the supplier from the list
    setSuppliers(suppliers.filter(supplier => supplier.id !== selectedSupplierForDelete.id));
    setDeleteModal(false); // Close the delete confirmation modal
  };

  // Function to close the delete confirmation modal without deleting
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  // Function to handle opening the edit modal with the selected supplier's details
  const openEditModal = (supplier) => {
    setSelectedSupplierForEdit(supplier);
    setSupplierName(supplier.name);
    setContact(supplier.contact);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setEditModal(true); // Open edit modal
  };

  // Function to handle submitting the edited supplier details
  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Update the supplier in the list
    const updatedSuppliers = suppliers.map((supplier) => {
      if (supplier.id === selectedSupplierForEdit.id) {
        return {
          ...supplier,
          name: supplierName,
          contact: contact,
          email: email,
          address: address,
        };
      }
      return supplier;
    });

    // Update the suppliers state
    setSuppliers(updatedSuppliers);

    // Reset form fields and close the modal
    setSupplierName('');
    setContact('');
    setEmail('');
    setAddress('');
    setEditModal(false);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditModal(false);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <div className="div-button">
        <button className="btn btn-primary mb-3" onClick={toggleModal}>
          + Add New Supplier
        </button>
      </div>

      {/* Modal structure for adding a new supplier */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Supplier</h2>
            {/* Form for adding new supplier */}
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter Supplier Name"
                  required
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter Contact"
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-danger" onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal structure for viewing supplier details */}
      {viewModal && selectedSupplier && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Supplier Details</h2>
            <p><strong>Name:</strong> {selectedSupplier.name}</p>
            <p><strong>Contact:</strong> {selectedSupplier.contact}</p>
            <p><strong>Email:</strong> {selectedSupplier.email}</p>
            <p><strong>Address:</strong> {selectedSupplier.address}</p>
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal structure for delete confirmation */}
      {deleteModal && selectedSupplierForDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete this supplier?</h2>
            <p><strong>Name:</strong> {selectedSupplierForDelete.name}</p>
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal structure for editing supplier */}
      {editModal && selectedSupplierForEdit && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Supplier</h2>
            {/* Form for editing supplier */}
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter Supplier Name"
                  required
                />
              </div>
              <div>
                <label>Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter Contact"
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-danger" onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier table */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Supplier ID</th>
            <th scope="col">Name</th>
            <th scope="col">Contact</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.email}</td>
              <td>{supplier.address}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => viewSupplierDetails(supplier)}
                >
                  View
                </button>
                <button
                  className="btn btn-warning btn-sm ml-2"
                  onClick={() => openEditModal(supplier)} // Open edit modal
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => confirmDelete(supplier)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;
