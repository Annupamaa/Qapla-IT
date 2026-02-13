import { useNavigate } from "react-router-dom";

const CrmSociety = () => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>CRM Society Dashboard</h2>
      </div>

      <p style={{marginBottom:"20px"}}>
        Society-related modules are available here.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))",
        gap:"20px"
      }}>
        
        <button className="btn btn-primary"
          onClick={() => navigate("/societies")}
        >
          Societies
        </button>

        <button className="btn btn-primary"
          onClick={() => navigate("/society-users")}
        >
          Society Users
        </button>

      </div>
    </div>
  );
};

export default CrmSociety;
