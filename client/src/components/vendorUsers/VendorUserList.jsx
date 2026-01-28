import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorUsersAPI, vendorsAPI } from '../../services/api'

const VendorUserList = () => {
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVendors()
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [selectedVendor])

  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll()
      setVendors(response.data.data)
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await vendorUsersAPI.getAll(selectedVendor || null)
      setUsers(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch vendor users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await vendorUsersAPI.delete(id)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user')
    }
  }

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




