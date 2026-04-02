import { useEffect, useState } from "react";
import axios from "axios";

const VendorWorkOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5001/api/vendors/work-orders",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOrders(res.data);

        } catch (err) {
            console.error(err);
            alert("Failed to load work orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const markCompleted = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5001/api/vendors/mark-completed",
                { work_order_id: id },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            fetchOrders();

        } catch (err) {
            alert("Failed to update");
        }
    };

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
                                        {new Date(o.issued_at).toLocaleString()}
                                    </td>

                                    <td>
                                        {o.status === "ISSUED" && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => markCompleted(o.id)}
                                            >
                                                Completed
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