import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SocietyUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/society/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading profile...</h2>;
  if (!user) return <h2>Profile not found</h2>;

  return (
    <div className="society-dashboard">
      <header className="dashboard-header">
        <h1>Society User Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <div className="society-profile-card">
          <h2>My Profile</h2>

          <div className="profile-row">
            <span>Name</span>
            <p>{user.full_name}</p>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <p>{user.email}</p>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <p>{user.role}</p>
          </div>

          <div className="profile-row">
            <span>Mobile</span>
            <p>
              {user.mobile_country_code} {user.mobile_number || "N/A"}
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate(`/society-users/edit/${user.id}`)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocietyUserProfile;
