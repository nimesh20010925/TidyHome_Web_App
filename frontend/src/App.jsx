import "./App.css";
import "./languageConfig";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./common/NavBar";
import HomePage from "./components/Home/Home.jsx";
import InventoryPage from "./components/Inventory/Inventory.jsx";
import ShoppingListPage from "./components/ShoppingList/ShoppingList.jsx";
import { ToastContainer } from "react-toastify";

import ConsumptionHome from "./pages/consumption_home.jsx";
import CustomNotification  from "./pages/custom_notification_home.jsx";
import Footer from "./common/Footer.jsx";


const MainLayout = () => {
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/inventory" element={<InventoryPage />} />
          
          <Route path="/home" element={<HomePage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/suppliers" element={<HomePage />} />
          <Route path="/consumption_home" element={<ConsumptionHome />} />
          <Route path="/custom_notification" element={<CustomNotification />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
