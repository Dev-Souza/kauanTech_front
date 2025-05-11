import { Link } from "react-router-dom";

export default function HeaderComponent() {
    return (
        <>
            <Link to='/login' className="btn btn-success">Login</Link>
            <Link to='/register' className="btn btn-primary">Register</Link>
        </>
    )
}