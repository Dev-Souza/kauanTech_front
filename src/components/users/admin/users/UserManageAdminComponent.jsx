import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kauanTech from '../../../../services/kauanTech';
import LoadingComponent from '../../../utils/LoadingComponent';
import { Pencil, Trash2, X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    telefone: Yup.string().required('Telefone é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório'),
    role: Yup.string().required('Função é obrigatória'),
});

export default function UserAdminComponent() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await kauanTech.get('/clientes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(response.data);
            console.log(response.data)
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                return navigate('/login')
            }
            alert('Erro ao carregar usuários.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;
        try {
            await kauanTech.delete(`/clientes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Usuário deletado com sucesso.');
            setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            if (error.response.status == 403) {
                alert("Sessão expirada, faça login novamente!")
                return navigate('/login')
            }
            alert('Erro ao deletar usuário.');
            console.error(error);
        }
    };

    const handleEdit = (_id) => {
        const user = usuarios.find((u) => u._id === _id);
        setEditingUser(user);
    };

    const handleCreate = () => {
        navigate('/admin/users/create');
    };

    if (loading) return <LoadingComponent />;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
                <button onClick={handleCreate} className="btn btn-primary">
                    Novo Usuário
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Role</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((user) => (
                            <tr key={user._id}>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>{user.cpf}</td>
                                <td>{user.telefone}</td>
                                <td>{user.role}</td>
                                <td className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleEdit(user._id)}
                                        className="btn btn-sm btn-warning"
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-sm btn-error"
                                        title="Deletar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {usuarios.length === 0 && (
                    <div className="text-center py-10 text-gray-500">Nenhum usuário cadastrado.</div>
                )}
            </div>

            {editingUser && (
                <div
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => setEditingUser(null)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setEditingUser(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <X />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Editar Usuário</h3>

                        <Formik
                            initialValues={{
                                nome: editingUser.nome || '',
                                email: editingUser.email || '',
                                telefone: editingUser.telefone || '',
                                cpf: editingUser.cpf || '',
                                role: editingUser.role || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    await kauanTech.put(`/clientes/${editingUser._id}`, values, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        },
                                        "Content-Type": "application/json",
                                    });
                                    alert('Usuário atualizado com sucesso!');
                                    setEditingUser(null);
                                    fetchUsuarios();
                                } catch (error) {
                                    if (error.response.status == 403) {
                                        alert("Sessão expirada, faça login novamente!")
                                        return navigate('/login')
                                    }
                                    alert('Erro ao atualizar usuário.');
                                    console.error(error);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="label">Nome</label>
                                        <Field name="nome" className="input input-bordered w-full" />
                                        <ErrorMessage name="nome" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <Field name="email" type="email" className="input input-bordered w-full" />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Telefone</label>
                                        <Field name="telefone" className="input input-bordered w-full" />
                                        <ErrorMessage name="telefone" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">CPF</label>
                                        <Field name="cpf" className="input input-bordered w-full" />
                                        <ErrorMessage name="cpf" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Função</label>
                                        <Field name="role" as="select" className="select select-bordered w-full">
                                            <option value="">Selecione</option>
                                            <option value="user">Usuário</option>
                                            <option value="admin">Administrador</option>
                                        </Field>
                                        <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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