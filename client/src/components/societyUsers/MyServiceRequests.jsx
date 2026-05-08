import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MyServiceRequests = () => {

  // State used for storing logged-in user's requests
  const [requests, setRequests] = useState([]);

  // State used for handling loading state
  const [loading, setLoading] = useState(true);

  // State used for storing error messages
  const [error, setError] = useState(null);

  // Hook used for navigation between routes
  const navigate = useNavigate();

  // Hook used for detecting route changes
  const location = useLocation();

  // Fetch requests whenever component loads or route changes
  useEffect(() => {
    fetchMyRequests();
  }, [location]);

  // Function used for fetching logged-in user's service requests
  const fetchMyRequests = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      // Validate authentication token
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }

      // API call used for fetching user's requests
      const res = await axios.get(
        "http://localhost:5001/api/service-requests/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Store fetched request data
      if (Array.isArray(res.data)) {

        setRequests(res.data);

      } else {

        setError("Unexpected response from server");
      }

    } catch (err) {

      // Display fetch error message
      setError(
        err.response?.data?.message || "Failed to fetch requests"
      );

    } finally {

      // Stop loading state
      setLoading(false);
    }
  };

  // Function used for navigating to edit request page
  const handleEdit = (id) => {

    navigate(`/service-requests/edit/${id}`);
  };

  // Display loading message while fetching requests
  if (loading) return <p>Loading your requests...</p>;

  // Display error message if request fetch fails
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">

      <div className="table-container">

        {/* Table Header Section */}
        <div className="table-header">

          <h2>My Requests</h2>

        </div>

        {/* Display empty state message */}
        {requests.length === 0 ? (

          <p>No requests created by you</p>

        ) : (

          /* Requests Table */
          <table>

            <thead>
              <tr>
                <th>Request No</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created By</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>

              {/* Loop through all requests */}
              {requests.map((r) => (

                <tr key={r.id}>

                  {/* Display Request Number */}
                  <td>{r.request_no}</td>

                  {/* Display Request Summary */}
                  <td>{r.summary}</td>

                  {/* Display Request Status */}
                  <td>{r.status}</td>

                  {/* Display Request Priority */}
                  <td>{r.priority}</td>

                  {/* Display Request Creator */}
                  <td>{r.created_by_name}</td>

                  {/* Edit Request Button */}
                  <td>

                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(r.id)}
                    >
                      Edit
                    </button>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyServiceRequests;