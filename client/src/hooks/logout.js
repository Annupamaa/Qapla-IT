// Function to log out the current user
export function logout(navigate) {

    // Remove authentication token from local storage
    localStorage.removeItem("token")

    // Remove user data from local storage
    localStorage.removeItem("user")

    // Redirect user to login page
    navigate("/login")
}