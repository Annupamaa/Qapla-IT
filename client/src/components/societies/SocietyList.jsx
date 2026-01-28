import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { societiesAPI } from '../../services/api'

const SocietyList = () => {
  const [societies, setSocieties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSocieties()
  }, [])

  const fetchSocieties = async () => {
    try {
      setLoading(true)
      const response = await societiesAPI.getAll()
      setSocieties(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch societies')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this society?')) {
      return
    }

    try {
      await societiesAPI.delete(id)
      fetchSocieties()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete society')
    }
  }

  if (loading) {
    return <div className="loading">Loading societies...</div>
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Societies</h2>
        <button className="btn btn-primary" onClick={() => navigate('/societies/new')}>
          Add New Society
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {societies.length === 0 ? (
        <p>No societies found. Create your first society!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Legal Name</th>
              <th>Short Name</th>
              <th>Registration Number</th>
              <th>Society Type</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {societies.map((society) => (
              <tr key={society.id}>
                <td>{society.id}</td>
                <td>{society.legal_name}</td>
                <td>{society.short_name || '-'}</td>
                <td>{society.registration_number || '-'}</td>
                <td>{society.society_type}</td>
                <td>{society.city || '-'}</td>
                <td>{society.status}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/societies/edit/${society.id}`)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(society.id)}
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

export default SocietyList




