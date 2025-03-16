import "./App.css";
import "./languageConfig";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./common/NavBar";
import Footer from "./common/Footer";
import HomePage from "./components/Home/Home.jsx";
import InventoryPage from "./components/Inventory/Inventory.jsx";
import ShoppingListPage from "./components/ShoppingList/ShoppingList.jsx";
import ConsumptionHome from "./pages/consumption_home.jsx";
import { Toaster } from "react-hot-toast";
import SideBar from "./common/SideBar.jsx";
import SignUp from "./components/Login/SignUp.jsx";
import Login from "./components/Login/Login.jsx";
import CreateHome from "./components/Home/CreateHome.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPages/LandingPage.jsx";

const MainLayout = () => (
  <div className="d-flex flex-column vh-100">
    <NavBar />
    <div className="d-flex flex-grow-1">
      <div className="app-body flex-grow-1 p-3">
        <Outlet />
      </div>
      <div className="app-sidebar">
        <SideBar />
      </div>
    </div>
    <Footer />
  </div>
);

const AuthLayout = () => (
  <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
    <Outlet />
  </div>
);

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Landing Page as Default */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="create-home" element={<CreateHome />} />
        </Route>

        <Route
          path="/app"
          element={
            <ProtectedRoute allowedRoles={["homeOwner", "homeMember"]} />
          }
        >
          <Route element={<MainLayout />}>
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="shopping-list" element={<ShoppingListPage />} />
            <Route path="suppliers" element={<HomePage />} />
            <Route path="consumption_home" element={<ConsumptionHome />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
