import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Session timeout duration set to 30 minutes
const TIMEOUT = 30 * 60 * 1000 // 30 min

export default function useSessionTimeout() {

    // Hook for page navigation
    const navigate = useNavigate()

    // Runs once when component loads
    useEffect(() => {

        let timer

        // Function to reset inactivity timer
        const resetTimer = () => {

            clearTimeout(timer)

            timer = setTimeout(logout, TIMEOUT)
        }

        // Function to log out user after timeout
        const logout = () => {

            // Remove token from local storage
            localStorage.removeItem("token")

            // Redirect user to login page
            navigate("/login")
        }

        // Detect mouse movement and reset timer
        window.addEventListener("mousemove", resetTimer)

        // Detect keyboard activity and reset timer
        window.addEventListener("keydown", resetTimer)

        // Start timer initially
        resetTimer()

        // Cleanup function when component unmounts
        return () => {

            clearTimeout(timer)
        }

    }, [])
}