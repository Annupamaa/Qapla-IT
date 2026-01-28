import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { societyUsersAPI, societiesAPI } from '../../services/api'

const SocietyUserList = () => {
  const [users, setUsers] = useState([])
  const [societies, setSocieties] = useState([])
  const [selectedSociety, setSelectedSociety] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSocieties()
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [selectedSociety])

  const fetchSocieties = async () => {
    try {
      const response = await societiesAPI.getAll()
      setSocieties(response.data.data)
    } catch (err) {
      console.error('Failed to fetch societies:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await societyUsersAPI.getAll(selectedSociety || null)
      setUsers(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch society users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await societyUsersAPI.delete(id)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user')
    }
  }

  if (loading && users.length === 0) {
    return <div className="loading">Loading society users...</div>
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Society Users</h2>
        <button className="btn btn-primary" onClick={() => navigate('/society-users/new')}>
          Add New User
        </button>
      </div>

      <div className="form-group" style={{ marginBottom: '20px', maxWidth: '300px' }}>
        <label>Filter by Society</label>
        <select
          value={selectedSociety}
          onChange={(e) => setSelectedSociety(e.target.value)}
        >
          <option value="">All Societies</option>
          {societies.map((society) => (
            <option key={society.id} value={society.id}>
              {society.legal_name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <p>No society users found. Create your first user!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Society</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Authorized Signatory</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.society_name || '-'}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.mobile_country_code && user.mobile_number ? `${user.mobile_country_code} ${user.mobile_number}` : '-'}</td>
                <td>{user.role}</td>
                <td>{user.is_authorized_signatory ? 'Yes' : 'No'}</td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/society-users/edit/${user.id}`)}
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

export default SocietyUserList




