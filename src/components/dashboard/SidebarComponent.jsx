import { Link, useLocation } from "react-router-dom";
import { Home, Users, Settings, LogOut } from "lucide-react";

export default function SidebarComponent() {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/painel", icon: <Home size={20} /> },
        { name: "Usuários", path: "/admin/usuarios", icon: <Users size={20} /> },
        { name: "Configurações", path: "/admin/configuracoes", icon: <Settings size={20} /> },
        { name: "Sair", path: "/login", icon: <LogOut size={20} /> },
    ];

    return (
        <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
                Admin Panel
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
                            location.pathname === item.path ? "bg-gray-700" : ""
                        }`}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}