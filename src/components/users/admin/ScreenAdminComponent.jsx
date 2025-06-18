import { useEffect, useState } from "react";
import kauanTech from "../../../services/kauanTech";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarComponent from "../../dashboard/SidebarComponent";
import HeaderPatternComponent from "../../headers/HeaderPatternComponent";

export default function ScreenAdminComponent() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const authToken = localStorage.getItem('token');
                setToken(authToken);
                await kauanTech.get('admin', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    localStorage.removeItem("token");
                    return navigate('/login')
                }
                alert(error.response.data.mensagem);
                navigate('/login');
            }
        };
        checkAdmin();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar fixa à esquerda */}
            <SidebarComponent />

            {/* Área principal: Navbar + Conteúdo */}
            <div className="flex-1 flex flex-col">
                <HeaderPatternComponent caminho="/painel" />
                <main className="flex-1 p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}