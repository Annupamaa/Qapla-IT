import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Admin Dashboard</h2>
      </div>

      <p style={{marginBottom:"20px"}}>
        Welcome to Admin Panel. Select a module to manage the system.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))",
        gap:"20px"
      }}>
        
        <button className="btn btn-primary"
          onClick={() => navigate("/vendors")}
        >
          Manage Vendors
        </button>

        <button className="btn btn-primary"
          onClick={() => navigate("/vendor-users")}
        >
          Manage Vendor Users
        </button>

        <button className="btn btn-primary"
          onClick={() => navigate("/societies")}
        >
          Manage Societies
        </button>

        <button className="btn btn-primary"
          onClick={() => navigate("/society-users")}
        >
          Manage Society Users
        </button>

        <button className="btn btn-success"
          onClick={() => navigate("/crm-vendor")}
        >
          CRM Vendor Dashboard
        </button>

        <button className="btn btn-success"
          onClick={() => navigate("/crm-society")}
        >
          CRM Society Dashboard
        </button>

      </div>
    </div>
  );
};

export default Admin;
