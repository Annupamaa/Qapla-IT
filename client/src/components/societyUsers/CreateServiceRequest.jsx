import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CreateServiceRequest = () => {
    const { societyId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        requestNo: "AUTO_GEN",
        priority: "",
        trigger: "",
        category: "",
        subCategory: "",
        summary: "",
        description: "",
        approximateValue: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log("Submitting Service Request:", {
            ...formData,
            societyId
        })

        // 👉 Call your API here

        alert("Service Request Created Successfully!")

        // Redirect back to dashboard
        navigate(`/society-dashboard/${societyId}`)
    }

    return (
        <div className="container">
            <div className="table-container">
                <div className="table-header">
                    <h2>Create Service Request</h2>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/society-dashboard/${societyId}`)}
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Request No.</label>
                        <input
                            type="text"
                            value={formData.requestNo}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Trigger</label>
                        <select name="trigger" value={formData.trigger} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="complain">Complaint</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="new requirement">New Requirement</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="buy">Buy</option>
                            <option value="repair">Repair</option>
                            <option value="servicing">Servicing</option>
                            <option value="sell">Sell</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Sub Category</label>
                        <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="electrical">Electrical</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="toys">Toys</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Summary (100 char)</label>
                        <input
                            type="text"
                            name="summary"
                            maxLength="100"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (500 char)</label>
                        <textarea
                            name="description"
                            maxLength="500"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Approximate Value</label>
                        <select
                            name="approximateValue"
                            value={formData.approximateValue}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            <option value="less than 100000">Less than 100000</option>
                            <option value="more than 100000">More than 100000</option>
                        </select>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(`/society-dashboard/${societyId}`)}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateServiceRequest
