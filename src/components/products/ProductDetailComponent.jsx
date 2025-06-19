import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import kauanTech from '../../services/kauanTech';
import LoadingComponent from '../utils/LoadingComponent';
import HeaderComponent from '../headers/HeaderComponent';
import { jwtDecode } from 'jwt-decode';
import FooterComponent from '../footer/FooterComponent';

export default function ProductDetailComponent() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  // STATE ID USER
  const [idUser, setIdUser] = useState('');
  // Navigation
  const navigate = useNavigate()

  useEffect(() => {
    // Caso vier o token, eu pego o ID do user
    if (token) {
      const decoded = jwtDecode(token);
      setIdUser(decoded.id)
    }
    fetchProduto();
  }, [id]);

  const fetchProduto = async () => {
    try {
      setLoading(true);
      const response = await kauanTech.get(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduto(response.data);
    } catch (err) {
      if (err.response.status == 403) {
        alert("Sessão expirada, faça login novamente!")
        localStorage.removeItem("token");
        return navigate('/login')
      }
      alert('Erro ao carregar o produto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = async (idProduto, qtd) => {
    try {
      // Caso não venha o ID o usuário precisa fazer login
      if (idUser) {
        setLoading(true)
        // Montando o cart
        const carrinho = {
          cliente: idUser,
          produto: [
            {
              id: idProduto,
              quantidade: qtd
            }
          ]
        }
        const addCart = await kauanTech.post('carrinhos', carrinho, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        alert("Produto adicionado ao carrinho!");
      } else {
        alert("Faça login para adicionar produto no carrinho!");
        localStorage.removeItem("token");
        navigate("/login")
      }
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
  }

  const comprarAgora = async (qtd, produto) => {

  }

  if (loading) return <LoadingComponent />;

  if (!produto) return <div className="text-center mt-10 text-gray-500">Produto não encontrado.</div>;
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
            onSubmit={({ quantidade }) => adicionarAoCarrinho(produto._id, quantidade)}
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
      <FooterComponent/>
    </>
  );
}