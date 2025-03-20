import  { useEffect, useState } from "react";
import {
  createCustomNotification,
  getAllCustomNotifications,
  deleteCustomNotification,
} from "../../services/customNotificationServices";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Box,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

const CustomNotification = () => {
  const [formData, setFormData] = useState({
    notification: "",
    notification_type: "",
    status: "",
    date: "",
    user: "",
    notification_action: "",
  });

  const [notifications, setNotifications] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomNotification(formData);
      setFormData({
        notification: "",
        notification_type: "",
        status: "",
        date: "",
        user: "",
        notification_action: "",
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await getAllCustomNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Create Custom Notification
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3} mb={6}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notification"
              name="notification"
              value={formData.notification}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notification Type"
              name="notification_type"
              value={formData.notification_type}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="User"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notification Action"
              name="notification_action"
              value={formData.notification_action}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large">
              Create Notification
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h5" mb={3} fontWeight="bold">
        All Notifications
      </Typography>

      <Grid container spacing={3}>
        {notifications.map((notif) => (
          <Grid item xs={12} md={6} lg={4} key={notif._id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography><strong>Notification:</strong> {notif.notification}</Typography>
                    <Typography><strong>Type:</strong> {notif.notification_type}</Typography>
                    <Typography><strong>Status:</strong> {notif.status}</Typography>
                    <Typography><strong>Date:</strong> {new Date(notif.date).toLocaleDateString()}</Typography>
                    <Typography><strong>User:</strong> {notif.user}</Typography>
                    <Typography><strong>Action:</strong> {notif.notification_action}</Typography>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(notif._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomNotification;