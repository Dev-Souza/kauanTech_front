import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Image } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import kauanTech from "../../../../services/kauanTech";
import LoadingComponent from "../../../utils/LoadingComponent";

const validationSchema = Yup.object({
  codigo_barras: Yup.string().required("Obrigatório"),
  nome: Yup.string().required("Obrigatório"),
  preco: Yup.number().required("Obrigatório").positive("Valor inválido"),
  quantidade: Yup.number().required("Obrigatório").min(0),
  categoria: Yup.string().required("Obrigatório"),
  status: Yup.string().required("Obrigatório"),
});

export default function ProductManageAdminComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await kauanTech.get("/produtos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      if (error.response.status == 403) {
        alert("Sessão expirada, faça login novamente!")
        localStorage.removeItem("token");
        return navigate('/login')
      }
      alert("Erro ao carregar produtos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja mesmo excluir este produto?")) return;
    try {
      setLoading(true);
      await kauanTech.delete(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Produto excluído!");
      fetchProducts();
    } catch (error) {
      if (error.response.status == 403) {
        alert("Sessão expirada, faça login novamente!")
        localStorage.removeItem("token");
        return navigate('/login')
      }
      alert("Erro ao excluir produto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate("/admin/products/create");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          Novo Produto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Código</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Categoria</th>
              <th>Status</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.imagem ? (
                    <img src={`http://localhost:3000${p.imagem}`} alt={p.nome} className="w-12 h-12 object-cover rounded mx-auto" />
                  ) : (
                    <Image className="text-gray-400 mx-auto" size={20} />
                  )}
                </td>
                <td>{p.codigo_barras}</td>
                <td>{p.nome}</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td>{p.quantidade}</td>
                <td>{p.categoria}</td>
                <td>
                  <span className={`badge ${p.status === "ativo" ? "badge-success" : "badge-error"}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="flex gap-2 justify-center">
                  <button onClick={() => setEditingProduct(p)} className="btn btn-sm btn-warning">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-error">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-10 text-gray-500">Nenhum produto cadastrado.</div>
        )}
      </div>

      {editingProduct && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h3 className="text-xl font-bold mb-4">Editar Produto</h3>

            <Formik
              initialValues={{
                codigo_barras: editingProduct.codigo_barras,
                nome: editingProduct.nome,
                preco: editingProduct.preco,
                quantidade: editingProduct.quantidade,
                descricao: editingProduct.descricao || "",
                categoria: editingProduct.categoria,
                status: editingProduct.status,
                imagem: editingProduct.imagem, // imagem nova
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setLoading(true);
                  const formData = new FormData();
                  Object.entries(values).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      formData.append(key, value);
                    }
                  });

                  const responseEdit = await kauanTech.put(`/produtos/${editingProduct._id}`, formData, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                  alert("Produto atualizado com sucesso!");
                  setEditingProduct(null);
                  fetchProducts();
                } catch (error) {
                  if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    localStorage.removeItem("token");
                    return navigate('/login')
                  }
                  alert("Erro ao atualizar produto");
                  console.error(error);
                } finally {
                  setSubmitting(false);
                  setLoading(false);
                }
              }}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="label">Código de Barras</label>
                    <Field name="codigo_barras" className="input input-bordered w-full" />
                    <ErrorMessage name="codigo_barras" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="label">Nome</label>
                    <Field name="nome" className="input input-bordered w-full" />
                    <ErrorMessage name="nome" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Preço</label>
                      <Field name="preco" type="number" className="input input-bordered w-full" />
                      <ErrorMessage name="preco" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label className="label">Quantidade</label>
                      <Field name="quantidade" type="number" className="input input-bordered w-full" />
                      <ErrorMessage name="quantidade" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Descrição</label>
                    <Field as="textarea" name="descricao" className="textarea textarea-bordered w-full" />
                  </div>
                  <div>
                    <label className="label">Categoria</label>
                    <Field name="categoria" className="input input-bordered w-full" />
                    <ErrorMessage name="categoria" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <Field as="select" name="status" className="select select-bordered w-full">
                      <option value="">Selecione</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Visualização e upload da imagem */}
                  <div>
                    <label className="label">Imagem Atual</label>
                    {editingProduct.imagem ? (
                      <img
                        src={`http://localhost:3000${editingProduct.imagem}`}
                        alt="Imagem do Produto"
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <p className="text-sm text-gray-400">Sem imagem</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Nova Imagem</label>
                    <input
                      type="file"
                      name="imagem"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => setFieldValue("imagem", e.currentTarget.files[0])}
                    />
                    <ErrorMessage name="imagem" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}