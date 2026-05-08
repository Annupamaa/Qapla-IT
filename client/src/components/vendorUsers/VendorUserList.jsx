import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorUsersAPI, vendorsAPI } from '../../services/api'

const VendorUserList = () => {

  // State to store vendor users
  const [users, setUsers] = useState([])

  // State to store vendors list
  const [vendors, setVendors] = useState([])

  // State to store selected vendor filter
  const [selectedVendor, setSelectedVendor] = useState('')

  // State to handle loading status
  const [loading, setLoading] = useState(true)

  // State to store error messages
  const [error, setError] = useState(null)

  // Hook for page navigation
  const navigate = useNavigate()

  // Runs once when component loads
  useEffect(() => {
    fetchVendors()
    fetchUsers()
  }, [])

  // Runs whenever selected vendor changes
  useEffect(() => {
    fetchUsers()
  }, [selectedVendor])

  // Function to fetch all vendors
  const fetchVendors = async () => {
    try {

      const response = await vendorsAPI.getAll()

      setVendors(response.data.data)

    } catch (err) {

      console.error('Failed to fetch vendors:', err)
    }
  }

  // Function to fetch vendor users
  const fetchUsers = async () => {
    try {

      setLoading(true)

      const response = await vendorUsersAPI.getAll(selectedVendor || null)

      // Store users data in state
      setUsers(response.data.data)

      setError(null)

    } catch (err) {

      setError(err.response?.data?.error || 'Failed to fetch vendor users')

    } finally {

      setLoading(false)
    }
  }

  // Function to delete a vendor user
  const handleDelete = async (id) => {

    // Confirmation before deleting user
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {

      // API request to delete user
      await vendorUsersAPI.delete(id)

      // Refresh users list after deletion
      fetchUsers()

    } catch (err) {

      alert(err.response?.data?.error || 'Failed to delete user')
    }
  }

  // Show loading message while fetching users
  if (loading && users.length === 0) {
    return <div className="loading">Loading vendor users...</div>
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Vendor Users</h2>
        <button className="btn btn-primary" onClick={() => navigate('/vendor-users/new')}>
          Add New User
        </button>
      </div>

      <div className="form-group" style={{ marginBottom: '20px', maxWidth: '300px' }}>
        <label>Filter by Vendor</label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="">All Vendors</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.legal_name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <p>No vendor users found. Create your first user!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Primary Contact</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.vendor_name || '-'}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.mobile_country_code && user.mobile_number ? `${user.mobile_country_code} ${user.mobile_number}` : '-'}</td>
                <td>{user.role}</td>
                <td>{user.is_primary_contact ? 'Yes' : 'No'}</td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/vendor-users/edit/${user.id}`)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default VendorUserList




