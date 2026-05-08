import { useNavigate } from "react-router-dom";

const Admin = () => {

  // Hook used for programmatic navigation between routes
  const navigate = useNavigate();

  return (
    <div className="table-container">

      {/* Dashboard Header Section */}
      <div className="table-header">
        <h2>Admin Dashboard</h2>
      </div>

      {/* Dashboard Description */}
      <p style={{ marginBottom: "20px" }}>
        Welcome to Admin Panel. Select a module to manage the system.
      </p>

      {/* Grid Container for Dashboard Navigation Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
        }}
      >

        {/* Navigate to Vendors Management Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/vendors")}
        >
          Manage Vendors
        </button>

        {/* Navigate to Vendor Users Management Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/vendor-users")}
        >
          Manage Vendor Users
        </button>

        {/* Navigate to Societies Management Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/societies")}
        >
          Manage Societies
        </button>

        {/* Navigate to Society Users Management Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/society-users")}
        >
          Manage Society Users
        </button>

        {/* Navigate to CRM Vendor Dashboard */}
        <button
          className="btn btn-success"
          onClick={() => navigate("/crm-vendor-dashboard")}
        >
          CRM Vendor Dashboard
        </button>

        {/* Navigate to CRM Society Dashboard */}
        <button
          className="btn btn-success"
          onClick={() => navigate("/crm-society-dashboard")}
        >
          CRM Society Dashboard
        </button>

      </div>
    </div>
  );
};

export default Admin;