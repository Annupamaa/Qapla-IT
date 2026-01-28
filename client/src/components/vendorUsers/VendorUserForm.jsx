import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vendorUsersAPI, vendorsAPI } from '../../services/api'

const VendorUserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [vendors, setVendors] = useState([])
  const [formData, setFormData] = useState({
    vendor_id: '',
    email: '',
    mobile_country_code: '+91',
    mobile_number: '',
    password: '',
    full_name: '',
    role: 'STAFF',
    is_primary_contact: false,
    is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVendors()
    if (isEdit) {
      fetchUser()
    }
  }, [id])

  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll()
      setVendors(response.data.data)
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await vendorUsersAPI.getById(id)
      const user = response.data.data
      setFormData({
        vendor_id: user.vendor_id,
        email: user.email,
        mobile_country_code: user.mobile_country_code || '+91',
        mobile_number: user.mobile_number || '',
        password: '', // Don't populate password
        full_name: user.full_name,
        role: user.role,
        is_primary_contact: user.is_primary_contact === 1,
        is_active: user.is_active === 1,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = { ...formData }
      // Only include password if it's provided (for updates)
      if (!submitData.password || submitData.password.trim() === '') {
        delete submitData.password
      }

      if (isEdit) {
        await vendorUsersAPI.update(id, submitData)
      } else {
        if (!submitData.password) {
          setError('Password is required for new users')
          setLoading(false)
          return
        }
        await vendorUsersAPI.create(submitData)
      }
      navigate('/vendor-users')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <div className="loading">Loading user...</div>
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Vendor User' : 'Create New Vendor User'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vendor *</label>
          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            required
            disabled={isEdit}
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.legal_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mobile Country Code</label>
            <input
              type="text"
              name="mobile_country_code"
              value={formData.mobile_country_code}
              onChange={handleChange}
              placeholder="+91"
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password {!isEdit && '*'}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
            placeholder={isEdit ? 'Leave blank to keep current password' : ''}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="OWNER">Owner</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_primary_contact"
                checked={formData.is_primary_contact}
                onChange={handleChange}
              />
              {' '}Primary Contact
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              {' '}Active
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/vendor-users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default VendorUserForm




