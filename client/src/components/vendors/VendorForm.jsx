import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { vendorsAPI } from '../../services/api'

const VendorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    legal_name: '',
    trade_name: '',
    entity_type: 'COMPANY',
    pan: '',
    gstin: '',
    msme_udyam_number: '',
    cin_llpin: '',
    shop_establishment_number: '',
    registered_address_line1: '',
    registered_address_line2: '',
    city: '',
    state: '',
    pincode: '',
    service_coverage_desc: '',
    primary_contact_name: '',
    primary_contact_phone: '',
    primary_contact_email: '',
    secondary_contact_name: '',
    secondary_contact_phone: '',
    secondary_contact_email: '',
    operating_hours_text: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    risk_tier: 'LIMITED',
    preferred_job_min_value: '',
    preferred_job_max_value: '',
    max_concurrent_jobs: '',
    emergency_response_time_minutes: '',
    warranty_offered: false,
    amc_offered: false,
    average_rating: '',
    status: 'DRAFT',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchVendor()
    }
  }, [id])

  const fetchVendor = async () => {
    try {
      setLoading(true)
      const response = await vendorsAPI.getById(id)
      setFormData(response.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch vendor')
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
      // Convert empty strings to null for numeric fields
      const submitData = { ...formData }
      if (!submitData.preferred_job_min_value) submitData.preferred_job_min_value = null
      if (!submitData.preferred_job_max_value) submitData.preferred_job_max_value = null
      if (!submitData.max_concurrent_jobs) submitData.max_concurrent_jobs = null
      if (!submitData.emergency_response_time_minutes) submitData.emergency_response_time_minutes = null
      if (!submitData.average_rating) submitData.average_rating = null

      if (isEdit) {
        await vendorsAPI.update(id, submitData)
      } else {
        await vendorsAPI.create(submitData)
      }
      navigate('/vendors')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save vendor')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <div className="loading">Loading vendor...</div>
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Vendor' : 'Create New Vendor'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Legal Name *</label>
          <input
            type="text"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Trade Name</label>
            <input
              type="text"
              name="trade_name"
              value={formData.trade_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Entity Type *</label>
            <select
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              required
            >
              <option value="INDIVIDUAL">Individual</option>
              <option value="PROPRIETORSHIP">Proprietorship</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="COMPANY">Company</option>
              <option value="LLP">LLP</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>PAN</label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>GSTIN</label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>MSME Udyam Number</label>
            <input
              type="text"
              name="msme_udyam_number"
              value={formData.msme_udyam_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>CIN/LLPIN</label>
            <input
              type="text"
              name="cin_llpin"
              value={formData.cin_llpin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Registered Address Line 1</label>
          <input
            type="text"
            name="registered_address_line1"
            value={formData.registered_address_line1}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Registered Address Line 2</label>
          <input
            type="text"
            name="registered_address_line2"
            value={formData.registered_address_line2}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Service Coverage Description</label>
          <textarea
            name="service_coverage_desc"
            value={formData.service_coverage_desc}
            onChange={handleChange}
          />
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Primary Contact</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="primary_contact_name"
              value={formData.primary_contact_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="primary_contact_phone"
              value={formData.primary_contact_phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="primary_contact_email"
              value={formData.primary_contact_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Secondary Contact</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="secondary_contact_name"
              value={formData.secondary_contact_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="secondary_contact_phone"
              value={formData.secondary_contact_phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="secondary_contact_email"
              value={formData.secondary_contact_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Bank Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              name="bank_account_name"
              value={formData.bank_account_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>IFSC</label>
            <input
              type="text"
              name="bank_ifsc"
              value={formData.bank_ifsc}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Risk Tier</label>
            <select
              name="risk_tier"
              value={formData.risk_tier}
              onChange={handleChange}
            >
              <option value="GOLD">Gold</option>
              <option value="STANDARD">Standard</option>
              <option value="LIMITED">Limited</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Preferred Job Min Value</label>
            <input
              type="number"
              step="0.01"
              name="preferred_job_min_value"
              value={formData.preferred_job_min_value}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Preferred Job Max Value</label>
            <input
              type="number"
              step="0.01"
              name="preferred_job_max_value"
              value={formData.preferred_job_max_value}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="warranty_offered"
                checked={formData.warranty_offered}
                onChange={handleChange}
              />
              {' '}Warranty Offered
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="amc_offered"
                checked={formData.amc_offered}
                onChange={handleChange}
              />
              {' '}AMC Offered
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Vendor' : 'Create Vendor'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/vendors')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default VendorForm




