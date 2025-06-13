import { useEffect, useState } from "react";
import { Pencil, Trash2, Image, X } from "lucide-react";
import kauanTech from "../../../../services/kauanTech";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await kauanTech.get("/produtos", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data);
        } catch (error) {
            alert("Erro ao carregar produtos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;
        try {
            setLoading(true);
            await kauanTech.delete(`/produtos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Produto excluído com sucesso!");
            fetchProducts();
        } catch (error) {
            alert("Erro ao excluir produto.");
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <LoadingComponent />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Gerenciar Produtos</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Categoria</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((produto) => (
                            <tr key={produto._id}>
                                <td>
                                    <div className="flex items-center justify-center">
                                        <Image size={24} className="text-gray-400" />
                                    </div>
                                </td>
                                <td>{produto.codigo_barras}</td>
                                <td>{produto.nome}</td>
                                <td>R$ {produto.preco.toFixed(2)}</td>
                                <td>{produto.quantidade}</td>
                                <td>{produto.categoria}</td>
                                <td>
                                    <span
                                        className={`badge ${produto.status.toLowerCase() === "ativo"
                                                ? "badge-success"
                                                : "badge-error"
                                            }`}
                                    >
                                        {produto.status.charAt(0).toUpperCase() +
                                            produto.status.slice(1)}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => setEditingProduct(produto)}
                                        className="btn btn-sm btn-warning"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(produto._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center mt-4 text-gray-500">
                        Nenhum produto cadastrado.
                    </div>
                )}
            </div>

            {/* Modal de edição com fundo em blur e fechamento ao clicar fora */}
            {editingProduct && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30"
                    onClick={() => setEditingProduct(null)} // fecha modal ao clicar fora
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full max-w-xl relative"
                        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
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
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true)
                                    await kauanTech.put(
                                        `/produtos/${editingProduct._id}`,
                                        values,
                                        {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                "Content-Type": "application/json",
                                            },
                                        }
                                    );
                                    alert("Produto atualizado com sucesso!");
                                    setEditingProduct(null);
                                    fetchProducts();
                                } catch (error) {
                                    alert("Erro ao atualizar produto");
                                    console.error(error);
                                } finally {
                                    setSubmitting(false);
                                    setLoading(false)
                                }
                            }}
                            enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="label">Código de Barras</label>
                                        <Field
                                            name="codigo_barras"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="codigo_barras"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Nome</label>
                                        <Field name="nome" className="input input-bordered w-full" />
                                        <ErrorMessage
                                            name="nome"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Preço</label>
                                            <Field
                                                type="number"
                                                name="preco"
                                                className="input input-bordered w-full"
                                            />
                                            <ErrorMessage
                                                name="preco"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Quantidade</label>
                                            <Field
                                                type="number"
                                                name="quantidade"
                                                className="input input-bordered w-full"
                                            />
                                            <ErrorMessage
                                                name="quantidade"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">Descrição</label>
                                        <Field
                                            as="textarea"
                                            name="descricao"
                                            className="textarea textarea-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Categoria</label>
                                        <Field
                                            name="categoria"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="categoria"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Status</label>
                                        <Field
                                            as="select"
                                            name="status"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Selecione</option>
                                            <option value="ativo">Ativo</option>
                                            <option value="inativo">Inativo</option>
                                        </Field>
                                        <ErrorMessage
                                            name="status"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
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