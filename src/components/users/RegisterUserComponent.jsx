import { Formik, Field, Form } from 'formik';
import kauanTech from '../../services/kauanTech';
import { useState } from 'react';

export default function RegisterUserComponent() {
    const [error, setError] = useState(null);
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

    async function cadastrarUser(values) {
        try {
            const resposta = await kauanTech.post('/clientes', values)
            alert("Cadastro foi efetuado com sucesso!")
        } catch (error) {
            setError(error)
        }
        
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Registrar Usuário</h1>

                <Formik 
                    initialValues={user} 
                    onSubmit={values => cadastrarUser(values)}>
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
                </Formik>
            </div>
        </div>
    );
}