import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {

    // Hook used for navigation between routes
    const navigate = useNavigate();

    // State used for storing email input
    const [email, setEmail] = useState("");

    // State used for displaying success message
    const [message, setMessage] = useState("");

    // State used for displaying error messages
    const [error, setError] = useState("");

    // Function used for handling forgot password form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous messages
        setError("");
        setMessage("");

        // Validate email field
        if (!email) {
            setError("Email is required");
            return;
        }

        try {

            // Mock API response for password reset request
            const response = { success: true };

            // Display success message if request succeeds
            if (response.success) {
                setMessage("Password reset link sent to your email");
            }

        } catch (err) {

            // Display error message if request fails
            setError("Failed to send reset link");
        }
    };

    return (
        <div className="pg-login-page">

            {/* Forgot Password Form Container */}
            <div className="pg-login-box">

                {/* Page Title */}
                <h2 className="pg-login-title">Forgot Password</h2>

                {/* Display Error Message */}
                {error && <div className="pg-login-error">{error}</div>}

                {/* Display Success Message */}
                {message && (
                    <div
                        className="pg-login-error"
                        style={{ backgroundColor: "#d4edda", color: "#155724" }}
                    >
                        {message}
                    </div>
                )}

                {/* Forgot Password Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email Input Field */}
                    <div className="pg-form-group">
                        <label className="pg-form-label">Email</label>

                        <input
                            type="email"
                            className="pg-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Submit Button for Sending Reset Link */}
                    <button type="submit" className="pg-login-btn">
                        Send Reset Link
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;