import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AllServiceRequests = () => {

  // State used for storing service requests list
  const [requests, setRequests] = useState([]);

  // State used for handling loading state
  const [loading, setLoading] = useState(true);

  // State used for storing error messages
  const [error, setError] = useState(null);

  // State used for controlling resolution modal visibility
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  // State used for storing resolution number input
  const [resolutionNumber, setResolutionNumber] = useState("");

  // State used for storing selected request ID
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Hook used for tracking route changes
  const location = useLocation();

  // Fetch service requests when component loads or route changes
  useEffect(() => {
    fetchRequests();
  }, [location]);

  // Function used for fetching all society service requests
  const fetchRequests = async () => {
    try {

      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      // Validate authentication token
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }

      // API call used for fetching service requests
      const res = await axios.get(
        "http://localhost:5001/api/service-requests/society",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Store fetched requests data
      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError("Unexpected response from server");
        console.error(res.data);
      }

    } catch (err) {

      console.error(err);

      // Display fetch error message
      setError(
        err.response?.data?.message || "Failed to fetch service requests",
      );

    } finally {

      // Stop loading state
      setLoading(false);
    }
  };

  // Get logged-in user roles from local storage
  const systemRole = localStorage.getItem("systemRole");
  const subRole = localStorage.getItem("subRole");

  // Check if logged-in user is secretary
  const isSecretary = subRole === "SECRETARY";

  // Check if logged-in user is vendor
  const isVendor = systemRole === "VENDOR";

  // Function used for approving service request
  const handleApprove = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list after approval
      fetchRequests();

    } catch (err) {

      alert("Failed to approve request");
    }
  };

  // Function used for cancelling service request
  const handleCancel = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list after cancellation
      fetchRequests();

    } catch (err) {

      alert("Failed to cancel request");
    }
  };

  // Function used for publishing request to vendors
  const handlePublish = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list after publishing
      fetchRequests();

    } catch (err) {

      alert("Failed to publish request");
    }
  };

  // Function used for opening resolution creation modal
  const openResolutionModal = (id) => {

    setSelectedRequestId(id);
    setResolutionNumber("");
    setShowResolutionModal(true);
  };

  // Function used for submitting resolution details
  const submitResolution = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/service-requests/create-resolution",
        {
          request_id: selectedRequestId,
          resolution_number: resolutionNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Close modal after successful submission
      setShowResolutionModal(false);

      // Refresh requests list
      fetchRequests();

    } catch (err) {

      alert("Failed to create resolution");
    }
  };

  // Function used for issuing work order
  const issueWorkOrder = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/service-requests/issue-work-order",
        {
          request_id: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Refresh requests list after issuing work order
      fetchRequests();

    } catch (err) {

      alert("Failed to issue work order");
    }
  };

  // Function used for marking invoice as received
  const markInvoiceReceived = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/invoice-received`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list
      fetchRequests();

    } catch (err) {

      alert("Failed to mark invoice received");
    }
  };

  // Function used for marking payment as completed
  const markPaymentDone = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/payment-done`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list
      fetchRequests();

    } catch (err) {

      alert("Failed to mark payment");
    }
  };

  // Function used for marking receipt as received
  const markReceiptReceived = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/receipt-received`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list
      fetchRequests();

    } catch (err) {

      alert("Failed to mark receipt");
    }
  };

  // Function used for closing service request
  const closeRequest = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/service-requests/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh requests list
      fetchRequests();

    } catch (err) {

      alert("Failed to close request");
    }
  };

  // Display loading message while fetching requests
  if (loading) return <p>Loading service requests...</p>;

  // Display error message if request fetch fails
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
                {(isSecretary || isVendor) && <th>Actions</th>}
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
                      {r.status_code === "NEW" && (
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

                      {r.status_code === "APR" && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePublish(r.id)}
                        >
                          Publish To Vendors
                        </button>
                      )}

                      {r.status_code === "QUR" && (
                        <button
                          className="btn btn-success"
                          onClick={() => openResolutionModal(r.id)}
                        >
                          Create Resolution
                        </button>
                      )}

                      {r.status_code === "RSD" && (
                        <button
                          className="btn btn-success"
                          onClick={() => issueWorkOrder(r.id)}
                        >
                          Issue Work Order
                        </button>
                      )}

                      {(isSecretary || isVendor) && (
                        <td>

                          {/* VENDOR */}
                          {isVendor && r.status_code === "WOC" && (
                            <button
                              className="btn btn-primary"
                              onClick={() => sendInvoice(r.id)}
                            >
                              Send Invoice
                            </button>
                          )}

                          {/* SECRETARY */}
                          {isSecretary && r.status_code === "WOC" && (
                            <button
                              className="btn btn-success"
                              onClick={() => markInvoiceReceived(r.id)}
                            >
                              Invoice Received
                            </button>
                          )}

                          {isSecretary && r.status_code === "INV" && (
                            <button
                              className="btn btn-success"
                              onClick={() => markPaymentDone(r.id)}
                            >
                              Payment Done
                            </button>
                          )}

                          {isSecretary && r.status_code === "PAY" && (
                            <button
                              className="btn btn-success"
                              onClick={() => markReceiptReceived(r.id)}
                            >
                              Receipt Received
                            </button>
                          )}

                          {isSecretary && r.status_code === "REC" && (
                            <button
                              className="btn btn-dark"
                              onClick={() => closeRequest(r.id)}
                            >
                              Close Request
                            </button>
                          )}

                        </td>
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
              <button className="btn btn-success" onClick={submitResolution}>
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
