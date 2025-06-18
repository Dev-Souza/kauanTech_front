import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import LoadingComponent from '../../../utils/LoadingComponent';
import { useEffect, useState } from 'react';
import kauanTech from '../../../../services/kauanTech';
import { useNavigate } from 'react-router-dom';
import { mask } from 'remask';
import viaCep from '../../../../services/viaCep';

const validationSchemaStep1 = Yup.object({
    nome: Yup.string().required('Obrigatório'),
    email: Yup.string().email('Email inválido').required('Obrigatório'),
    senha: Yup.string().required('Obrigatório').min(6, 'Mínimo 6 caracteres'),
    role: Yup.string().oneOf(['user', 'admin']).required('Obrigatório'),
    cpf: Yup.string().required('Obrigatório'),
    telefone: Yup.string().required('Obrigatório'),
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

const CepManager = () => {
    const { values, setFieldValue } = useFormikContext();
    const cep = values.endereco.cep;

    useEffect(() => {
        const cleanCep = cep?.replace(/\D/g, '');

        if (cleanCep?.length === 8) {
            const fetchCep = async () => {
                try {
                    const { data } = await viaCep.get(`${cleanCep}/json/`);
                    if (!data.erro) {
                        setFieldValue('endereco.logradouro', data.logradouro);
                        setFieldValue('endereco.bairro', data.bairro);
                        setFieldValue('endereco.localidade', data.localidade);
                        setFieldValue('endereco.uf', data.uf);
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            };
            fetchCep();
        }
    }, [cep, setFieldValue]);

    return null;
};


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
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    return navigate('/login')
                }
                alert(error?.response?.data?.mensagem || 'Acesso negado');
                navigate('/login');
            }
        };
        checkAdmin();
    }, [navigate]);

    const currentValidationSchema = step === 1 ? validationSchemaStep1 : validationSchemaStep2;

    const handleSubmit = async (values, actions) => {
        if (step === 1) {
            setStep(2);
            actions.setTouched({});
            actions.setSubmitting(false);
        } else {
            setLoading(true);
            try {
                // Enviando os 'values' diretamente, com as máscaras.
                await kauanTech.post('/clientes', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                alert('Usuário cadastrado com sucesso!');
                navigate('/admin/users/manage');
            } catch (error) {
                if (error.response.status == 403) {
                    alert("Sessão expirada, faça login novamente!")
                    return navigate('/login')
                }
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
                initialValues={{
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
                }}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                        <CepManager />

                        {step === 1 && (
                            <>
                                <div>
                                    <label className="label">Nome</label>
                                    <Field name="nome" className="input input-bordered w-full" />
                                    <ErrorMessage name="nome" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">CPF</label>
                                    <Field name="cpf">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                placeholder="000.000.000-00"
                                                className="input input-bordered w-full"
                                                onChange={(e) => {
                                                    const maskedValue = mask(e.target.value, '999.999.999-99');
                                                    setFieldValue('cpf', maskedValue);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="cpf" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Email</label>
                                    <Field type="email" name="email" className="input input-bordered w-full" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Senha</label>
                                    <Field type="password" name="senha" className="input input-bordered w-full" />
                                    <ErrorMessage name="senha" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Telefone</label>
                                    <Field name="telefone">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                placeholder="(99) 99999-9999"
                                                className="input input-bordered w-full"
                                                onChange={(e) => {
                                                    const maskedValue = mask(e.target.value, '(99) 99999-9999');
                                                    setFieldValue('telefone', maskedValue);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="telefone" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Role</label>
                                    <Field as="select" name="role" className="select select-bordered w-full">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
                                    <Field name="endereco.cep" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.cep" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Logradouro</label>
                                    <Field name="endereco.logradouro" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.logradouro" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Número</label>
                                    <Field name="endereco.numero" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.numero" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Complemento</label>
                                    <Field name="endereco.complemento" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.complemento" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Bairro</label>
                                    <Field name="endereco.bairro" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.bairro" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">Cidade</label>
                                    <Field name="endereco.localidade" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.localidade" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label className="label">UF</label>
                                    <Field name="endereco.uf" className="input input-bordered w-full" />
                                    <ErrorMessage name="endereco.uf" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                        Voltar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        Cadastrar
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}