import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
    const { logout } = useLogout()

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <div className="container">
                <Link to="/dashboard">
                    <h1>ShiftFlow Master</h1>
                </Link>
                <nav>
                    <div>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                    <div>
                        <Link to="/">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar