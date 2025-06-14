import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kauanTech from '../services/kauanTech';
import LoadingComponent from './utils/LoadingComponent';

export default function StoreScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await kauanTech.get('/produtos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  if (produtos.length === 0)
    return <div className="text-center mt-10 text-gray-500">Nenhum produto disponível.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Loja</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <div
            key={produto._id}
            className="border rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/produtos/${produto._id}`)}
          >
            <img
              src={produto.imagem || '/images/default-product.png'}
              alt={produto.nome}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-semibold">{produto.nome}</h2>
            <span className="text-green-600 font-bold text-lg">R$ {produto.preco.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}