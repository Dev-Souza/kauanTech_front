import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import kauanTech from "../../services/kauanTech"
import LoadingComponent from "../utils/LoadingComponent"
import HeaderPatternComponent from "../headers/HeaderPatternComponent"

export default function CartComponent() {
    const [carrinho, setCarrinho] = useState({
        produto: [],
        total_precos: 0
    })
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchCarrinho = async () => {
            try {
                if (!token) return
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64)); // aqui vem os dados que estão inseridos no token
                const email = decodedPayload.email
                const carrinho = await kauanTech.get(`carrinhos/existente`, {
                    params: { email },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setCarrinho({
                    produto: carrinho.data.produto || [],
                    total_precos: carrinho.data.total_precos || 0
                })
            } catch (error) {
                alert(error.response.data.mensagem)
                console.error("Erro ao buscar carrinho:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCarrinho()
    }, [])

    if (loading) return <LoadingComponent />

    if (!carrinho || carrinho.produto.length == 0) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio 😢</h2>
                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Voltar à loja
                </Link>
            </div>
        )
    }

    return (
        <>
            <HeaderPatternComponent caminho="/" />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-semibold mb-6">Carrinho de Compras</h2>

                <div className="space-y-6">
                    {Array.isArray(carrinho.produto) && carrinho.produto.map((item, index) => (
                        <div key={index} className="flex items-center border rounded-lg p-4 shadow-sm bg-white">
                            <img
                                src={item.id.imagem || "https://via.placeholder.com/120"}
                                alt={item.id.nome}
                                className="w-28 h-28 object-cover rounded mr-6"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{item.id.nome}</h3>
                                <p className="text-gray-600">Preço unitário: R$ {item.id.preco.toFixed(2)}</p>
                                <p className="text-gray-600">Quantidade: {item.quantidade}</p>
                                <p className="text-gray-800 font-medium mt-2">
                                    Total: R$ {(item.id.preco * item.quantidade).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-right">
                    <p className="text-xl font-bold mb-4">
                        Total geral: R$ {(carrinho.total_precos || 0).toFixed(2)}
                    </p>
                    <div className="flex justify-end gap-4">
                        <Link to="/" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                            Continuar comprando
                        </Link>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Finalizar compra
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}