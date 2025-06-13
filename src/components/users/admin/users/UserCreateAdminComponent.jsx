import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingComponent from '../../../utils/LoadingComponent';
import { useEffect, useState } from 'react';
import kauanTech from '../../../../services/kauanTech';
import { useNavigate } from 'react-router-dom';

const validationSchemaStep1 = Yup.object({
    nome: Yup.string().required('Obrigatório'),
    email: Yup.string().email('Email inválido').required('Obrigatório'),
    senha: Yup.string().required('Obrigatório').min(6, 'Mínimo 6 caracteres'),
    telefone: Yup.string()
        .required('Obrigatório')
        .matches(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
    role: Yup.string().oneOf(['user', 'admin']).required('Obrigatório'),
});

const validationSchemaStep2 = Yup.object({
    endereco: Yup.object({
        cep: Yup.string().required('Obrigatório'),
        logradouro: Yup.string().required('Obrigatório'),
        complemento: Yup.string(),
        bairro: Yup.string().required('Obrigatório'),
        localidade: Yup.string().required('Obrigatório'),
        uf: Yup.string()
            .required('Obrigatório')
            .length(2, 'UF deve ter 2 caracteres'),
        numero: Yup.string().required('Obrigatório'),
    }),
});

export default function UserCreateAdminComponent() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const authToken = localStorage.getItem('token');
                setToken(authToken);
                await kauanTech.get('admin', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                alert(error?.response?.data?.mensagem || 'Acesso negado');
                navigate('/login');
            }
        };
        checkAdmin();
    }, []);

    const initialValues = {
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: '',
        endereco: {
            cep: '',
            logradouro: '',
            complemento: '',
            bairro: '',
            localidade: '',
            uf: '',
            numero: '',
        },
        role: 'user',
    };

    // Função para validação condicional conforme step
    const currentValidationSchema = step === 1 ? validationSchemaStep1 : validationSchemaStep2;

    const handleSubmit = async (values, actions) => {
        if (step === 1) {
            // Apenas avança para o próximo step após validar os dados do passo 1
            setStep(2);
            actions.setTouched({}); // resetar erros de validação do primeiro passo
        } else {
            // Envia o formulário completo no segundo passo
            try {
                setLoading(true);
                await kauanTech.post('/clientes', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                alert('Usuário cadastrado com sucesso!');
                navigate('/admin/users/manage');
            } catch (error) {
                alert('Erro ao cadastrar usuário!');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <LoadingComponent />;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Cadastrar Usuário</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched }) => {
                    return (
                        <Form className="space-y-4">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="label">Nome</label>
                                        <Field name="nome" className="input input-bordered w-full" />
                                        <ErrorMessage
                                            name="nome"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">CPF</label>
                                        <Field name="cpf" className="input input-bordered w-full" />
                                        <ErrorMessage
                                            name="cpf"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Senha</label>
                                        <Field
                                            type="password"
                                            name="senha"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="senha"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Telefone</label>
                                        <Field name="telefone" className="input input-bordered w-full" />
                                        <ErrorMessage
                                            name="telefone"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Role</label>
                                        <Field
                                            as="select"
                                            name="role"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </Field>
                                        <ErrorMessage
                                            name="role"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" className="btn btn-primary">
                                            Próximo
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h3 className="font-semibold mb-4">Endereço</h3>

                                    <div>
                                        <label className="label">CEP</label>
                                        <Field
                                            name="endereco.cep"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.cep"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Logradouro</label>
                                        <Field
                                            name="endereco.logradouro"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.logradouro"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Número</label>
                                        <Field
                                            name="endereco.numero"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.numero"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Complemento</label>
                                        <Field
                                            name="endereco.complemento"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.complemento"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Bairro</label>
                                        <Field
                                            name="endereco.bairro"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.bairro"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Cidade</label>
                                        <Field
                                            name="endereco.localidade"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.localidade"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">UF</label>
                                        <Field
                                            name="endereco.uf"
                                            className="input input-bordered w-full"
                                        />
                                        <ErrorMessage
                                            name="endereco.uf"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setStep(1)}
                                        >
                                            Voltar
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Cadastrar
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );
}