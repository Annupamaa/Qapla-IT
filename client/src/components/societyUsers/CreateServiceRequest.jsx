import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateServiceRequest = ({ editMode = false }) => {
  const { societyId, id } = useParams(); // id is only for edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    priority: "",
    trigger: "",
    category: "",
    subCategory: "",
    summary: "",
    description: "",
    approximateValue: "",
  });

  const [priorities, setPriorities] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [approximateValues, setApproximateValues] = useState([]);

  useEffect(() => {
    fetchDropdowns();

    if (editMode && id) {
      fetchRequestDetails();
    }
  }, [editMode, id]);

  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

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

      setPriorities(p.data);
      setTriggers(t.data);
      setCategories(c.data);
      setSubCategories(sc.data);
      setApproximateValues(av.data);
    } catch (error) {
      console.error("Failed to load dropdowns", error);
    }
  };

  const fetchRequestDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5001/api/service-requests/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = res.data;

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editMode && id) {
        // Update existing request
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
            status_id: 1, // NEW
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
