import { useEffect, useState } from "react";
import HeaderPatternComponent from "../../headers/HeaderPatternComponent";
import { jwtDecode } from "jwt-decode";
import kauanTech from "../../../services/kauanTech";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import LoadingComponent from "../../utils/LoadingComponent";
import FooterComponent from "../../footer/FooterComponent";

export default function PurchasedComponent() {
    const [idUser, setIdUser] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [productsData, setProductsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setIdUser(decoded.id);

            const fetchPurchasesAndProducts = async () => {
                try {
                    // Busca as compras
                    const carrinhoResponse = await kauanTech.get(`/carrinhos/pago/${decoded.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPurchases(carrinhoResponse.data);

                    // Extrai todos os IDs de produtos únicos
                    const productIds = carrinhoResponse.data.flatMap(purchase =>
                        purchase.produto.map(item => item.id)
                    ).filter((id, index, self) => self.indexOf(id) === index);

                    // Busca os detalhes de todos os produtos
                    const productsResponse = await Promise.all(
                        productIds.map(id =>
                            kauanTech.get(`/produtos/${id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                        )
                    );

                    // Cria um mapa de produtos para fácil acesso
                    const productsMap = productsResponse.reduce((acc, response) => {
                        acc[response.data._id] = response.data;
                        return acc;
                    }, {});

                    setProductsData(productsMap);
                } catch (error) {
                    if (error.response.status == 403) {
                        alert("Sessão expirada, faça login novamente!")
                        localStorage.removeItem("token");
                        return navigate('/login')
                    }
                    console.error("Erro ao buscar dados:", error);
                    setError("Não foi possível carregar suas compras. Tente novamente mais tarde.");
                } finally {
                    setLoading(false);
                }
            };

            fetchPurchasesAndProducts();
        }
    }, [token]);

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    };

    if (loading) return <LoadingComponent />
    return (
        <>
            <HeaderPatternComponent caminho="/" />
            <div className="bg-gray-100">
                <main className="max-w-7xl mx-auto p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-800">Suas Compras</h1>
                    </div>

                    {purchases.length === 0 ? (
                        <div className="card bg-base-100 shadow-sm max-w-2xl mx-auto">
                            <div className="card-body text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-700">Nenhuma compra encontrada</h2>
                                <p className="text-gray-500 mt-2">Você ainda não realizou nenhuma compra em nossa loja.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {purchases.map((purchase) => (
                                <div key={purchase._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="card-body">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-base-200">
                                            <div>
                                                <h2 className="card-title text-lg">
                                                    Compra #{purchase._id.slice(-6).toUpperCase()}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(purchase.data_criacao || purchase.createdAt)}
                                                </p>
                                            </div>
                                            <div className="badge badge-lg badge-primary gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                {purchase.status === 'pago' ? 'Pago' : purchase.status}
                                            </div>
                                        </div>

                                        <div className="my-4 space-y-4">
                                            {purchase.produto.map((item) => {
                                                const product = productsData[item.id];
                                                return (
                                                    <div key={item._id} className="flex flex-col sm:flex-row gap-4 py-3 border-b border-base-100 last:border-0">
                                                        {product?.imagem && (
                                                            <div className="w-full sm:w-24 h-24 bg-base-200 rounded-lg overflow-hidden">
                                                                <img
                                                                    src={`http://localhost:3000${product.imagem}`}
                                                                    alt={product.nome}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-bold text-gray-700">{product?.nome || `Produto ID: ${item.id.slice(-6)}`}</h3>
                                                                    <p className="text-sm text-gray-500">{product?.descricao || 'Descrição não disponível'}</p>
                                                                </div>
                                                                <span className="font-bold text-gray-700">{item.quantidade}x</span>
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="text-gray-600">
                                                                    R${product.preco}
                                                                </span>
                                                                <span className="text-gray-400 text-sm ml-2">
                                                                    Total: R${product.preco * item.quantidade}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="pt-4 border-t border-base-200 text-right">
                                            <span className="font-bold text-lg text-gray-800">
                                                Total da compra: R${(purchase.total_precos)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <FooterComponent/>
        </>
    );
}