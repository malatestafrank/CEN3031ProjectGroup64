import { useState } from "react"
import { useAuthContext } from './useAuthContext'
import { useNavigate } from "react-router-dom"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const signup = async (email, password, privilege) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, privilege})
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update auth context
            dispatch({type: 'LOGIN', payload: json})
            
            //take user to dashboard if signup successful
            navigate('/Dashboard')

            setIsLoading(false)
        }
    }

    return { signup, isLoading, error }
}