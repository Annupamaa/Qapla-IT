import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const updatePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const tempToken = localStorage.getItem("token");

      await axios.post(
        "/api/auth/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${tempToken}` } },
      );

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="pg-login-page">
      <div className="pg-login-box">
        <h2 className="pg-login-title">Change Password</h2>

        {error && <div className="pg-login-error">{error}</div>}

        <form onSubmit={updatePassword}>
          <div className="pg-form-group">
            <label className="pg-form-label">New Password</label>
            <input
              type="password"
              className="pg-form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="pg-form-group">
            <label className="pg-form-label">Confirm Password</label>
            <input
              type="password"
              className="pg-form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="pg-login-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
