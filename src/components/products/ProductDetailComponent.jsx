import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import kauanTech from '../../services/kauanTech';
import LoadingComponent from '../utils/LoadingComponent';
import HeaderComponent from '../headers/HeaderComponent';

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

  const adicionarAoCarrinho = async (qtd, produto) => {
    console.log(qtd, produto)
  }

  const comprarAgora = async (qtd, produto) => {
    console.log(qtd, produto)
  }

  return (
    <>
      <HeaderComponent />
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagem do Produto */}
        <div className="w-full flex justify-center">
          <img
            src={`http://localhost:3000${produto.imagem}` || '/images/default-product.png'}
            alt={produto.nome}
            className="rounded-xl shadow-lg max-h-[400px] object-contain"
          />
        </div>

        {/* Detalhes + Form */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{produto.nome}</h1>
          <p className="text-gray-600 mb-6">{produto.descricao || 'Sem descrição disponível.'}</p>
          <span className="text-3xl font-bold text-green-600 mb-8">
            R$ {produto.preco.toFixed(2)}
          </span>

          <Formik
            initialValues={{ quantidade: 1 }}
            onSubmit={({ quantidade }) => adicionarAoCarrinho(quantidade, produto)}
          >
            {({ values }) => (
              <Form className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-gray-700 font-medium">Quantidade:</label>
                  <Field
                    type="number"
                    name="quantidade"
                    min="1"
                    max={produto.quantidade}
                    className="w-20 border border-gray-300 rounded px-3 py-1 text-center"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Adicionar ao Carrinho
                  </button>

                  <button
                    type="button"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => comprarAgora(values.quantidade, produto)}
                  >
                    Comprar Agora
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
}