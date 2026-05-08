import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { societiesAPI } from '../../services/api'

const SocietyList = () => {

  // State used for storing societies list data
  const [societies, setSocieties] = useState([])

  // State used for handling loading state
  const [loading, setLoading] = useState(true)

  // State used for storing error messages
  const [error, setError] = useState(null)

  // Hook used for navigation between routes
  const navigate = useNavigate()

  // Fetch societies data when component loads
  useEffect(() => {
    fetchSocieties()
  }, [])

  // Function used for fetching all societies
  const fetchSocieties = async () => {
    try {

      setLoading(true)

      const response = await societiesAPI.getAll()

      // Store fetched societies data
      setSocieties(response.data.data)

      // Clear previous errors
      setError(null)

    } catch (err) {

      // Display fetch error message
      setError(err.response?.data?.error || 'Failed to fetch societies')

    } finally {

      // Stop loading state
      setLoading(false)
    }
  }

  // Function used for deleting a society
  const handleDelete = async (id) => {

    // Display confirmation dialog before deleting
    if (!window.confirm('Are you sure you want to delete this society?')) {
      return
    }

    try {

      // API call used for deleting society
      await societiesAPI.delete(id)

      // Refresh society list after deletion
      fetchSocieties()

    } catch (err) {

      // Display delete error message
      alert(err.response?.data?.error || 'Failed to delete society')
    }
  }

  // Display loading message while fetching societies
  if (loading) {
    return <div className="loading">Loading societies...</div>
  }

  return (
    <div className="table-container">

      {/* Table Header Section */}
      <div className="table-header">

        <h2>Societies</h2>

        {/* Navigate to Create Society Page */}
        <button
          className="btn btn-primary"
          onClick={() => navigate('/societies/new')}
        >
          Add New Society
        </button>
      </div>

      {/* Display Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Display Empty State Message */}
      {societies.length === 0 ? (

        <p>No societies found. Create your first society!</p>

      ) : (

        /* Society Data Table */
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

            {/* Loop through societies list */}
            {societies.map((society) => (

              <tr key={society.id}>

                {/* Display Society ID */}
                <td>{society.id}</td>

                {/* Display Legal Name */}
                <td>{society.legal_name}</td>

                {/* Display Short Name */}
                <td>{society.short_name || '-'}</td>

                {/* Display Registration Number */}
                <td>{society.registration_number || '-'}</td>

                {/* Display Society Type */}
                <td>{society.society_type}</td>

                {/* Display City */}
                <td>{society.city || '-'}</td>

                {/* Display Society Status */}
                <td>{society.status}</td>

                {/* Action Buttons Section */}
                <td>

                  {/* Navigate to Edit Society Page */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/societies/edit/${society.id}`)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>

                  {/* Delete Society Button */}
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