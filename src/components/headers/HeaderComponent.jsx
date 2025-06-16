import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function HeaderComponent() {
    const carrinhoQuantidade = 3; // Substitua por estado/contexto se desejar

    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    KauanTech
                </Link>

                {/* Barra de busca */}
                <form className="flex flex-1 max-w-xl mx-6">
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </form>

                {/* Ações */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Entrar
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Cadastrar
                    </Link>

                    {/* Carrinho com contador */}
                    <Link to="/carrinho" className="relative text-gray-700 hover:text-blue-600">
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