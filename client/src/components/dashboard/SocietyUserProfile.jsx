import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SocietyUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5001/api/society/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  if (error) return <div className="error-message">{error}</div>;

  if (!user) return <div className="loading">Profile not found</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Society User Profile</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate(`/society-users/edit/${user.id}`)}
        >
          Edit Profile
        </button>
      </div>

      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{user.id}</td>
          </tr>

          <tr>
            <th>Full Name</th>
            <td>{user.full_name}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>

          <tr>
            <th>Role</th>
            <td>{user.role}</td>
          </tr>

          <tr>
            <th>Mobile</th>
            <td>
              {user.mobile_country_code} {user.mobile_number || "-"}
            </td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{user.status || "Active"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SocietyUserProfile;
