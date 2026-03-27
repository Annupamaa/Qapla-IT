import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorServiceRequests = () => {

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get("/api/service-requests/published", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRequests(res.data);

        } catch (err) {
            console.error("Error fetching requests", err);
        }
    };

    const viewRequest = (id) => {
        navigate(`/vendor/request/${id}`);
    };

    return (
        <div className="table-container">

            <div className="table-header">
                <h2>Published Service Requests</h2>
            </div>

            <table>

                <thead>
                    <tr>
                        <th>Request No</th>
                        <th>Summary</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {requests.length > 0 ? (

                        requests.map((req) => (

                            <tr key={req.id}>
                                <td>{req.request_no}</td>
                                <td>{req.summary}</td>
                                <td>{req.category}</td>
                                <td>{req.priority}</td>

                                <td>

                                    {req.vendor_status === "quotation_sent" ? (
                                        <span className="status-badge sent">
                                            Quotation Sent
                                        </span>
                                    ) : (
                                        <span className="status-badge new">
                                            New
                                        </span>
                                    )}

                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => viewRequest(req.id)}
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="6" className="loading">
                                No published requests found
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default VendorServiceRequests;