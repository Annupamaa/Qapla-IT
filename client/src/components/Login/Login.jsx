import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      const response = await res.json();

      console.log("LOGIN RESPONSE 👉", response); // ⭐ DEBUG

      if (!res.ok) {
        setError(response.message || "Login failed");
        return;
      }

      // ✅ CLEAR OLD SESSION
      localStorage.clear();

      // ✅ FORCE PASSWORD CHANGE
      if (response.firstLogin) {
        localStorage.setItem("token", response.token);
        navigate("/change-password", { replace: true });
        return;
      }

      // ✅ SAVE AUTH
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role || "");
      localStorage.setItem("userType", response.userType || "");

      // ⭐⭐⭐ SAFE REDIRECT ⭐⭐⭐
      let redirectPath = response.redirectTo;

      // fallback protection (VERY IMPORTANT)
      if (!redirectPath) {

        if (response.userType === "vendor") {
          redirectPath = "/vendor/dashboard";
        } 
        else if (response.userType === "society") {
          redirectPath = "/society/dashboard";
        } 
        else if (response.role === "admin") {
          redirectPath = "/admin";
        } 
        else if (response.role === "crm_vendor") {
          redirectPath = "/crm-vendor";
        } 
        else if (response.role === "crm_society") {
          redirectPath = "/crm-society";
        } 
        else {
          redirectPath = "/";
        }
      }

      console.log("REDIRECTING TO 👉", redirectPath); // ⭐ DEBUG

      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
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

          <button 
            type="submit" 
            className="pg-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
