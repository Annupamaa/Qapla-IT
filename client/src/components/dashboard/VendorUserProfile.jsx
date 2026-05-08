import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VendorUserProfile = () => {

  // State used for storing logged-in vendor user profile data
  const [user, setUser] = useState(null);

  // State used for handling loading state while fetching data
  const [loading, setLoading] = useState(true);

  // State used for storing error messages
  const [error, setError] = useState(null);

  // Hook used for navigation between routes
  const navigate = useNavigate();

  // Fetch profile data when component loads
  useEffect(() => {
    fetchMyProfile();
  }, []);

  // Function used to fetch logged-in vendor user profile
  const fetchMyProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5001/api/vendor-users/me",
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

  // Display loading message while fetching profile data
  if (loading) return <div className="loading">Loading profile...</div>;

  // Display error message if API request fails
  if (error) return <div className="error-message">{error}</div>;

  // Display message if profile data is not found
  if (!user) return <div className="loading">Profile not found</div>;

  return (
    <div className="table-container">

      {/* Profile Header Section */}
      <div className="table-header">
        <h2>Vendor User Profile</h2>

        {/* Navigate to Edit Profile Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/vendor-users/edit/${user.id}`)}
        >
          Edit Profile
        </button>
      </div>

      {/* Table used for displaying vendor user profile details */}
      <table>
        <tbody>

          {/* Display User ID */}
          <tr>
            <th>ID</th>
            <td>{user.id}</td>
          </tr>

          {/* Display Full Name */}
          <tr>
            <th>Full Name</th>
            <td>{user.full_name}</td>
          </tr>

          {/* Display Email */}
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>

          {/* Display User Role */}
          <tr>
            <th>Role</th>
            <td>{user.role}</td>
          </tr>

          {/* Display Mobile Number */}
          <tr>
            <th>Mobile</th>
            <td>
              {user.mobile_country_code} {user.mobile_number || "-"}
            </td>
          </tr>

          {/* Display User Status */}
          <tr>
            <th>Status</th>
            <td>{user.status || "Active"}</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default VendorUserProfile;