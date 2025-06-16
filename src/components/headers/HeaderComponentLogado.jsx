import { ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import kauanTech from "../../services/kauanTech";

export default function HeaderComponentLogado({ props }) {
    const { nome, email, role } = props
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const carrinhoQuantidade = 3; // você pode substituir isso por um estado real

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redireciona após logout
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    KauanTech
                </Link>

                {/* Barra de busca */}
                <Formik
                    initialValues={{ nomeProduto: '' }}
                    onSubmit={({ nomeProduto }) => navigate(`/?nome=${encodeURIComponent(nomeProduto)}`)}
                >
                    <Form className="flex flex-1 max-w-xl mx-6">
                        <Field
                            type="text"
                            name="nomeProduto"
                            placeholder="Buscar produtos..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                        >
                            Buscar
                        </button>
                    </Form>
                </Formik>

                {/* Ações */}
                <div className="flex items-center space-x-6 relative">
                    {/* Nome do usuário com dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                            {nome}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                                {role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Carrinho com contador */}
                    <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {carrinhoQuantidade}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}