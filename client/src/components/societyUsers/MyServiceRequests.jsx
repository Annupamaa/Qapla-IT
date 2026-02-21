import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MyServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    fetchMyRequests();
  }, [location]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5001/api/service-requests/my",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/service-requests/edit/${id}`);
  };

  if (loading) return <p>Loading your requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <div className="table-container">
        <div className="table-header">
          <h2>My Requests</h2>
        </div>

        {requests.length === 0 ? (
          <p>No requests created by you</p>
        ) : (
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
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.request_no}</td>
                  <td>{r.summary}</td>
                  <td>{r.status}</td>
                  <td>{r.priority}</td>
                  <td>{r.created_by_name}</td>
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
