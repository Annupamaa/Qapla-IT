import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  // Hook used for navigation between routes
  const navigate = useNavigate();

  // State used for storing username or email input
  const [username, setUsername] = useState("");

  // State used for storing password input
  const [password, setPassword] = useState("");

  // State used for displaying validation and API errors
  const [error, setError] = useState("");

  // State used for handling login button loading state
  const [loading, setLoading] = useState(false);

  // Function used for handling login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset previous error message
    setError("");

    // Validate required input fields
    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // API call used for user login
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

      // Convert API response into JSON format
      const response = await res.json();

      console.log("LOGIN RESPONSE 👉", response);

      // Handle login failure response
      if (!res.ok) {
        setError(response.message || "Login failed");
        return;
      }

      // Clear previous local storage session data
      localStorage.clear();

      // Handle first login password change flow
      if (response.firstLogin) {

        localStorage.setItem("token", response.token);
        localStorage.setItem("systemRole", response.systemRole || "");
        localStorage.setItem("subRole", response.subRole || "");
        localStorage.setItem("userType", response.userType || "");

        // Redirect user to change password page
        navigate("/change-password", { replace: true });

        return;
      }

      // Store authentication session data in local storage
      localStorage.setItem("token", response.token);
      localStorage.setItem("systemRole", response.systemRole || "");
      localStorage.setItem("subRole", response.subRole || "");
      localStorage.setItem("userType", response.userType || "");
      localStorage.setItem("username", response.username || username);

      // Store society ID if available
      if (response.societyId) {
        localStorage.setItem("societyId", response.societyId);
      }

      // Determine redirect path based on user role
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

      console.log("REDIRECTING TO", redirectPath);

      // Redirect user after successful login
      navigate(redirectPath, { replace: true });

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      // Display server error message
      setError("Server error. Try again later.");

    } finally {

      // Stop loading state after login request completes
      setLoading(false);
    }
  };

  return (
    <div className="pg-login-page">

      {/* Login Form Container */}
      <div className="pg-login-box">

        {/* Login Page Title */}
        <h2 className="pg-login-title">Login</h2>

        {/* Display Error Message */}
        {error && <div className="pg-login-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Username or Email Input Field */}
          <div className="pg-form-group">

            <label className="pg-form-label">Username / Email</label>

            <input
              type="text"
              className="pg-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input Field */}
          <div className="pg-form-group">

            <label className="pg-form-label">Password</label>

            <input
              type="password"
              className="pg-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button for Login */}
          <button
            type="submit"
            className="pg-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Navigate to Forgot Password Page */}
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