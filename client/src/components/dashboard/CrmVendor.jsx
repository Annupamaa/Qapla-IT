import { useNavigate } from "react-router-dom";

const CrmVendor = () => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>CRM Vendor Dashboard</h2>
      </div>

      <p style={{marginBottom:"20px"}}>
        Vendor-related modules are available here.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))",
        gap:"20px"
      }}>
        
        <button className="btn btn-primary"
          onClick={() => navigate("/vendors")}
        >
          Vendors
        </button>

        <button className="btn btn-primary"
          onClick={() => navigate("/vendor-users")}
        >
          Vendor Users
        </button>

      </div>
    </div>
  );
};

export default CrmVendor;

