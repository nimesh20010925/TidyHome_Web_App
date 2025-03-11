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
import SideBar from "./common/SideBar.jsx";

const MainLayout = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer />
      <NavBar/>
      <div className="d-flex flex-grow-1">
        <div className="flex-grow-1 p-3 mt-5">
          <Outlet />
        </div>
        <div className="mt-5">
        <SideBar />
        </div>
        
      </div>
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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
