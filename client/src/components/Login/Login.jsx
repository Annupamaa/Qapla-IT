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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      const response = await res.json();

      console.log("LOGIN RESPONSE 👉", response);

      if (!res.ok) {
        setError(response.message || "Login failed");
        return;
      }

      //  CLEAR OLD SESSION
      localStorage.clear();

      // FORCE PASSWORD CHANGE FLOW
      if (response.firstLogin) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("systemRole", response.systemRole || "");
        localStorage.setItem("subRole", response.subRole || "");
        localStorage.setItem("userType", response.userType || "");

        navigate("/change-password", { replace: true });
        return;
      }

      //SAVE AUTH SESSION (UPDATED)
      localStorage.setItem("token", response.token);
      localStorage.setItem("systemRole", response.systemRole || "");
      localStorage.setItem("subRole", response.subRole || "");
      localStorage.setItem("userType", response.userType || "");
      localStorage.setItem("username", response.username || username);

      //SAFE ROLE-BASED REDIRECT
      let redirectPath = response.redirectTo;

      if (!redirectPath) {
        switch (response.systemRole) {
          case "ADMIN":
            redirectPath = "/admin-dashboard";
            break;

          case "CRM_VENDOR":
            redirectPath = "/crm-vendor-dashboard";
            break;

          case "CRM_SOCIETY":
            redirectPath = "/crm-society-dashboard";
            break;

          case "VENDOR_USER":
            redirectPath = "/vendor/dashboard";
            break;

          case "SOCIETY_USER":
            redirectPath = "/society/dashboard";
            break;

          default:
            redirectPath = "/";
        }
      }

      console.log("REDIRECTING TO 👉", redirectPath); 

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

          <button
            type="button"
            className="forget-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forget Password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
