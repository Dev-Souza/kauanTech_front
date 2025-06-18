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
            <section className="min-h-screen bg-base-300 pt-20">
                {/* Container Principal da Página */}
                <div className="container mx-auto px-4 py-8 md:py-12 ">
                    <h1 className="text-center text-3xl md:text-4xl font-bold mb-8 md:mb-12">
                        Painel de Admin
                    </h1>

                    {/* Container Flex para os Cards */}
                    <div className="flex flex-wrap justify-center items-stretch gap-8">

                        {/* Card 1 */}
                        <Link to='/' className="w-full max-w-2xl text-inherit no-underline">
                            <div className="card h-full bg-base-100 shadow-xl transition-transform hover:scale-105">
                                <figure className="px-10 pt-10">
                                    <img
                                        src={imgStore}
                                        alt="Página Inicial"
                                        className="rounded-xl" />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">Acessar Loja</h2>
                                    <div className="card-actions mt-4">
                                        <div className="btn btn-secondary text-sm sm:text-base md:text-lg lg:text-lg whitespace-nowrap rounded-lg">Ir para Loja</div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to='/admin' className="w-full max-w-2xl text-inherit no-underline">
                            <div className="card h-full bg-base-100 shadow-xl transition-transform hover:scale-105">
                                <figure className="px-10 pt-10">
                                    <img
                                        src={imgAdmin}
                                        alt="Gerenciar Produtos"
                                        className="rounded-xl" />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">Gerenciar Produtos</h2>
                                    <div className="card-actions mt-4">
                                        <div className="btn btn-primary text-sm sm:text-base md:text-lg lg:text-lg whitespace-nowrap rounded-lg">Gerenciar</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}