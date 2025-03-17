import  { useEffect, useState } from "react";
import { ConsumptionService } from "../../../services/consumptionServices";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from "@mui/material";

const ConsumptionTable = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const data = await ConsumptionService.getAllConsumptions();
        setConsumptions(data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptions();
  }, []);

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "90%", margin: "20px auto", padding: "10px" }}>
      <Typography variant="h6" sx={{ margin: "10px" }}>
        Consumption Records
      </Typography>
      {content}
    </TableContainer>
  );
};

export default ConsumptionTable;