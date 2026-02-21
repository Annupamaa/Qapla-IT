import { useEffect, useState } from "react";
import axios from "axios";

const AllServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5001/api/service-requests/society",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError("Unexpected response from server");
        console.error("Unexpected response:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch service requests. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading service requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <div className="table-container">
        <div className="table-header">
          <h2>All Service Requests</h2>
        </div>

        {requests.length === 0 ? (
          <p>No service requests found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Request No</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created By</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllServiceRequests;
