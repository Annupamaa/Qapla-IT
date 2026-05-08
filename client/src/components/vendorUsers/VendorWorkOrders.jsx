import { useEffect, useState } from "react";
import axios from "axios";

const VendorWorkOrders = () => {

    // State to store work orders data
    const [orders, setOrders] = useState([]);

    // State to handle loading status
    const [loading, setLoading] = useState(true);

    // Function to fetch work orders from API
    const fetchOrders = async () => {

        try {

            // Get token from local storage
            const token = localStorage.getItem("token");

            // API request to fetch work orders
            const res = await axios.get(
                "http://localhost:5001/api/vendors/work-orders",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Store fetched orders in state
            setOrders(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed to load work orders");

        } finally {

            // Stop loading after API call finishes
            setLoading(false);
        }
    };

    // Runs once when component loads
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to mark work order as completed
    const markCompleted = async (id) => {

        try {

            // Get token from local storage
            const token = localStorage.getItem("token");

            // API request to update work order status
            await axios.post(
                "http://localhost:5001/api/vendors/mark-completed",
                { work_order_id: id },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Refresh work orders list
            fetchOrders();

        } catch (err) {

            alert("Failed to update");
        }
    };

    // Function to send invoice for service request
    const sendInvoice = async (requestId) => {

        try {

            // Get token from local storage
            const token = localStorage.getItem("token");

            // API request to send invoice
            await axios.put(
                `http://localhost:5001/api/service-requests/${requestId}/send-invoice`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Refresh UI after invoice is sent
            fetchOrders();

        } catch (err) {

            alert("Failed to send invoice");
        }
    };

    // Function to return CSS class based on order status
    const getStatusClass = (status) => {

        if (status === "COMPLETED") return "status-badge sent";

        return "status-badge new";
    };

    return (
        <div className="container">

            <div className="table-container">

                <div className="table-header">
                    <h2>My Work Orders</h2>
                </div>

                {loading ? (
                    <div className="loading">Loading work orders...</div>
                ) : orders.length === 0 ? (
                    <div className="loading">No work orders assigned</div>
                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Request No</th>
                                <th>Summary</th>
                                <th>Status</th>
                                <th>Issued At</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {orders.map((o) => (

                                <tr key={o.id}>

                                    <td>{o.request_no}</td>
                                    <td>{o.summary}</td>

                                    <td>
                                        <span className={getStatusClass(o.status)}>
                                            {o.status}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(o.issued_at).toLocaleDateString()}
                                    </td>

                                    <td>

                                        {/* STEP 1: Complete Work */}
                                        {o.status === "ISSUED" && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => markCompleted(o.id)}
                                            >
                                                Completed
                                            </button>
                                        )}

                                        {/* STEP 2: Send Invoice */}
                                        {o.status === "COMPLETED" && o.request_status === "WOC" && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => sendInvoice(o.request_id)}
                                            >
                                                Send Invoice
                                            </button>
                                        )}

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

export default VendorWorkOrders;