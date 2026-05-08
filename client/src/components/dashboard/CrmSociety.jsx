import { useNavigate } from "react-router-dom";

const CrmSociety = () => {

  // Hook used for navigation between routes
  const navigate = useNavigate();

  return (
    <div className="table-container">

      {/* Dashboard Header Section */}
      <div className="table-header">
        <h2>CRM Society Dashboard</h2>
      </div>

      {/* Dashboard Description */}
      <p style={{ marginBottom: "20px" }}>
        Society-related modules are available here.
      </p>

      {/* Grid Layout for Navigation Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
        }}
      >

        {/* Navigate to Societies Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/societies")}
        >
          Societies
        </button>

        {/* Navigate to Society Users Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/society-users")}
        >
          Society Users
        </button>

      </div>
    </div>
  );
};

export default CrmSociety;