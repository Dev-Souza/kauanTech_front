import { useEffect, useState } from "react"
import kauanTech from "../../../services/kauanTech"
import { Link, useNavigate } from "react-router-dom";

// Importando imagens de minhas rotas
import imgAdmin from '../../../assets/images/imgAdmin.svg'
import imgStore from '../../../assets/images/imgStore.svg'
import HeaderPatternComponent from "../../headers/HeaderPatternComponent";

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
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    localStorage.removeItem("token");
                    return navigate('/login')
                }
                alert(error.response.data.mensagem)
                navigate('/login')
            }
        }
        checkAdmin();
    }, [])

    return (
        <>
            <HeaderPatternComponent caminho='/' />
            <section className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 pt-16 pb-12">
                {/* Container Principal da Página */}
                <div className="container mx-auto px-4 py-8">
                    {/* Título com destaque */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4">
                            Painel Administrativo
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Gerencie todas as funcionalidades do sistema de forma centralizada
                        </p>
                    </div>

                    {/* Grid de Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card Loja */}
                        <Link to='/' className="group transform transition-all hover:-translate-y-2">
                            <div className="card h-full bg-base-100 shadow-xl border border-base-200 group-hover:border-blue-200">
                                <figure className="px-8 pt-8">
                                    <img
                                        src={imgStore}
                                        alt="Página Inicial"
                                        className="rounded-xl h-48 w-full object-contain"
                                    />
                                </figure>
                                <div className="card-body items-center text-center p-6">
                                    <h2 className="card-title text-2xl font-semibold mb-2">Acessar Loja</h2>
                                    <p className="text-gray-600 mb-4">Visualize como os clientes veem sua loja</p>
                                    <div className="card-actions">
                                        <button className="btn btn-wide rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white hover:from-blue-600 hover:to-blue-700">
                                            Ir para Loja
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card Admin */}
                        <Link to='/admin' className="group transform transition-all hover:-translate-y-2">
                            <div className="card h-full bg-base-100 shadow-xl border border-base-200 group-hover:border-blue-200">
                                <figure className="px-8 pt-8">
                                    <img
                                        src={imgAdmin}
                                        alt="Gerenciar Produtos"
                                        className="rounded-xl h-48 w-full object-contain"
                                    />
                                </figure>
                                <div className="card-body items-center text-center p-6">
                                    <h2 className="card-title text-2xl font-semibold mb-2">Gerenciar Produtos</h2>
                                    <p className="text-gray-600 mb-4">Adicione, edite ou remova produtos do catálogo</p>
                                    <div className="card-actions">
                                        <button className="btn btn-wide rounded-full bg-gradient-to-r from-blue-600 to-blue-700 border-none text-white hover:from-blue-700 hover:to-blue-800">
                                            Gerenciar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Rodapé do Painel */}
                    <div className="mt-12 text-center text-gray-500 text-sm">
                        <p>Sessão ativa como administrador</p>
                    </div>
                </div>
            </section>
        </>
    )
}