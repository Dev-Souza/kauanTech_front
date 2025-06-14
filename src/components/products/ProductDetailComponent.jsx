import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import kauanTech from '../../services/kauanTech';
import LoadingComponent from '../utils/LoadingComponent';

export default function ProductDetailComponent() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduto();
  }, [id]);

  const fetchProduto = async () => {
    try {
      setLoading(true);
      const response = await kauanTech.get(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduto(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar o produto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!produto) return <div className="text-center mt-10 text-gray-500">Produto não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{produto.nome}</h1>
      <img
        src={produto.imagem || '/images/default-product.png'}
        alt={produto.nome}
        className="w-full max-h-[400px] object-contain mb-6 rounded"
      />
      <p className="mb-4 text-gray-700">{produto.descricao || 'Sem descrição disponível.'}</p>
      <span className="text-green-700 font-extrabold text-2xl mb-6 block">
        R$ {produto.preco.toFixed(2)}
      </span>
      <button
        className="btn btn-primary w-full max-w-xs"
        onClick={() => {
          // Aqui adiciona o produto ao carrinho, sua lógica aqui
          alert(`Produto "${produto.nome}" adicionado ao carrinho!`);
        }}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}