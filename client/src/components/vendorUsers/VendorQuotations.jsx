import { useEffect, useState } from "react";
import axios from "axios";

const VendorQuotations = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5001/api/vendors/quotations",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setData(res.data);

        } catch (err) {

            console.error(err);
            alert("Failed to load quotations");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusClass = (status) => {
        if (status === "WOI") return "status-badge sent";
        if (status === "WOC") return "status-badge sent";
        return "status-badge new";
    };

    return (

        <div className="container">

            <div className="table-container">

                <div className="table-header">
                    <h2>My Quotations</h2>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="loading">No quotations found</div>
                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Request No</th>
                                <th>Summary</th>
                                <th>Quotation Status</th>
                                <th>Request Status</th>
                                <th>Sent Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {data.map((item) => (

                                <tr key={item.quotation_id}>

                                    <td>{item.request_no}</td>
                                    <td>{item.summary}</td>

                                    <td>
                                        <span className="status-badge sent">
                                            {item.quotation_status}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={getStatusClass(item.request_status)}>
                                            {item.request_status}
                                        </span>
                                    </td>

                                    <td>
                                        {item.quo_send_date
                                            ? new Date(item.quo_send_date).toLocaleString()
                                            : "-"
                                        }
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

export default VendorQuotations;