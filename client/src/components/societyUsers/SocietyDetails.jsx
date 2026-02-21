import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { societiesAPI, societyUsersAPI } from "../../services/api";
import { jwtDecode } from "jwt-decode";

const SocietyDetails = () => {
    const navigate = useNavigate();

    const [society, setSociety] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const societyId = decoded.societyId;

            const societyRes = await societiesAPI.getById(societyId);
            const usersRes = await societyUsersAPI.getAll(societyId);

            setSociety(societyRes.data.data);
            setUsers(usersRes.data.data);
        } catch (err) {
            setError("Failed to load society dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return <div className="loading">Loading society dashboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            {/* Society Info Card */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Society Details</h2>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/societies/edit/${society.id}`)}
                        >
                            Edit Society
                        </button>
                    </div>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{society.legal_name}</td>
                        </tr>
                        <tr>
                            <th>Registration No</th>
                            <td>{society.registration_number || "-"}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{society.status}</td>
                        </tr>
                        <tr>
                            <th>City</th>
                            <td>{society.city}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Society Users */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Society Users</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/society-users/new")}
                    >
                        Add User
                    </button>
                </div>

                {users.length === 0 ? (
                    <p>No users found for this society</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Active</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.full_name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.is_active ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SocietyDetails;
