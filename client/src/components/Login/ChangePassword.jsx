import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const updatePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = { success: true };

            if (response.success) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (err) {
            setError("Failed to update password");
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
