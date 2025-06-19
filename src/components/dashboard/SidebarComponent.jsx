import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  LogOut,
  ChevronDown,
  ChevronUp,
  Wrench,
  Plus,
  Package,
} from "lucide-react";

export default function SidebarComponent() {
  const location = useLocation();

  const [openUsers, setOpenUsers] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redireciona após logout
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition ${isActive("/admin/dashboard") ? "bg-gray-700" : ""
            }`}
        >
          <Home size={20} />
          Dashboard
        </Link>

        {/* Usuários Dropdown */}
        <div>
          <button
            onClick={() => setOpenUsers(!openUsers)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="flex items-center gap-3">
              <Users size={20} />
              Usuários
            </span>
            {openUsers ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {openUsers && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                to="/admin/users/manage"
                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 ${isActive("/admin/users") ? "bg-gray-700" : ""
                  }`}
              >
                <Wrench size={16} />
                Gerenciar
              </Link>
              <Link
                to="/admin/users/create"
                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 ${isActive("/admin/users/create") ? "bg-gray-700" : ""
                  }`}
              >
                <Plus size={16} />
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Produtos Dropdown */}
        <div>
          <button
            onClick={() => setOpenProducts(!openProducts)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <span className="flex items-center gap-3">
              <Package size={20} />
              Produtos
            </span>
            {openProducts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {openProducts && (
            <div className="ml-8 mt-2 space-y-1">
              <Link
                to="/admin/products/manage"
                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 ${isActive("/admin/products") ? "bg-gray-700" : ""
                  }`}
              >
                <Wrench size={16} />
                Gerenciar
              </Link>
              <Link
                to="/admin/products/create"
                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 ${isActive("/admin/products/create") ? "bg-gray-700" : ""
                  }`}
              >
                <Plus size={16} />
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Sair */}
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <LogOut size={20} />
          Sair
        </button>
      </nav>
    </aside>
  );
}