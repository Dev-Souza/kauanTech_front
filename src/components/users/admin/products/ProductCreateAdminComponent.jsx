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
    // State token
    const [token, setToken] = useState('');
    // NAVIGATION
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const authToken = localStorage.getItem('token');
                // SET TOKEN
                setToken(authToken);
                await kauanTech.get('admin', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                alert(error.response.data.mensagem);
                navigate('/login');
            }
        };
        checkAdmin();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setLoading(true);
            const createdProduct = await kauanTech.post('/produtos', values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            alert("Produto cadastrado com sucesso!");
            console.log(createdProduct.data)
            navigate('/admin/products/manage');
        } catch (error) {
            alert("Erro ao cadastrar produto! ", error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingComponent />

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
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
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

                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full">
                            Cadastrar
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
