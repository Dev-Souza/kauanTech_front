import { useNavigation, useParams } from "react-router-dom";
import HeaderPatternComponent from "../../headers/HeaderPatternComponent";
import { useEffect, useState } from "react";
import LoadingComponent from "../../utils/LoadingComponent";
import kauanTech from "../../../services/kauanTech";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

// Schema de validação para o formulário do modal
const PagamentoSchema = yup.object().shape({
    forma_pagamento: yup.string().required('Por favor, selecione uma forma de pagamento.'),
});

export default function ContinueBuyingComponent() {
    // STATE LOADING
    const [loading, setLoading] = useState(false);
    // PEGANDO O ID DO CARRINHO
    const { idCart } = useParams();
    // STATE TOKEN
    const token = localStorage.getItem("token");
    // STATE CART
    const [cart, setCart] = useState({});
    // STATE USER
    const [user, setUser] = useState({});
    // MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    // NAVIGATE
    const navigate = useNavigation()

    // Pegando o USER que é dono do carrinho
    useEffect(() => {
        const getCart = async () => {
            try {
                setLoading(true);
                const cartResponse = await kauanTech.get(`carrinhos/${idCart}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Setando carrinho no state
                setCart(cartResponse.data);
                console.log(cartResponse.data);
                getUser(cartResponse.data.cliente._id);
            } catch (error) {
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    return navigate('/login')
                }
                alert(error.response?.data?.mensagem || "Erro ao carregar carrinho");
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        // Chamando a função
        getCart();
    }, [idCart]);

    // Buscando USER
    const getUser = async (idUser) => {
        try {
            setLoading(true);
            const userResponse = await kauanTech.get(`clientes/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(userResponse.data);
            console.log("USER");
            console.log(userResponse.data);
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                return navigate('/login')
            }
            alert(error.response?.data?.mensagem || "Erro ao carregar usuário");
        } finally {
            setLoading(false);
        }
    };

    // Schema de validação do endereço com yup
    const enderecoSchema = yup.object().shape({
        logradouro: yup.string().required("Logradouro é obrigatório"),
        numero: yup.string().required("Número é obrigatório"),
        bairro: yup.string().required("Bairro é obrigatório"),
        localidade: yup.string().required("Cidade é obrigatória"),
        uf: yup.string().required("Estado é obrigatório"),
        cep: yup
            .string()
            .matches(/^\d{5}-?\d{3}$/, "CEP inválido")
            .required("CEP é obrigatório"),
    });

    // Função que confirma os dados e simula a compra
    const handleConfirmarEndereco = async (values) => {
        try {
            setLoading(true)
            const updateEndereco = await kauanTech.put(`/clientes/${user._id}/endereco`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsModalOpen(true)
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                return navigate('/login')
            }
            alert(error.response.data.mensagem)
        } finally {
            setLoading(false)
        }
    };

    // Function de finalizar a compra
    const handleFinalizarCompra = async (pagamento) => {
        try {
            setLoading(true)
            const compra = {
                forma_pagamento: pagamento.forma_pagamento,
                carrinho: cart._id
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
                return navigate('/login')
            }
            alert(error.response.data.mensagem)
        } finally {
            setLoading(false)
        }
    };

    // LOADING
    if (loading || !user.endereco) return <LoadingComponent />;

    return (
        <>
            <HeaderPatternComponent caminho="/cart" />
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* CABEÇALHO */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Finalizar Compra</h1>
                        <p className="text-xl text-gray-700">Confirme seu endereço e revise seu pedido</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* SEÇÃO DE ENDEREÇO */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                                Seu Endereço de Entrega
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">Olá, {user.nome}! Confirme se este é o endereço correto para entrega:</p>

                            <Formik
                                initialValues={user.endereco}
                                validationSchema={enderecoSchema}
                                onSubmit={(values) => handleConfirmarEndereco(values)}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        {["logradouro", "numero", "bairro", "localidade", "uf", "cep"].map((field) => (
                                            <div key={field} className="space-y-2">
                                                <label className="block text-xl font-medium text-gray-700 capitalize">
                                                    {field === "localidade" ? "Cidade" :
                                                        field === "logradouro" ? "Rua/Avenida" :
                                                            field === "uf" ? "Estado" : field}
                                                </label>
                                                <Field
                                                    name={field}
                                                    className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder={field === "localidade" ? "Sua cidade" :
                                                        field === "logradouro" ? "Nome da rua/avenida" :
                                                            field === "uf" ? "UF" : `Seu ${field}`}
                                                />
                                                <ErrorMessage
                                                    name={field}
                                                    component="div"
                                                    className="text-red-500 text-lg mt-2"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 text-xl"
                                        >
                                            Confirmar Endereço e Finalizar Compra
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* RESUMO DO PEDIDO */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                                    Resumo do Pedido
                                </h2>

                                <div className="space-y-6 mb-8">
                                    {cart.produto?.map((item, idx) => (
                                        <div key={idx} className="flex items-start p-5 border-2 border-gray-100 rounded-lg hover:bg-gray-50 transition">
                                            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                                                <img
                                                    src={`http://localhost:3000${item.id.imagem}` || "https://placehold.co/120x120/EBF4FF/76A9FA?text=Imagem"}
                                                    alt={item.id.nome}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="ml-5 flex-1">
                                                <h3 className="text-2xl font-medium text-gray-900">{item.id.nome}</h3>
                                                <div className="grid grid-cols-2 gap-3 mt-3 text-xl text-gray-600">
                                                    <span>Preço unitário:</span>
                                                    <span className="text-right">R$ {item.id.preco.toFixed(2)}</span>
                                                    <span>Quantidade:</span>
                                                    <span className="text-right">{item.quantidade}</span>
                                                    <span className="font-medium">Subtotal:</span>
                                                    <span className="text-right font-medium text-blue-600">
                                                        R$ {(item.id.preco * item.quantidade).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t-2 border-gray-200 pt-6">
                                    <div className="flex justify-between text-2xl font-bold text-gray-900 mb-4">
                                        <span>Total:</span>
                                        <span className="text-blue-700">R$ {cart.total_precos?.toFixed(2)}</span>
                                    </div>
                                    <p className="text-lg text-gray-500 text-center mt-6">
                                        O pagamento será processado após a confirmação do endereço.
                                    </p>
                                </div>
                            </div>
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
        </>
    );
}