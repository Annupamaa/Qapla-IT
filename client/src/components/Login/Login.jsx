import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PASSWORD = "default123";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (username && password === DEFAULT_PASSWORD) {
            navigate("/change-password");
        } else {
            setError("Invalid username/email or default password required");
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                fontFamily: "Segoe UI, sans-serif",
            }}
        >
            <div
                style={{
                    width: "360px",
                    padding: "32px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    borderRadius: "0px",          // perfectly square
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "24px",
                        color: "#2c3e50",
                    }}
                >
                    Login
                </h2>

                {error && (
                    <div
                        style={{
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            padding: "10px",
                            marginBottom: "15px",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                fontSize: "13px",
                                color: "#2c3e50",
                            }}
                        >
                            Username / Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: "100%",
                                height: "34px",
                                padding: "6px 8px",
                                fontSize: "13px",
                                border: "1px solid #ccc",
                                borderRadius: "2px",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                fontSize: "13px",
                                color: "#2c3e50",
                            }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                height: "34px",
                                padding: "6px 8px",
                                fontSize: "13px",
                                border: "1px solid #ccc",
                                borderRadius: "2px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            height: "36px",
                            backgroundColor: "#3498db",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
