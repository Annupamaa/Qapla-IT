import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorsAPI } from '../../services/api'
import './VendorRegistration.css'

const VendorRegistration = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    legal_name: '',
    trade_name: '',
    entity_type: 'COMPANY',
    
    // Step 2: Legal & Registration Details
    pan: '',
    gstin: '',
    msme_udyam_number: '',
    cin_llpin: '',
    shop_establishment_number: '',
    
    // Step 3: Address Information
    registered_address_line1: '',
    registered_address_line2: '',
    city: '',
    state: '',
    pincode: '',
    service_coverage_desc: '',
    
    // Step 4: Contact Information
    primary_contact_name: '',
    primary_contact_phone: '',
    primary_contact_email: '',
    secondary_contact_name: '',
    secondary_contact_phone: '',
    secondary_contact_email: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    operating_hours_text: '',
    
    // Step 5: Bank & Business Details
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
    status: 'DRAFT',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.legal_name.trim() !== '' && formData.entity_type !== ''
      case 2:
        return true // Legal details are optional
      case 3:
        return true // Address is optional
      case 4:
        return formData.primary_contact_name.trim() !== '' && 
               formData.primary_contact_email.trim() !== ''
      case 5:
        return true // Bank details are optional
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError(null)
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setError('Please fill in all required fields')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const submitData = { ...formData }
      // Convert empty strings to null for numeric fields
      if (!submitData.preferred_job_min_value) submitData.preferred_job_min_value = null
      if (!submitData.preferred_job_max_value) submitData.preferred_job_max_value = null
      if (!submitData.max_concurrent_jobs) submitData.max_concurrent_jobs = null
      if (!submitData.emergency_response_time_minutes) submitData.emergency_response_time_minutes = null

      await vendorsAPI.create(submitData)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/vendors')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register vendor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Legal Details' },
    { number: 3, title: 'Address' },
    { number: 4, title: 'Contact Info' },
    { number: 5, title: 'Bank & Business' },
  ]

  if (success) {
    return (
      <div className="registration-container">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>Your vendor registration has been submitted successfully.</p>
          <p>Redirecting to vendors list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>Vendor Registration</h1>
        <p>Complete the form below to register as a new vendor</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Legal Name *</label>
              <input
                type="text"
                name="legal_name"
                value={formData.legal_name}
                onChange={handleChange}
                required
                placeholder="Enter legal business name"
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
                  placeholder="Enter trade name (if different)"
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
                  <option value="">Select Entity Type</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="PROPRIETORSHIP">Proprietorship</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="COMPANY">Company</option>
                  <option value="LLP">LLP</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Legal & Registration Details */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Legal & Registration Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>PAN</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="e.g., ABCDE1234F"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="15-character GSTIN"
                  maxLength="15"
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
                  placeholder="MSME registration number"
                />
              </div>

              <div className="form-group">
                <label>CIN/LLPIN</label>
                <input
                  type="text"
                  name="cin_llpin"
                  value={formData.cin_llpin}
                  onChange={handleChange}
                  placeholder="Corporate Identity Number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Shop Establishment Number</label>
              <input
                type="text"
                name="shop_establishment_number"
                value={formData.shop_establishment_number}
                onChange={handleChange}
                placeholder="Shop establishment registration number"
              />
            </div>
          </div>
        )}

        {/* Step 3: Address Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Address Information</h2>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                name="registered_address_line1"
                value={formData.registered_address_line1}
                onChange={handleChange}
                placeholder="Street address, building name"
              />
            </div>

            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                name="registered_address_line2"
                value={formData.registered_address_line2}
                onChange={handleChange}
                placeholder="Area, locality"
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
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Coverage Description</label>
              <textarea
                name="service_coverage_desc"
                value={formData.service_coverage_desc}
                onChange={handleChange}
                placeholder="Describe the areas/services you cover"
                rows="4"
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact Information */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            
            <div className="contact-section">
              <h3>Primary Contact *</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="primary_contact_name"
                    value={formData.primary_contact_name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="primary_contact_phone"
                    value={formData.primary_contact_phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="primary_contact_email"
                    value={formData.primary_contact_email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="contact-section">
              <h3>Secondary Contact (Optional)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="secondary_contact_name"
                    value={formData.secondary_contact_name}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="secondary_contact_phone"
                    value={formData.secondary_contact_phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="secondary_contact_email"
                    value={formData.secondary_contact_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="contact-section">
              <h3>Emergency Contact</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Emergency contact person"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="24/7 emergency number"
                  />
                </div>

                <div className="form-group">
                  <label>Operating Hours</label>
                  <input
                    type="text"
                    name="operating_hours_text"
                    value={formData.operating_hours_text}
                    onChange={handleChange}
                    placeholder="e.g., Mon-Fri 9AM-6PM"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Bank & Business Details */}
        {currentStep === 5 && (
          <div className="form-step">
            <h2>Bank & Business Details</h2>
            
            <div className="contact-section">
              <h3>Bank Account Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    name="bank_account_name"
                    value={formData.bank_account_name}
                    onChange={handleChange}
                    placeholder="Account holder name"
                  />
                </div>

                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    placeholder="Bank account number"
                  />
                </div>

                <div className="form-group">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    name="bank_ifsc"
                    value={formData.bank_ifsc}
                    onChange={handleChange}
                    placeholder="11-character IFSC code"
                    maxLength="11"
                  />
                </div>
              </div>
            </div>

            <div className="contact-section">
              <h3>Business Preferences</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Risk Tier</label>
                  <select
                    name="risk_tier"
                    value={formData.risk_tier}
                    onChange={handleChange}
                  >
                    <option value="LIMITED">Limited</option>
                    <option value="STANDARD">Standard</option>
                    <option value="GOLD">Gold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Job Min Value (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="preferred_job_min_value"
                    value={formData.preferred_job_min_value}
                    onChange={handleChange}
                    placeholder="Minimum job value"
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Job Max Value (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="preferred_job_max_value"
                    value={formData.preferred_job_max_value}
                    onChange={handleChange}
                    placeholder="Maximum job value"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Concurrent Jobs</label>
                  <input
                    type="number"
                    name="max_concurrent_jobs"
                    value={formData.max_concurrent_jobs}
                    onChange={handleChange}
                    placeholder="Maximum jobs at once"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Response Time (minutes)</label>
                  <input
                    type="number"
                    name="emergency_response_time_minutes"
                    value={formData.emergency_response_time_minutes}
                    onChange={handleChange}
                    placeholder="Response time in minutes"
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
                    {' '}AMC (Annual Maintenance Contract) Offered
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={loading}
            >
              ← Previous
            </button>
          )}
          
          <div className="nav-spacer"></div>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default VendorRegistration




