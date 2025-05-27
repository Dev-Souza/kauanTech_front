import { useEffect, useState } from "react";
import kauanTech from "../../../services/kauanTech";
import { useNavigate } from "react-router-dom";
import HeaderAdminComponent from "./HeaderAdminComponent";

export default function ScreenAdminComponent() {
    const [token, setToken] = useState('');

    // Config navigation
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
            <HeaderAdminComponent caminho='/painel'/>
            <h1 className="pt-30">Tela Admin</h1>
        </>
    )
}