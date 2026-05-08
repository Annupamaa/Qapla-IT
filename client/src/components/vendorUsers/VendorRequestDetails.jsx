import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VendorRequestDetails = () => {

    // Get request ID from URL params
    const { id } = useParams();

    // Hook for navigation between pages
    const navigate = useNavigate();

    // State to store request details
    const [request, setRequest] = useState(null);

    // State to control first popup modal
    const [showModal, setShowModal] = useState(false);

    // State to control quotation method popup
    const [showMethodModal, setShowMethodModal] = useState(false);

    // State to store selected quotation method
    const [selectedMethod, setSelectedMethod] = useState("");

    // Runs once when component loads
    useEffect(() => {
        fetchRequest();
    }, []);

    // Function to fetch request details from API
    const fetchRequest = async () => {

        try {

            // Get token from local storage
            const token = localStorage.getItem("token");

            // API request to fetch service request details
            const res = await axios.get(`/api/service-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Store request data in state
            setRequest(res.data);

        } catch (err) {

            console.error(err);
        }

    };

    // Function to submit quotation with selected method
    const submitQuotation = async (method) => {

        try {

            // Get token from local storage
            const token = localStorage.getItem("token");

            // API request to submit quotation
            const res = await axios.post(
                "/api/vendor-requests/send-quotation",
                {
                    request_id: id,
                    sent_method: method
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(res.data);

            alert("Quotation submitted successfully");

            // Close both modals
            setShowMethodModal(false);
            setShowModal(false);

            // Reset selected method
            setSelectedMethod("");

        } catch (err) {

            console.error("Submission error:", err.response?.data || err.message);

            alert("Error submitting quotation");
        }

    };

    // Show loading message while request data is loading
    if (!request) return <div className="loading">Loading request...</div>;

    return (

        <div className="request-details-card">

            <h2 className="request-title">Service Request Details</h2>

            {/* Request Info */}
            <div className="request-section">

                {/* Contact */}
                <div className="request-section">

                    <h3>Society Contact</h3>

                    <div className="request-grid">
                        <div className="request-field">
                            <label>Society</label>
                            <span>{request.society_name}</span>
                        </div>

                        <div className="request-field">
                            <label>Contact Person</label>
                            <span>{request.contact_person}</span>
                        </div>

                        <div className="request-field">
                            <label>Phone</label>
                            <span>{request.phone}</span>
                        </div>

                        <div className="request-field">
                            <label>Email</label>
                            <span>{request.email}</span>
                        </div>
                    </div>

                </div>
                <br /> <br />

                <h3>Request Information</h3>



                <div className="request-grid">

                    {/* <div className="request-field">
                        <label>Request No</label>
                        <span>{request.request_no}</span>
                    </div>

                    <div className="request-field">
                        <label>Category</label>
                        <span>{request.category}</span>
                    </div> */}

                    <div className="request-field">
                        <label>Priority</label>
                        <span>{request.priority}</span>
                    </div>

                    <div className="request-field">
                        <label>Approx Value</label>
                        <span>₹ {request.approx_value}</span>
                    </div>

                </div>

            </div>

            {/* Summary */}
            <div className="request-section">

                <h3>Summary</h3>

                <div className="request-description">
                    {request.summary}
                </div>

            </div>

            {/* Description */}
            <div className="request-section">

                <h3>Description</h3>

                <div className="request-description">
                    {request.description}
                </div>

            </div>


            {/* Actions */}
            <div className="request-actions">

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                <button
                    className="btn btn-success"
                    onClick={() => setShowModal(true)}
                >
                    Send Quotation
                </button>

            </div>


            {/* POPUP 1 */}
            {showModal && (

                <div className="modal-overlay">

                    <div className="modal-card">

                        <h3 className="modal-title">Did you send the quotation?</h3>

                        <div className="modal-radio-group">

                            <button
                                className="modal-option yes"
                                onClick={() => {
                                    setShowModal(false);
                                    setShowMethodModal(true);
                                }}
                            >
                                Yes
                            </button>

                            <button
                                className="modal-option no"
                                onClick={() => setShowModal(false)}
                            >
                                No
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* POPUP 2 */}
            {showMethodModal && (

                <div className="modal-overlay">

                    <div className="modal-card">

                        <h3 className="modal-title">How did you send the quotation?</h3>

                        <div className="method-grid">

                            <button
                                className={`method-btn ${selectedMethod === "whatsapp" ? "active" : ""}`}
                                onClick={() => setSelectedMethod("whatsapp")}
                            >
                                WhatsApp
                            </button>

                            <button
                                className={`method-btn ${selectedMethod === "call" ? "active" : ""}`}
                                onClick={() => setSelectedMethod("call")}
                            >
                                Call
                            </button>

                            <button
                                className={`method-btn ${selectedMethod === "email" ? "active" : ""}`}
                                onClick={() => setSelectedMethod("email")}
                            >
                                Email
                            </button>

                            <button
                                className={`method-btn ${selectedMethod === "in_person" ? "active" : ""}`}
                                onClick={() => setSelectedMethod("in_person")}
                            >
                                In Person
                            </button>

                        </div>

                        <div className="modal-actions">

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowMethodModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={() => submitQuotation(selectedMethod)}
                                disabled={!selectedMethod}
                            >
                                Submit
                            </button>
                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default VendorRequestDetails;