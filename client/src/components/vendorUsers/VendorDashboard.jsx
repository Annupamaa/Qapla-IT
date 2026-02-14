import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vendorsAPI, vendorUsersAPI } from '../../services/api'

const VendorDashboard = () => {
    const { vendorId } = useParams()
    const navigate = useNavigate()

    const [vendor, setVendor] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [vendorId])

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

    if (loading) return <div className="loading">Loading vendor dashboard...</div>
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

            {/* Vendor Users */}
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
