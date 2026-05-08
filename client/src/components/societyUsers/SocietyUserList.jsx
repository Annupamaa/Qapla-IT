import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { societyUsersAPI, societiesAPI } from "../../services/api";

const SocietyUserList = () => {

  // State used for storing society users list
  const [users, setUsers] = useState([]);

  // State used for storing societies list
  const [societies, setSocieties] = useState([]);

  // State used for storing selected society filter
  const [selectedSociety, setSelectedSociety] = useState("");

  // State used for handling loading state
  const [loading, setLoading] = useState(true);

  // State used for storing error messages
  const [error, setError] = useState(null);

  // Hook used for route navigation
  const navigate = useNavigate();

  // Fetch societies and users when component loads
  useEffect(() => {
    fetchSocieties();
    fetchUsers();
  }, []);

  // Fetch users whenever selected society changes
  useEffect(() => {
    fetchUsers();
  }, [selectedSociety]);

  // Function used for fetching societies list
  const fetchSocieties = async () => {
    try {

      // API call used for fetching societies
      const response = await societiesAPI.getAll();

      // Store societies data in state
      setSocieties(response.data.data);

    } catch (err) {

      console.error("Failed to fetch societies:", err);
    }
  };

  // Function used for fetching society users
  const fetchUsers = async () => {
    try {

      setLoading(true);

      // API call used for fetching users list
      const response = await societyUsersAPI.getAll(selectedSociety || null);

      // Store users data in state
      setUsers(response.data.data);

      // Clear previous errors
      setError(null);

    } catch (err) {

      // Display fetch error message
      setError(err.response?.data?.error || "Failed to fetch society users");

    } finally {

      // Stop loading state
      setLoading(false);
    }
  };

  // Function used for deleting a society user
  const handleDelete = async (id) => {

    // Display confirmation before deleting user
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {

      // API call used for deleting user
      await societyUsersAPI.delete(id);

      // Refresh users list after delete
      fetchUsers();

    } catch (err) {

      // Display delete error message
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  // Display loading message while fetching users
  if (loading && users.length === 0) {
    return <div className="loading">Loading society users...</div>;
  }

  return (
    <div className="table-container">

      <div className="table-header">

        <h2>Society Users</h2>

        {/* Navigate to create new society user page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/society-users/new")}
        >
          Add New User
        </button>
      </div>

      {/* Society Filter Dropdown */}
      <div
        className="form-group"
        style={{ marginBottom: "20px", maxWidth: "300px" }}
      >

        <label>Filter by Society</label>

        <select
          value={selectedSociety}
          onChange={(e) => setSelectedSociety(e.target.value)}
        >

          <option value="">All Societies</option>

          {/* Loop through societies list */}
          {societies.map((society) => (
            <option key={society.id} value={society.id}>
              {society.legal_name}
            </option>
          ))}
        </select>
      </div>

      {/* Display error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Display empty state if no users found */}
      {users.length === 0 ? (

        <p>No society users found. Create your first user!</p>

      ) : (

        /* Society Users Table */
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Society</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Authorized Signatory</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {/* Loop through society users */}
            {users.map((user) => (

              <tr key={user.id}>

                {/* Display User ID */}
                <td>{user.id}</td>

                {/* Display Society Name */}
                <td>{user.society_name || "-"}</td>

                {/* Display User Full Name */}
                <td>{user.full_name}</td>

                {/* Display User Email */}
                <td>{user.email}</td>

                {/* Display User Mobile Number */}
                <td>
                  {user.mobile_country_code && user.mobile_number
                    ? `${user.mobile_country_code} ${user.mobile_number}`
                    : "-"}
                </td>

                {/* Display User Role */}
                <td>{user.role}</td>

                {/* Display Authorized Signatory Status */}
                <td>{user.is_authorized_signatory ? "Yes" : "No"}</td>

                {/* Display Active Status */}
                <td>{user.is_active ? "Yes" : "No"}</td>

                {/* Action Buttons */}
                <td>

                  {/* Navigate to edit society user page */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      navigate(`/society-users/edit/${user.id}`);
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete society user */}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default SocietyUserList;