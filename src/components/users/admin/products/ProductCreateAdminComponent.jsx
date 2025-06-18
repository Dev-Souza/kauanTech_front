import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingComponent from '../../../utils/LoadingComponent';
import { useEffect, useState } from 'react';
import kauanTech from '../../../../services/kauanTech';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    codigo_barras: Yup.string().required('Obrigatório'),
    nome: Yup.string().required('Obrigatório'),
    preco: Yup.number().required('Obrigatório').positive('Deve ser positivo'),
    quantidade: Yup.number().required('Obrigatório').min(0, 'Não pode ser negativo'),
    descricao: Yup.string(),
    categoria: Yup.string().required('Obrigatório'),
    status: Yup.string().required('Obrigatório'),
});

export default function ProductCreateAdminComponent() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const authToken = localStorage.getItem('token');
                setToken(authToken);
                await kauanTech.get('admin', {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
            } catch (error) {
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    localStorage.removeItem("token");
                    return navigate('/login')
                }
                alert(error.response?.data?.mensagem || 'Erro de autenticação');
                navigate('/login');
            }
        };
        checkAdmin();
    }, [navigate]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const createdProduct = await kauanTech.post('/produtos', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // NÃO definir Content-Type aqui, o browser faz isso automaticamente
                }
            });
            alert("Produto cadastrado com sucesso!");
            resetForm();
            navigate('/admin/products/manage');
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                localStorage.removeItem("token");
                return navigate('/login')
            }
            alert("Erro ao cadastrar produto! " + (error.response?.data?.mensagem || error.message));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingComponent />;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Cadastrar Produto</h2>

            <Formik
                initialValues={{
                    codigo_barras: '',
                    nome: '',
                    preco: '',
                    quantidade: '',
                    descricao: '',
                    categoria: '',
                    status: '',
                    imagem: null
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
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
                                <Field type="number" name="preco" className="input input-bordered w-full" />
                                <ErrorMessage name="preco" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="label">Quantidade</label>
                                <Field type="number" name="quantidade" className="input input-bordered w-full" />
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

                        <div>
                            <label className="label">Imagem do Produto</label>
                            <input
                                id="imagem"
                                name="imagem"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    setFieldValue("imagem", event.currentTarget.files[0]);
                                }}
                                className="file-input file-input-bordered w-full"
                            />
                            <ErrorMessage name="imagem" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="btn btn-primary w-full">
                                Cadastrar
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}