import { useEffect, useState } from "react"
import kauanTech from "../../../services/kauanTech"
import { Link, useNavigate } from "react-router-dom";

export default function PainelAdminComponent() {
    const [token, setToken] = useState('')

    // Config navegação
    const navigate = useNavigate();

    // Checando se é admin
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const authToken = localStorage.getItem('token');
                // Setando o token no state
                setToken(authToken)
                const response = await kauanTech.get('admin', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                alert(error.response.data.mensagem)
                navigate('/login')
            }
        }
        checkAdmin();
    }, [])

    return (
        <>
            <h1>Painel de Admin</h1>
            <Link to='/' className="btn btn-success">INICIAL</Link>
            <Link to='/admin' className="btn btn-primary">ADMIN</Link>
        </>
    )
}