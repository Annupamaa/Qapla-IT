import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { societiesAPI } from '../../services/api'

const SocietyForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    legal_name: '',
    short_name: '',
    registration_number: '',
    registration_date: '',
    registering_authority: '',
    society_type: 'FLAT_OWNERS',
    project_name: '',
    registered_address_line1: '',
    registered_address_line2: '',
    city: '',
    state: '',
    pincode: '',
    pan: '',
    gstin: '',
    tan: '',
    risk_tier: 'TIER_C',
    num_flats_units: '',
    num_towers_wings: '',
    annual_maintenance_budget_amount: '',
    payment_mode_preference: 'RECORD_ONLY',
    tender_threshold_amount: '100000',
    min_quotations_below_threshold: '3',
    emergency_approval_rules_json: '',
    status: 'DRAFT',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchSociety()
    }
  }, [id])

  const fetchSociety = async () => {
    try {
      setLoading(true)
      const response = await societiesAPI.getById(id)
      const society = response.data.data
      setFormData({
        ...society,
        registration_date: society.registration_date ? society.registration_date.split('T')[0] : '',
        emergency_approval_rules_json: society.emergency_approval_rules_json 
          ? JSON.stringify(society.emergency_approval_rules_json, null, 2) 
          : '',
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch society')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = { ...formData }
      
      // Parse JSON field
      if (submitData.emergency_approval_rules_json) {
        try {
          submitData.emergency_approval_rules_json = JSON.parse(submitData.emergency_approval_rules_json)
        } catch (err) {
          setError('Invalid JSON in Emergency Approval Rules')
          setLoading(false)
          return
        }
      } else {
        submitData.emergency_approval_rules_json = null
      }

      // Convert empty strings to null for numeric fields
      if (!submitData.num_flats_units) submitData.num_flats_units = null
      if (!submitData.num_towers_wings) submitData.num_towers_wings = null
      if (!submitData.annual_maintenance_budget_amount) submitData.annual_maintenance_budget_amount = null
      if (!submitData.tender_threshold_amount) submitData.tender_threshold_amount = null
      if (!submitData.min_quotations_below_threshold) submitData.min_quotations_below_threshold = null

      if (isEdit) {
        await societiesAPI.update(id, submitData)
      } else {
        await societiesAPI.create(submitData)
      }
      navigate('/societies')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save society')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <div className="loading">Loading society...</div>
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Society' : 'Create New Society'}</h2>

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
            <label>Short Name</label>
            <input
              type="text"
              name="short_name"
              value={formData.short_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Society Type *</label>
            <select
              name="society_type"
              value={formData.society_type}
              onChange={handleChange}
              required
            >
              <option value="FLAT_OWNERS">Flat Owners</option>
              <option value="PLOT_OWNERS">Plot Owners</option>
              <option value="MAINTENANCE_ONLY">Maintenance Only</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Registration Date</label>
            <input
              type="date"
              name="registration_date"
              value={formData.registration_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Registering Authority</label>
          <input
            type="text"
            name="registering_authority"
            value={formData.registering_authority}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
          />
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

          <div className="form-group">
            <label>TAN</label>
            <input
              type="text"
              name="tan"
              value={formData.tan}
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
              <option value="TIER_A">Tier A</option>
              <option value="TIER_B">Tier B</option>
              <option value="TIER_C">Tier C</option>
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
            <label>Number of Flats/Units</label>
            <input
              type="number"
              name="num_flats_units"
              value={formData.num_flats_units}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Number of Towers/Wings</label>
            <input
              type="number"
              name="num_towers_wings"
              value={formData.num_towers_wings}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Annual Maintenance Budget Amount</label>
          <input
            type="number"
            step="0.01"
            name="annual_maintenance_budget_amount"
            value={formData.annual_maintenance_budget_amount}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Payment Mode Preference</label>
            <select
              name="payment_mode_preference"
              value={formData.payment_mode_preference}
              onChange={handleChange}
            >
              <option value="DIRECT_VIA_PLATFORM">Direct Via Platform</option>
              <option value="RECORD_ONLY">Record Only</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tender Threshold Amount</label>
            <input
              type="number"
              step="0.01"
              name="tender_threshold_amount"
              value={formData.tender_threshold_amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Min Quotations Below Threshold</label>
            <input
              type="number"
              name="min_quotations_below_threshold"
              value={formData.min_quotations_below_threshold}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Emergency Approval Rules (JSON)</label>
          <textarea
            name="emergency_approval_rules_json"
            value={formData.emergency_approval_rules_json}
            onChange={handleChange}
            placeholder='{"key": "value"}'
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Society' : 'Create Society'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/societies')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SocietyForm




