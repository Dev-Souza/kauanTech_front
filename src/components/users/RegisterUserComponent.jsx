import { Formik, Field, Form } from 'formik';
import kauanTech from '../../services/kauanTech';
import viaCep from '../../services/viaCep';
import { useEffect, useState } from 'react';
import { mask } from 'remask';

export default function RegisterUserComponent() {
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState(null);

    useEffect(() => {
        const buscarCep = async () => {
            if (formValues?.endereco?.cep?.length === 8) {
                try {
                    const response = await viaCep.get(`${formValues.endereco.cep}/json/`);
                    const data = response.data;

                    if (!data.erro) {
                        setFormValues(prev => ({
                            ...prev,
                            endereco: {
                                ...prev.endereco,
                                logradouro: data.logradouro,
                                bairro: data.bairro,
                                localidade: data.localidade,
                                uf: data.uf,
                            }
                        }));
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        };

        buscarCep();
    }, [formValues?.endereco?.cep]);

    async function cadastrarUser(values) {
        try {
            await kauanTech.post('/clientes', values);
            alert("Cadastro foi efetuado com sucesso!");
        } catch (error) {
            setError(error);
        }
    }

    const user = {
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
            numero: ''
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Registrar Usuário</h1>

                <Formik
                    initialValues={formValues || user}
                    enableReinitialize
                    onSubmit={values => cadastrarUser(values)}
                >
                    {({ values, handleChange, setFieldValue }) => {
                        // Atualiza o formValues quando algo muda
                        useEffect(() => {
                            setFormValues(values);
                        }, [values]);

                        // Padão da máscara
                        const pattern = '999.999.999-99'
                        // Add máscara no campo
                        values.cpf = mask(values.cpf, pattern);
                        return (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <Field
                                        type="text"
                                        name="nome"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                                    <Field
                                        type="text"
                                        name="cpf"
                                        value={values.cpf}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                                    <Field
                                        type="password"
                                        name="senha"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                    <Field
                                        type="text"
                                        name="telefone"
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold mt-6 mb-2">Endereço</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">CEP</label>
                                        <Field
                                            type="text"
                                            name="endereco.cep"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                                        <Field
                                            type="text"
                                            name="endereco.logradouro"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                                        <Field
                                            type="text"
                                            name="endereco.complemento"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                        <Field
                                            type="text"
                                            name="endereco.bairro"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Localidade</label>
                                        <Field
                                            type="text"
                                            name="endereco.localidade"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">UF</label>
                                        <Field
                                            type="text"
                                            name="endereco.uf"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Número</label>
                                        <Field
                                            type="text"
                                            name="endereco.numero"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Registrar
                                    </button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}