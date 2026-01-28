import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            // 🔹 MOCK API CALL (replace later)
            const response = { success: true };

            if (response.success) {
                setMessage("Password reset link sent to your email");
            }
        } catch (err) {
            setError("Failed to send reset link");
        }
    };

    return (
        <div className="pg-login-page">
            <div className="pg-login-box">
                <h2 className="pg-login-title">Forgot Password</h2>

                {error && <div className="pg-login-error">{error}</div>}

                {message && (
                    <div
                        className="pg-login-error"
                        style={{ backgroundColor: "#d4edda", color: "#155724" }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="pg-form-group">
                        <label className="pg-form-label">Email</label>
                        <input
                            type="email"
                            className="pg-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="pg-login-btn">
                        Send Reset Link
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
