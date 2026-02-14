import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

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

import "./App.css";

function AppLayout({ children }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/change-password" ||
    location.pathname === "/forgot-password";

  return <>{!isAuthPage && children}</>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          <header className="header">
            <h1>PartnerGrid</h1>
            <p style={{ textAlign: "center", marginTop: "10px", opacity: 0.9 }}>
              Vendor & Society Onboarding System
            </p>
          </header>

          <nav className="nav">
            <ul>
              <li>
                <NavLink
                  to="/vendors/register"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Register Vendor
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/vendors"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Vendors
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/vendor-users"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Vendor Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/societies"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Societies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/society-users"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Society Users
                </NavLink>
              </li>
            </ul>
          </nav>
        </AppLayout>

        <div className="container">
          <Routes>
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />

            {/* App Pages */}
            <Route path="/" element={<VendorList />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/register" element={<VendorRegistration />} />
            <Route path="/vendors/new" element={<VendorForm />} />
            <Route path="/vendors/edit/:id" element={<VendorForm />} />

            <Route path="/vendor-users" element={<VendorUserList />} />
            <Route path="/vendor-users/new" element={<VendorUserForm />} />
            <Route path="/vendor-dashboard/:vendorId" element={<VendorDashboard />} />
            <Route path="/vendor-users/edit/:id" element={<VendorUserForm />} />

            <Route path="/societies" element={<SocietyList />} />
            <Route path="/societies/new" element={<SocietyForm />} />
            <Route path="/societies/edit/:id" element={<SocietyForm />} />

            <Route path="/society-users" element={<SocietyUserList />} />
            <Route path="/society-users/new" element={<SocietyUserForm />} />
            <Route path="/society/dashboard" element={<SocietyUserProfile />} />
            <Route path="/vendor/dashboard" element={<VendorUserProfile />} />

            <Route path="/admin" element={<Admin />} />

            <Route path="/crm-vendor" element={<CrmVendor />} />
            <Route path="/crm-society" element={<CrmSociety />} />
            <Route
              path="/society-users/edit/:id"
              element={<SocietyUserForm />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
