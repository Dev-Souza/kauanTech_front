import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import kauanTech from '../services/kauanTech';
import LoadingComponent from './utils/LoadingComponent';
import { ImageOff } from 'lucide-react';
import FooterComponent from './footer/FooterComponent';

export default function StoreScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Nome que vem como paramêtro
  const [searchParams] = useSearchParams();
  const nomeProduto = searchParams.get("nome");

  useEffect(() => {
    if (nomeProduto) {
      buscarPorNomeProduto(nomeProduto)
    } else {
      fetchProdutos();
    }
  }, [nomeProduto]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await kauanTech.get('/produtos');
      setProdutos(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buscarPorNomeProduto = async (nomeProduto) => {
    try {
      setLoading(true);
      const produtoBuscado = await kauanTech.get('produtos/buscar', {
        params: { nome: nomeProduto }
      })
      setProdutos(produtoBuscado.data)
    } catch (error) {
      alert(error.response.data.mensagem)
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingComponent />;

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  if (produtos.length === 0)
    return <div className="text-center mt-10 text-gray-500">Nenhum produto disponível.</div>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 min-h-[65vh]">
        <h1 className="text-3xl font-bold mb-6">Loja</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.filter(produto => produto.quantidade > 0).map((produto) => {
            const hasImage = produto.imagem && produto.imagem.trim() !== ""

            return (
              <div
                key={produto._id}
                className="border rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/produtos/${produto._id}`)}
              >
                {hasImage ? (
                  <img
                    src={`http://localhost:3000${produto.imagem}` || '/images/default-product.png'}
                    alt={produto.nome}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 mb-2 rounded">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <h2 className="text-lg font-semibold">{produto.nome}</h2>
                <span className="text-green-600 font-bold text-lg">R$ {produto.preco.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>
      <FooterComponent />
    </>
  );
}