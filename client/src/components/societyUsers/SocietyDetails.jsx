import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { societiesAPI, societyUsersAPI } from "../../services/api";
import { jwtDecode } from "jwt-decode";

const SocietyDetails = () => {

    // Hook used for navigation between routes
    const navigate = useNavigate();

    // State used for storing society details
    const [society, setSociety] = useState(null);

    // State used for storing society users list
    const [users, setUsers] = useState([]);

    // State used for handling loading state
    const [loading, setLoading] = useState(true);

    // State used for storing error messages
    const [error, setError] = useState(null);

    // Fetch society details and users when component loads
    useEffect(() => {
        fetchData();
    }, []);

    // Function used for fetching society details and society users
    const fetchData = async () => {
        try {

            setLoading(true);

            // Get authentication token from local storage
            const token = localStorage.getItem("token");

            // Decode token to extract society ID
            const decoded = jwtDecode(token);

            const societyId = decoded.societyId;

            // API call used for fetching society details
            const societyRes = await societiesAPI.getById(societyId);

            // API call used for fetching society users
            const usersRes = await societyUsersAPI.getAll(societyId);

            // Store fetched society details
            setSociety(societyRes.data.data);

            // Store fetched users list
            setUsers(usersRes.data.data);

        } catch (err) {

            // Display fetch error message
            setError("Failed to load society dashboard");

        } finally {

            // Stop loading state
            setLoading(false);
        }
    };

    // Display loading message while fetching dashboard data
    if (loading)
        return <div className="loading">Loading society dashboard...</div>;

    // Display error message if fetch fails
    if (error)
        return <div className="error-message">{error}</div>;

    return (
        <div className="container">

            {/* Society Information Section */}
            <div className="table-container">

                <div className="table-header">

                    <h2>Society Details</h2>

                    <div style={{ display: "flex", gap: "10px" }}>

                        {/* Navigate to Edit Society Page */}
                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(`/societies/edit/${society.id}`)
                            }
                        >
                            Edit Society
                        </button>

                    </div>
                </div>

                {/* Society Details Table */}
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

            {/* Society Users Section */}
            <div className="table-container">

                <div className="table-header">

                    <h2>Society Users</h2>

                    {/* Navigate to Add Society User Page */}
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/society-users/new")}
                    >
                        Add User
                    </button>
                </div>

                {/* Display Empty State Message */}
                {users.length === 0 ? (

                    <p>No users found for this society</p>

                ) : (

                    /* Society Users Table */
                    <table>

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Active</th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* Loop through society users list */}
                            {users.map((u) => (

                                <tr key={u.id}>

                                    {/* Display User Name */}
                                    <td>{u.full_name}</td>

                                    {/* Display User Email */}
                                    <td>{u.email}</td>

                                    {/* Display User Role */}
                                    <td>{u.role}</td>

                                    {/* Display User Active Status */}
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