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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const response = await res.json();

      if (!res.ok) {
        setError(response.message || "Login failed");
        return;
      }

      if (response.firstLogin) {
        localStorage.setItem("token", response.token);
        navigate("/change-password");
      } else {
        localStorage.setItem("token", response.token);
        navigate(response.redirectTo);
      }
    } catch (err) {
      setError("Server error. Try again later.");
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
        </form>
      </div>
    </div>
  );
}

export default Login;
