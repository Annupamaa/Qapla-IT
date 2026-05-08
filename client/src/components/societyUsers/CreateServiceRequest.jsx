import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateServiceRequest = ({ editMode = false }) => {

    // Get society ID and request ID from URL parameters
    const { societyId, id } = useParams();

    // Hook used for navigation between routes
    const navigate = useNavigate();

    // State used for storing form input values
    const [formData, setFormData] = useState({
        priority: "",
        trigger: "",
        category: "",
        subCategory: "",
        summary: "",
        description: "",
        approximateValue: "",
    });

    // State used for storing priority dropdown data
    const [priorities, setPriorities] = useState([]);

    // State used for storing trigger dropdown data
    const [triggers, setTriggers] = useState([]);

    // State used for storing category dropdown data
    const [categories, setCategories] = useState([]);

    // State used for storing subcategory dropdown data
    const [subCategories, setSubCategories] = useState([]);

    // State used for storing approximate value dropdown data
    const [approximateValues, setApproximateValues] = useState([]);

    // Fetch dropdown data and request details on component load
    useEffect(() => {

        fetchDropdowns();

        // Fetch request details if edit mode is enabled
        if (editMode && id) {
            fetchRequestDetails();
        }

    }, [editMode, id]);

    // Function used for fetching all dropdown values
    const fetchDropdowns = async () => {
        try {

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Fetch all dropdown APIs simultaneously
            const [p, t, c, sc, av] = await Promise.all([
                axios.get("http://localhost:5001/api/dropdowns/priorities", config),
                axios.get("http://localhost:5001/api/dropdowns/triggers", config),
                axios.get("http://localhost:5001/api/dropdowns/categories", config),
                axios.get("http://localhost:5001/api/dropdowns/subcategories", config),
                axios.get(
                    "http://localhost:5001/api/dropdowns/approximate_values",
                    config,
                ),
            ]);

            // Store fetched dropdown data
            setPriorities(p.data);
            setTriggers(t.data);
            setCategories(c.data);
            setSubCategories(sc.data);
            setApproximateValues(av.data);

        } catch (error) {

            console.error("Failed to load dropdowns", error);
        }
    };

    // Function used for fetching existing request details
    const fetchRequestDetails = async () => {
        try {

            const token = localStorage.getItem("token");

            // API call used for fetching request details
            const res = await axios.get(
                `http://localhost:5001/api/service-requests/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            const data = res.data;

            // Set existing request data into form state
            setFormData({
                priority: data.priority_id,
                trigger: data.trigger_id,
                category: data.category_id,
                subCategory: data.subcategory_id,
                summary: data.summary,
                description: data.description,
                approximateValue: data.approximate_value_id,
            });

        } catch (error) {

            console.error("Failed to fetch request details", error);

            alert("Failed to load request details");
        }
    };

    // Function used for handling form input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Function used for creating or updating service request
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // Update existing request
            if (editMode && id) {

                await axios.put(
                    `http://localhost:5001/api/service-requests/${id}`,
                    {
                        status_id: 1,
                        priority_id: formData.priority,
                        trigger_id: formData.trigger,
                        category_id: formData.category,
                        subcategory_id: formData.subCategory,
                        approximate_value_id: formData.approximateValue,
                        summary: formData.summary,
                        description: formData.description,
                    },
                    config,
                );

                alert("Service Request Updated Successfully!");

            } else {

                // Create new request
                await axios.post(
                    "http://localhost:5001/api/service-requests",
                    {
                        society_id: societyId,
                        status_id: 1,
                        priority_id: formData.priority,
                        trigger_id: formData.trigger,
                        category_id: formData.category,
                        subcategory_id: formData.subCategory,
                        approximate_value_id: formData.approximateValue,
                        summary: formData.summary,
                        description: formData.description,
                    },
                    config,
                );

                alert("Service Request Created Successfully!");
            }

            // Redirect user to service request listing page
            navigate(`/service-requests/my`);

        } catch (error) {

            console.error("Error saving service request", error);

            alert("Failed to save service request");
        }
    };

    return (
        <div className="container">
            <div className="table-container">
                <div className="table-header">
                    <h2>
                        {editMode ? "Edit Service Request" : "Create Service Request"}
                    </h2>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/service-requests/my`)}
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            {priorities.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Trigger</label>
                        <select
                            name="trigger"
                            value={formData.trigger}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            {triggers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Sub Category</label>
                        <select
                            name="subCategory"
                            value={formData.subCategory}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            {subCategories.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                    {sc.label}
                                </option>
                            ))}
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
                            required
                        >
                            <option value="">Select</option>
                            {approximateValues.map((av) => (
                                <option key={av.id} value={av.id}>
                                    {av.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <button type="submit" className="btn btn-primary">
                            {editMode ? "Update" : "Submit"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(`/service-requests/my`)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateServiceRequest;
