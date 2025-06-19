import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"; // Importação para validação
import kauanTech from "../../services/kauanTech";
import LoadingComponent from "../utils/LoadingComponent";
import HeaderPatternComponent from "../headers/HeaderPatternComponent";
import FooterComponent from "../footer/FooterComponent";

// Schema de validação para o formulário do modal
const PagamentoSchema = Yup.object().shape({
    forma_pagamento: Yup.string().required('Por favor, selecione uma forma de pagamento.'),
});

export default function CartComponent() {
    const [carrinho, setCarrinho] = useState({
        idCarrinho: '',
        idCliente: '',
        produto: [],
        total_precos: 0
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    // MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Navigate
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCarrinho = async () => {
            try {
                if (!token) {
                    setLoading(false);
                    return;
                }

                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                const email = decodedPayload.email;

                const response = await kauanTech.get(`carrinhos/existente`, {
                    params: { email },
                    headers: { Authorization: `Bearer ${token}` }
                });

                // ⚠️ Se vier só a mensagem, não há carrinho
                if (response.data.mensagem) {
                    setCarrinho({ idCarrinho: '', idCliente: '', produto: [], total_precos: 0 });
                    return;
                }

                // Carrinho existe, pode setar normalmente
                setCarrinho({
                    idCarrinho: response.data._id,
                    idCliente: response.data.cliente?._id || '',
                    produto: response.data.produto || [],
                    total_precos: response.data.total_precos || 0
                });

            } catch (error) {
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    localStorage.removeItem("token");
                    return navigate('/login')
                }
                if (error.response && error.response.status === 404) {
                    setCarrinho({ idCarrinho: '', idCliente: '', produto: [], total_precos: 0 });
                } else {
                    alert(error.response?.data?.mensagem || "Ocorreu um erro ao buscar seu carrinho.");
                    console.error("Erro ao buscar carrinho:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCarrinho()
    }, [])


    // Adicionar um item daquele produto no carrinho
    const handleUpdateQuantidade = async (productId) => {
        try {
            setLoading(true)
            const item = {
                cliente: carrinho.idCliente,
                produto: [{
                    id: productId,
                    quantidade: 1
                }]
            }
            await kauanTech.post('carrinhos', item, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            window.location.reload()
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                localStorage.removeItem("token");
                return navigate('/login')
            }
            alert(error.response.data.mensagem)
        } finally {
            setLoading(false);
        }
    };

    // retirar um item de um produto no carrinho
    const handleDeleteItem = async (productId) => {
        try {
            setLoading(true);
            const reqBody = {
                produtoId: productId,
                quantidade: 1
            };
            await kauanTech.delete(`carrinhos/${carrinho.idCarrinho}/retirar`, {
                headers: { Authorization: `Bearer ${token}` },
                data: reqBody
            });
            window.location.reload()
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                localStorage.removeItem("token");
                return navigate('/login')
            }
            alert(error.response?.data?.mensagem || "Erro ao excluir o item.");
            console.error(error.response?.data?.mensagem);
        } finally {
            setLoading(false);
        }
    };

    // Retirar o produto do carrinho e suas unidades
    const handleDeleteProduct = async (productId, qtd) => {
        try {
            setLoading(true);
            const reqBody = {
                produtoId: productId,
                quantidade: qtd
            };
            await kauanTech.delete(`carrinhos/${carrinho.idCarrinho}/retirar`, {
                headers: { Authorization: `Bearer ${token}` },
                data: reqBody
            });
            alert("Produto retirado do carrinho!");
            window.location.reload()
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                localStorage.removeItem("token");
                return navigate('/login')
            }
            alert(error.response?.data?.mensagem || "Erro ao excluir o item.");
            console.error(error.response?.data?.mensagem);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizarCompra = async (pagamento) => {
        try {
            setLoading(true)
            const compra = {
                forma_pagamento: pagamento.forma_pagamento,
                carrinho: carrinho.idCarrinho
            }
            await kauanTech.post('compras', compra, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert(`Compra efetuda no ${pagamento.forma_pagamento} com sucesso!`)
            navigate('/')
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                localStorage.removeItem("token");
                return navigate('/login')
            }
            alert(error.response.data.mensagem)
        } finally {
            setLoading(false)
        }
    };

    if (loading) return <LoadingComponent />;

    if (!carrinho.idCarrinho || carrinho.produto.length === 0) {
        // CART IS EMPTY
        return (
            <>
                <HeaderPatternComponent caminho="/" />
                <div className="text-center mt-20">
                    <h2 className="text-3xl font-bold mb-4">Seu carrinho está vazio 😢</h2>
                    <p className="text-gray-600 mb-8">Adicione produtos para vê-los aqui.</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                        Ir para a loja
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderPatternComponent caminho="/" />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-semibold mb-6">Carrinho de Compras</h2>
                <div className="space-y-6">
                    {carrinho.produto.map((item) => (
                        <div key={item.id._id} className="flex items-center border rounded-lg p-4 shadow-sm bg-white">
                            <img
                                src={`http://localhost:3000${item.id.imagem}` || "https://placehold.co/120x120/EBF4FF/76A9FA?text=Imagem"}
                                alt={item.id.nome}
                                className="w-28 h-28 object-cover rounded mr-6"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">{item.id.nome}</h3>
                                <p className="text-gray-600">Preço unitário: R$ {item.id.preco.toFixed(2)}</p>

                                {/* ✨ NOVA INTERFACE DE QUANTIDADE COM BOTÕES ✨ */}
                                <div className="flex items-center mt-2">
                                    <label className="mr-2">Qtd:</label>
                                    <div className="flex items-center border rounded">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteItem(item.id._id)}
                                            disabled={item.quantidade <= 1}
                                            className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 bg-white">{item.quantidade}</span>
                                        <button
                                            onClick={() => handleUpdateQuantidade(item.id._id)}
                                            className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-800 font-medium mt-2">
                                    Total item: R$ {(item.id.preco * item.quantidade).toFixed(2)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDeleteProduct(item.id._id, item.quantidade)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                title="Remover item"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <div className="text-right mb-6">
                            <p className="text-2xl font-bold">
                                Total geral: <span className="text-blue-600">R$ {carrinho.total_precos.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-8 border-t pt-6">
                            <Link to={`/continue-buying/${carrinho.idCarrinho}`} className="px-5 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 font-semibold">
                                Continuar comprando
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* ✨ INÍCIO DO MODAL ✨ */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Painel do modal (sem alterações) */}
                    <div
                        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md border" // Adicionada uma borda sutil para melhor contraste
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Forma de Pagamento</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        </div>

                        <Formik
                            initialValues={{ forma_pagamento: '' }}
                            validationSchema={PagamentoSchema}
                            onSubmit={handleFinalizarCompra}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div role="group" aria-labelledby="payment-method-group" className="space-y-4">
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Field type="radio" name="forma_pagamento" value="Cartão de Crédito" className="h-5 w-5" />
                                            <span className="ml-4 text-lg">Cartão de Crédito</span>
                                        </label>
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Field type="radio" name="forma_pagamento" value="PIX" className="h-5 w-5" />
                                            <span className="ml-4 text-lg">PIX</span>
                                        </label>
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Field type="radio" name="forma_pagamento" value="Boleto Bancário" className="h-5 w-5" />
                                            <span className="ml-4 text-lg">Boleto Bancário</span>
                                        </label>
                                    </div>

                                    <ErrorMessage name="forma_pagamento" component="div" className="text-red-500 text-sm mt-2" />

                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            {isSubmitting ? "Processando..." : "Confirmar e Pagar"}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
            {/* --- FIM DO MODAL --- */}
            <FooterComponent />
        </>
    );
}