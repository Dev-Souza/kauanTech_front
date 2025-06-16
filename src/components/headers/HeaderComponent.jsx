import { Link, useNavigate } from "react-router-dom";
import HeaderComponentLogado from "./HeaderComponentLogado";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";

export default function HeaderComponent() {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);

            try {
                const payloadBase64 = storedToken.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                setUserData(decodedPayload); // aqui vem nome, email, etc
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    if (token && userData) return <HeaderComponentLogado props={userData} />;

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
                    </Form>
                </Formik>

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
                </div>
            </div>
        </header>
    );
}