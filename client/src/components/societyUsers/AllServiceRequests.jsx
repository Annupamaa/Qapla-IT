import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AllServiceRequests = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNumber, setResolutionNumber] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetchRequests();
  }, [location]);

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
        }
      );

      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError("Unexpected response from server");
        console.error(res.data);
      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to fetch service requests"
      );

    } finally {

      setLoading(false);

    }

  };

  const systemRole = localStorage.getItem("systemRole");
  const subRole = localStorage.getItem("subRole");

  const isSecretary = subRole === "SECRETARY";

  const handleApprove = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();

    } catch (err) {

      alert("Failed to approve request");

    }

  };

  const handleCancel = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();

    } catch (err) {

      alert("Failed to cancel request");

    }

  };

  const handlePublish = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();

    } catch (err) {

      alert("Failed to publish request");

    }

  };

  const openResolutionModal = (id) => {

    setSelectedRequestId(id);
    setResolutionNumber("");
    setShowResolutionModal(true);

  };

  const submitResolution = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/service-requests/create-resolution",
        {
          request_id: selectedRequestId,
          resolution_number: resolutionNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowResolutionModal(false);

      fetchRequests();

    } catch (err) {

      alert("Failed to create resolution");

    }

  };

  const issueWorkOrder = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/service-requests/issue-work-order",
        {
          request_id: id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchRequests();

    } catch (err) {

      alert("Failed to issue work order");

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
                {isSecretary && <th>Actions</th>}

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

                  {isSecretary && (
                  <td>

                    {r.status_id === 1 && (

                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(r.id)}
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(r.id)}
                        >
                          Cancel
                        </button>
                      </>

                    )}

                    {r.status_id === 2 && (

                      <button
                        className="btn btn-primary"
                        onClick={() => handlePublish(r.id)}
                      >
                        Publish To Vendors
                      </button>

                    )}

                    {r.status_id === 4 && (

                      <button
                        className="btn btn-success"
                        onClick={() => openResolutionModal(r.id)}
                      >
                        Create Resolution
                      </button>

                    )}

                    {r.status_id === 5 && (

                      <button
                        className="btn btn-success"
                        onClick={() => issueWorkOrder(r.id)}
                      >
                        Issue Work Order
                      </button>

                    )}

                  </td>
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {showResolutionModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Create Resolution</h3>

            <input
              type="text"
              placeholder="Enter Resolution Number"
              value={resolutionNumber}
              onChange={(e) => setResolutionNumber(e.target.value)}
            />

            <div style={{ marginTop: "10px" }}>

              <button
                className="btn btn-success"
                onClick={submitResolution}
              >
                Submit
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowResolutionModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AllServiceRequests;