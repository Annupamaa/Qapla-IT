import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const updatePassword = () => {
        if (!newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div style={styles.container}>
            <h2>Change Password</h2>

            <input
                style={styles.input}
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
                style={styles.input}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button style={styles.button} onClick={updatePassword}>
                Update Password
            </button>

            <p style={styles.error}>{error}</p>
        </div>
    );
}

const styles = {
    container: {
        width: "300px",
        margin: "100px auto",
        padding: "30px",
        textAlign: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#2196F3",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
};

export default ChangePassword;
