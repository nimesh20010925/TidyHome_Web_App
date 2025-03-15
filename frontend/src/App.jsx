import "./App.css";
import "./languageConfig";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./common/NavBar";
import Footer from "./common/Footer.jsx"
import HomePage from "./components/Home/Home.jsx";
import InventoryPage from "./components/Inventory/Inventory.jsx";
import ShoppingListPage from "./components/ShoppingList/ShoppingList.jsx";
import ConsumptionPage from "./components/ShoppingList/ShoppingList.jsx";
import { ToastContainer } from "react-toastify";
import SideBar from "./common/SideBar.jsx";
import SignUp from "./components/Login/SignUp.jsx";
import Login from "./components/Login/Login.jsx";
import CreateHome from "./components/Home/CreateHome.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";


const MainLayout = () => (
  <div className="d-flex flex-column vh-100">
    <ToastContainer />
    <NavBar />
    <div className="d-flex flex-grow-1">
      <div className="app-body flex-grow-1 p-3">
        <Outlet />
      </div>
      <div className="app-sidebar">
        <SideBar />
      </div>
      
    </div>
    <Footer/>
  </div>
);

// Separate layout for authentication pages (No NavBar, No SideBar)
const AuthLayout = () => (
  <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
    <ToastContainer />
    <Outlet />
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-home" element={<CreateHome />} />
          
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["homeOwner", "homeMember"]} />
          }
        >
          <Route path="/" element={<MainLayout />}>
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/suppliers" element={<HomePage />} />
            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
