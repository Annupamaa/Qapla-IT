import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import VendorList from "./components/vendors/VendorList";
import VendorForm from "./components/vendors/VendorForm";
import VendorRegistration from "./components/vendors/VendorRegistration";
import VendorUserList from "./components/vendorUsers/VendorUserList";
import VendorUserForm from "./components/vendorUsers/VendorUserForm";
import SocietyList from "./components/societies/SocietyList";
import SocietyForm from "./components/societies/SocietyForm";
import SocietyUserList from "./components/societyUsers/SocietyUserList";
import SocietyUserForm from "./components/societyUsers/SocietyUserForm";
import Login from "./components/Login/Login";
import ChangePassword from "./components/Login/ChangePassword";
import ForgetPassword from "./components/Login/ForgetPassword";
import SocietyUserProfile from "./components/dashboard/SocietyUserProfile";
import VendorUserProfile from "./components/dashboard/VendorUserProfile";
import Admin from "./components/dashboard/Admin";
import CrmVendor from "./components/dashboard/CrmVendor";
import CrmSociety from "./components/dashboard/CrmSociety";
import VendorDashboard from "./components/vendorUsers/VendorDashboard";
import SocietyDashboard from "./components/societyUsers/SocietyDashboard";

import "./App.css";

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("systemRole");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/change-password" ||
    location.pathname === "/forgot-password";

  const handleLogout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return <>{!isAuthPage && children(handleLogout, role)}</>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          {(handleLogout, role) => (
            <>
              <header className="header">
                <h1>PartnerGrid</h1>
                <p style={{ textAlign: "center", marginTop: "10px", opacity: 0.9 }}>
                  Vendor & Society Onboarding System
                </p>
              </header>

              <nav className="nav">
                <ul>

                  {/* //----Admin-------- */}
                  {role === "ADMIN" && (
                    <>
                      <li><NavLink to="/vendors">Vendors</NavLink></li>
                      <li><NavLink to="/vendor-users">Vendor Users</NavLink></li>
                      <li><NavLink to="/societies">Societies</NavLink></li>
                      <li><NavLink to="/society-users">Society Users</NavLink></li>
                      <li><NavLink to="/admin-dashboard">Dashboard</NavLink></li>
                    </>
                  )}

                  {/* ===== CRM VENDOR ===== */}
                  {role === "CRM_VENDOR" && (
                    <>
                      <li><NavLink to="/vendors">Vendors</NavLink></li>
                      <li><NavLink to="/vendor-users">Vendor Users</NavLink></li>
                      <li><NavLink to="/crm-vendor-dashboard">Dashboard</NavLink></li>
                    </>
                  )}

                  {/* ===== CRM SOCIETY ===== */}
                  {role === "CRM_SOCIETY" && (
                    <>
                      <li><NavLink to="/societies">Societies</NavLink></li>
                      <li><NavLink to="/society-users">Society Users</NavLink></li>
                      <li><NavLink to="/crm-society-dashboard">Dashboard</NavLink></li>
                    </>
                  )}

                  {/* ===== VENDOR USER ===== */}
                  {role === "VENDOR_USER" && (
                    <li><NavLink to="/vendor/dashboard">Dashboard</NavLink></li>
                  )}

                  {/* ===== SOCIETY USER ===== */}
                  {role === "SOCIETY_USER" && (
                    <li><NavLink to="/society/dashboard">Dashboard</NavLink></li>
                  )}

                </ul>
              </nav>
            </>
          )}
        </AppLayout>

        <div className="container">
          <Routes>

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />

            {/* Vendors */}
            <Route path="/" element={<VendorList />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/register" element={<VendorRegistration />} />
            <Route path="/vendors/new" element={<VendorForm />} />
            <Route path="/vendors/edit/:id" element={<VendorForm />} />

            {/* Vendor Users */}
            <Route path="/vendor-users" element={<VendorUserList />} />
            <Route path="/vendor-users/new" element={<VendorUserForm />} />
            <Route path="/vendor-dashboard/:vendorId" element={<VendorDashboard />} />
            <Route path="/vendor-users/edit/:id" element={<VendorUserForm />} />

            {/* Societies */}
            <Route path="/societies" element={<SocietyList />} />
            <Route path="/societies/new" element={<SocietyForm />} />
            <Route path="/society-dashboard/:societyId" element={<SocietyDashboard />} />
            <Route path="/societies/edit/:id" element={<SocietyForm />} />

            {/* Society Users */}
            <Route path="/society-users" element={<SocietyUserList />} />
            <Route path="/society-users/new" element={<SocietyUserForm />} />
            <Route path="/society/dashboard" element={<SocietyUserProfile />} />

            {/* Dashboards */}
            <Route path="/vendor/dashboard" element={<VendorUserProfile />} />
            <Route path="/admin-dashboard" element={<Admin />} />
            <Route path="/crm-vendor-dashboard" element={<CrmVendor />} />
            <Route path="/crm-society-dashboard" element={<CrmSociety />} />

            <Route path="/society-users/edit/:id" element={<SocietyUserForm />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
