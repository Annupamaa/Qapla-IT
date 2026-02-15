import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const TIMEOUT = 30 * 60 * 1000 // 30 min

export default function useSessionTimeout() {
    const navigate = useNavigate()

    useEffect(() => {
        let timer

        const resetTimer = () => {
            clearTimeout(timer)
            timer = setTimeout(logout, TIMEOUT)
        }

        const logout = () => {
            localStorage.removeItem("token")
            navigate("/login")
        }

        window.addEventListener("mousemove", resetTimer)
        window.addEventListener("keydown", resetTimer)

        resetTimer()

        return () => {
            clearTimeout(timer)
        }
    }, [])
}
