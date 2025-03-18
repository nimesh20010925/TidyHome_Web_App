import { useEffect, useState } from "react";
import { ConsumptionService } from "../../../services/consumptionServices";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button } from "@mui/material";
import ViewModal from "../consumptionViewModel/consumptionViewModel";  
import EditModal from "../consumptionEditModel/consumptionEditModel";
import DeleteModal from "../consumptionDeleteModel/consumptionDeleteModel";

const ConsumptionTable = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
      setConsumptions((prevConsumptions) => prevConsumptions.filter((item) => item._id !== id));  
      setOpenDeleteModal(false);
    } catch {
      setError("Failed to delete data");
    }
  };

  let content;

  if (loading) {
    content = <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  } else if (error) {
    content = <Typography color="error" align="center">{error}</Typography>;
  } else {
    content = (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Product Name</strong></TableCell>
            <TableCell><strong>Amount Used</strong></TableCell>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Remaining Stock</strong></TableCell>
            <TableCell><strong>Notes</strong></TableCell>
            <TableCell><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consumptions.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.amount_used}</TableCell>
              <TableCell>{item.user}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>{item.remaining_stock}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleView(item)}
                  sx={{ marginRight: 1 }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => handleEdit(item)}
                  sx={{ marginRight: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedItem(item);
                    setOpenDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{
        maxWidth: "100%", 
        padding: "10px", 
        maxHeight: 350,  
        overflowY: "auto", 
      }}
    >
      <Typography variant="h6" sx={{ margin: "10px" }}>
        Consumption Records
      </Typography>
      {content}

      {/* View Modal */}
      <ViewModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        item={selectedItem}
      />

      {/* Edit Modal */}
      <EditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        item={selectedItem}
        onSave={handleSave}  // Pass the onSave function here
      />

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        item={selectedItem}
        onDelete={() => handleDelete(selectedItem._id)} // Call the delete function with the selected item's ID
      />
    </TableContainer>
  );
};

export default ConsumptionTable;