import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { societyUsersAPI, societiesAPI } from '../../services/api'

const SocietyUserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [societies, setSocieties] = useState([])
  const [formData, setFormData] = useState({
    society_id: '',
    email: '',
    mobile_country_code: '+91',
    mobile_number: '',
    password: '',
    full_name: '',
    role: 'STAFF',
    term_start_date: '',
    term_end_date: '',
    is_authorized_signatory: false,
    approval_limit_amount: '',
    is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSocieties()
    if (isEdit) {
      fetchUser()
    }
  }, [id])

  const fetchSocieties = async () => {
    try {
      const response = await societiesAPI.getAll()
      setSocieties(response.data.data)
    } catch (err) {
      console.error('Failed to fetch societies:', err)
    }
  }

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await societyUsersAPI.getById(id)
      const user = response.data.data
      setFormData({
        society_id: user.society_id,
        email: user.email,
        mobile_country_code: user.mobile_country_code || '+91',
        mobile_number: user.mobile_number || '',
        password: '', // Don't populate password
        full_name: user.full_name,
        role: user.role,
        term_start_date: user.term_start_date ? user.term_start_date.split('T')[0] : '',
        term_end_date: user.term_end_date ? user.term_end_date.split('T')[0] : '',
        is_authorized_signatory: user.is_authorized_signatory === 1,
        approval_limit_amount: user.approval_limit_amount || '',
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

      // Convert empty strings to null for numeric fields
      if (!submitData.approval_limit_amount) submitData.approval_limit_amount = null

      if (isEdit) {
        await societyUsersAPI.update(id, submitData)
      } else {
        if (!submitData.password) {
          setError('Password is required for new users')
          setLoading(false)
          return
        }
        await societyUsersAPI.create(submitData)
      }
      navigate('/society-users')
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
      <h2>{isEdit ? 'Edit Society User' : 'Create New Society User'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Society *</label>
          <select
            name="society_id"
            value={formData.society_id}
            onChange={handleChange}
            required
            disabled={isEdit}
          >
            <option value="">Select Society</option>
            {societies.map((society) => (
              <option key={society.id} value={society.id}>
                {society.legal_name}
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
              <option value="CHAIRMAN">Chairman</option>
              <option value="SECRETARY">Secretary</option>
              <option value="TREASURER">Treasurer</option>
              <option value="MC_MEMBER">MC Member</option>
              <option value="PROPERTY_MANAGER">Property Manager</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="AUDITOR">Auditor</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Term Start Date</label>
            <input
              type="date"
              name="term_start_date"
              value={formData.term_start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Term End Date</label>
            <input
              type="date"
              name="term_end_date"
              value={formData.term_end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Approval Limit Amount</label>
          <input
            type="number"
            step="0.01"
            name="approval_limit_amount"
            value={formData.approval_limit_amount}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_authorized_signatory"
                checked={formData.is_authorized_signatory}
                onChange={handleChange}
              />
              {' '}Authorized Signatory
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
            onClick={() => navigate('/society-users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SocietyUserForm




