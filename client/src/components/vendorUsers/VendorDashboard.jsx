import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vendorsAPI, vendorUsersAPI } from '../../services/api'

const VendorDashboard = () => {
    // Get vendorId from URL params
    const { vendorId } = useParams()

    // Hook for navigation between pages
    const navigate = useNavigate()

    // State to store vendor details
    const [vendor, setVendor] = useState(null)

    // State to store vendor users
    const [users, setUsers] = useState([])

    // State to handle loading status
    const [loading, setLoading] = useState(true)

    // State to store error message
    const [error, setError] = useState(null)

    // Runs whenever vendorId changes and fetches dashboard data
    useEffect(() => {
        fetchData()
    }, [vendorId])

    // Function to fetch vendor details and vendor users
    const fetchData = async () => {
        try {
            setLoading(true)

            const vendorRes = await vendorsAPI.getById(vendorId)
            const usersRes = await vendorUsersAPI.getAll(vendorId)

            setVendor(vendorRes.data.data)
            setUsers(usersRes.data.data)
        } catch (err) {
            setError('Failed to load vendor dashboard')
        } finally {
            setLoading(false)
        }
    }

    // Show loading message while fetching data
    if (loading) return <div className="loading">Loading vendor dashboard...</div>

    // Show error message if API fails
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="container">
            {/* Vendor Info Card */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Vendor Details</h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
                    >
                        Edit Vendor
                    </button>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>Legal Name</th>
                            <td>{vendor.legal_name}</td>
                        </tr>

                        <tr>
                            <th>Trade Name</th>
                            <td>{vendor.trade_name || '-'}</td>
                        </tr>

                        <tr>
                            <th>Entity Type</th>
                            <td>{vendor.entity_type}</td>
                        </tr>

                        <tr>
                            <th>Status</th>
                            <td>{vendor.status}</td>
                        </tr>

                        <tr>
                            <th>City</th>
                            <td>{vendor.city}</td>
                        </tr>

                        <tr>
                            <th>Primary Contact</th>
                            <td>{vendor.primary_contact_name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Vendor Users Section */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Vendor Users</h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/vendor-users/new')}
                    >
                        Add User
                    </button>
                </div>

                {users.length === 0 ? (
                    <p>No users found for this vendor</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.full_name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.is_active ? 'Yes' : 'No'}</td>

                                    <td>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate(`/vendor-users/edit/${u.id}`)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default VendorDashboard