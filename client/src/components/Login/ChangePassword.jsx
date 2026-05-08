import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {

  // Hook used for navigation between routes
  const navigate = useNavigate();

  // State used for storing new password input
  const [newPassword, setNewPassword] = useState("");

  // State used for storing confirm password input
  const [confirmPassword, setConfirmPassword] = useState("");

  // State used for storing validation and API errors
  const [error, setError] = useState("");

  // Check if token exists when component loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect user to login page if token is missing
    if (!token) navigate("/login");
  }, [navigate]);

  // Function used for updating user password
  const updatePassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate empty fields
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Validate minimum password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate password confirmation match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const tempToken = localStorage.getItem("token");

      // API call used for updating password
      await axios.post(
        "/api/auth/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${tempToken}` } },
      );

      // Remove token after password update
      localStorage.removeItem("token");

      // Redirect user to login page
      navigate("/login");

    } catch (err) {

      // Display API error message
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="pg-login-page">

      {/* Password Change Form Container */}
      <div className="pg-login-box">

        {/* Page Title */}
        <h2 className="pg-login-title">Change Password</h2>

        {/* Display Error Message */}
        {error && <div className="pg-login-error">{error}</div>}

        {/* Password Change Form */}
        <form onSubmit={updatePassword}>

          {/* New Password Input Field */}
          <div className="pg-form-group">
            <label className="pg-form-label">New Password</label>

            <input
              type="password"
              className="pg-form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input Field */}
          <div className="pg-form-group">
            <label className="pg-form-label">Confirm Password</label>

            <input
              type="password"
              className="pg-form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button for Updating Password */}
          <button type="submit" className="pg-login-btn">
            Update Password
          </button>

        </form>
      </div>
    </div>
  );
}

export default ChangePassword;