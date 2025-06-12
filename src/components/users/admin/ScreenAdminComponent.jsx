import { useEffect, useState } from "react";
import kauanTech from "../../../services/kauanTech";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderAdminComponent from "./HeaderAdminComponent";
import SidebarComponent from "../../dashboard/SidebarComponent";

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
                <HeaderAdminComponent caminho="/painel" />
                <main className="flex-1 p-6 bg-gray-100">
                     <Outlet />
                </main>
            </div>
        </div>
    );
}