import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const response = {
                success: true,
                firstLogin: true,
                token: "mock-jwt-token",
            };

            if (response.success) {
                localStorage.setItem("token", response.token);

                if (response.firstLogin) {
                    navigate("/change-password");
                } else {
                    navigate("/profile");
                }
            }
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="pg-login-page">
            <div className="pg-login-box">
                <h2 className="pg-login-title">Login</h2>

                {error && <div className="pg-login-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="pg-form-group">
                        <label className="pg-form-label">Username / Email</label>
                        <input
                            type="text"
                            className="pg-form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="pg-form-group">
                        <label className="pg-form-label">Password</label>
                        <input
                            type="password"
                            className="pg-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="pg-login-btn">
                        Login
                    </button>

                    <button type="button" className="forget-password">
                        Forget Password?
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
