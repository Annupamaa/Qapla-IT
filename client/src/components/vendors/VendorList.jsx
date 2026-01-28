import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorsAPI } from '../../services/api'

const VendorList = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await vendorsAPI.getAll()
      setVendors(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return
    }

    try {
      await vendorsAPI.delete(id)
      fetchVendors()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete vendor')
    }
  }

  if (loading) {
    return <div className="loading">Loading vendors...</div>
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Vendors</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={() => navigate('/vendors/register')}>
            ✨ Register New Vendor
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/vendors/new')}>
            Add New Vendor
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {vendors.length === 0 ? (
        <p>No vendors found. Create your first vendor!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Legal Name</th>
              <th>Trade Name</th>
              <th>Entity Type</th>
              <th>PAN</th>
              <th>GSTIN</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.legal_name}</td>
                <td>{vendor.trade_name || '-'}</td>
                <td>{vendor.entity_type}</td>
                <td>{vendor.pan || '-'}</td>
                <td>{vendor.gstin || '-'}</td>
                <td>{vendor.status}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(vendor.id)}
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

export default VendorList

