import { useNavigate } from "react-router-dom";

const CrmVendor = () => {

  // Hook used for navigation between routes
  const navigate = useNavigate();

  return (
    <div className="table-container">

      {/* Dashboard Header Section */}
      <div className="table-header">
        <h2>CRM Vendor Dashboard</h2>
      </div>

      {/* Dashboard Description */}
      <p style={{ marginBottom: "20px" }}>
        Vendor-related modules are available here.
      </p>

      {/* Grid Layout for Navigation Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
        }}
      >

        {/* Navigate to Vendors Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/vendors")}
        >
          Vendors
        </button>

        {/* Navigate to Vendor Users Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/vendor-users")}
        >
          Vendor Users
        </button>

      </div>
    </div>
  );
};

export default CrmVendor;