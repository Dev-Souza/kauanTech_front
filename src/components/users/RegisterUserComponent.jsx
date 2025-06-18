import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup'; // Import Yup
import kauanTech from '../../services/kauanTech';
import viaCep from '../../services/viaCep';
import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { mask } from 'remask';
import HeaderPatternComponent from '../headers/HeaderPatternComponent';
import { useNavigate } from 'react-router-dom';

export default function RegisterUserComponent() {
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    const navigate = useNavigate();

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
                    // Optionally set an error state here for the user
                }
            }
        };

        buscarCep();
    }, [formValues?.endereco?.cep]);

    async function cadastrarUser(values) {
        try {
            await kauanTech.post('/clientes', values);
            alert("Cadastro foi efetuado com sucesso!");
            // Optionally reset form or redirect user
            navigate('/login')
        } catch (error) {
            alert(error.response.data.mensagem)
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

    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Nome completo é obrigatório'),
        cpf: Yup.string()
            .required('CPF é obrigatório')
            .test('len', 'CPF deve ter 11 dígitos', val => val && val.replace(/\D/g, '').length === 11),
        email: Yup.string().email('Email inválido').required('Email é obrigatório'),
        senha: Yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'), // Adjusted min length
        telefone: Yup.string()
            .required('Telefone é obrigatório')
            .test('len', 'Telefone inválido (mínimo 10 dígitos)', val => val && val.replace(/\D/g, '').length >= 10), // Adjusted message
        endereco: Yup.object().shape({
            cep: Yup.string()
                .required('CEP é obrigatório')
                .test('len', 'CEP deve ter 8 dígitos', val => val && val.replace(/\D/g, '').length === 8),
            logradouro: Yup.string().required('Logradouro é obrigatório'),
            numero: Yup.string().required('Número é obrigatório'),
            complemento: Yup.string().notRequired(),
            bairro: Yup.string().required('Bairro é obrigatório'),
            localidade: Yup.string().required('Cidade é obrigatória'),
            uf: Yup.string().required('Estado é obrigatório').length(2, 'UF deve ter 2 caracteres'),
        })
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    return (
        <>
            <HeaderPatternComponent caminho="/" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8">
                <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-xl border border-gray-200">
                    <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Registrar Usuário</h1>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-10">
                        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-md ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                1
                            </div>
                            <span className="text-sm mt-2">Informações Pessoais</span>
                        </div>
                        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-md ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                            <span className="text-sm mt-2">Endereço</span>
                        </div>
                        <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-md ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span className="text-sm mt-2">Confirmação</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-base text-red-700">Ocorreu um erro ao cadastrar. Tente novamente.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Formik
                        initialValues={formValues || user}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={values => cadastrarUser(values)}
                    >
                        {({ values, handleChange, setFieldValue, errors, touched, setFieldTouched }) => {
                            useEffect(() => {
                                setFormValues(values);
                            }, [values]);

                            // Memoize handleBlur to prevent unnecessary re-renders
                            const handleBlur = useCallback((fieldName) => (e) => {
                                handleChange(e);
                                setFieldTouched(fieldName, true);
                            }, [handleChange, setFieldTouched]);

                            const pattern_cpf = '999.999.999-99';
                            values.cpf = mask(values.cpf, pattern_cpf);

                            const pattern_tel = '(99) 99999-9999';
                            values.telefone = mask(values.telefone, pattern_tel);

                            // Function to check if step 1 fields are valid
                            const isStep1Valid = () => {
                                return (
                                    values.nome && !errors.nome &&
                                    values.cpf && !errors.cpf &&
                                    values.email && !errors.email &&
                                    values.senha && !errors.senha &&
                                    values.telefone && !errors.telefone
                                );
                            };

                            // Function to check if step 2 fields are valid
                            const isStep2Valid = () => {
                                return (
                                    values.endereco?.cep && !errors.endereco?.cep &&
                                    values.endereco?.logradouro && !errors.endereco?.logradouro &&
                                    values.endereco?.numero && !errors.endereco?.numero &&
                                    values.endereco?.bairro && !errors.endereco?.bairro &&
                                    values.endereco?.localidade && !errors.endereco?.localidade &&
                                    values.endereco?.uf && !errors.endereco?.uf
                                );
                            };

                            return (
                                <Form className="space-y-6">
                                    {/* Step 1: Informações Pessoais */}
                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="nome" className="block text-base font-medium text-gray-700 mb-2">Nome completo</label>
                                                <Field
                                                    type="text"
                                                    id="nome"
                                                    name="nome"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="Digite seu nome completo"
                                                    required
                                                    onBlur={handleBlur('nome')} // Add onBlur
                                                />
                                                {touched.nome && errors.nome && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.nome}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="cpf" className="block text-base font-medium text-gray-700 mb-2">CPF</label>
                                                <Field
                                                    type="text"
                                                    id="cpf"
                                                    name="cpf"
                                                    value={values.cpf}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="000.000.000-00"
                                                    required
                                                    onBlur={handleBlur('cpf')} // Add onBlur
                                                />
                                                {touched.cpf && errors.cpf && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.cpf}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Email</label>
                                                <Field
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="seu@email.com"
                                                    required
                                                    onBlur={handleBlur('email')} // Add onBlur
                                                />
                                                {touched.email && errors.email && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="senha" className="block text-base font-medium text-gray-700 mb-2">Senha</label>
                                                <Field
                                                    type="password"
                                                    id="senha"
                                                    name="senha"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="••••••••"
                                                    required
                                                    onBlur={handleBlur('senha')} // Add onBlur
                                                />
                                                {touched.senha && errors.senha && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.senha}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="telefone" className="block text-base font-medium text-gray-700 mb-2">Telefone</label>
                                                <Field
                                                    type="text"
                                                    id="telefone"
                                                    name="telefone"
                                                    value={values.telefone}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                    onBlur={handleBlur('telefone')} // Add onBlur
                                                />
                                                {touched.telefone && errors.telefone && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.telefone}</div>
                                                )}
                                            </div>

                                            <div className="pt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                                    disabled={!isStep1Valid()}
                                                >
                                                    Próximo
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Endereço */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="cep" className="block text-base font-medium text-gray-700 mb-2">CEP</label>
                                                <Field
                                                    type="text"
                                                    id="cep"
                                                    name="endereco.cep"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="00000-000"
                                                    required
                                                    onBlur={handleBlur('endereco.cep')} // Add onBlur
                                                />
                                                {touched.endereco?.cep && errors.endereco?.cep && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.endereco.cep}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="logradouro" className="block text-base font-medium text-gray-700 mb-2">Logradouro</label>
                                                <Field
                                                    type="text"
                                                    id="logradouro"
                                                    name="endereco.logradouro"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="Rua, Avenida, etc."
                                                    required
                                                    onBlur={handleBlur('endereco.logradouro')} // Add onBlur
                                                />
                                                {touched.endereco?.logradouro && errors.endereco?.logradouro && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.endereco.logradouro}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="numero" className="block text-base font-medium text-gray-700 mb-2">Número</label>
                                                <Field
                                                    type="text"
                                                    id="numero"
                                                    name="endereco.numero"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="Número da residência"
                                                    required
                                                    onBlur={handleBlur('endereco.numero')} // Add onBlur
                                                />
                                                {touched.endereco?.numero && errors.endereco?.numero && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.endereco.numero}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="complemento" className="block text-base font-medium text-gray-700 mb-2">Complemento</label>
                                                <Field
                                                    type="text"
                                                    id="complemento"
                                                    name="endereco.complemento"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    placeholder="Apartamento, bloco, etc."
                                                    onBlur={handleBlur('endereco.complemento')} // Add onBlur
                                                />
                                                {touched.endereco?.complemento && errors.endereco?.complemento && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.endereco.complemento}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="bairro" className="block text-base font-medium text-gray-700 mb-2">Bairro</label>
                                                <Field
                                                    type="text"
                                                    id="bairro"
                                                    name="endereco.bairro"
                                                    className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                    required
                                                    onBlur={handleBlur('endereco.bairro')} // Add onBlur
                                                />
                                                {touched.endereco?.bairro && errors.endereco?.bairro && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.endereco.bairro}</div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="localidade" className="block text-base font-medium text-gray-700 mb-2">Cidade</label>
                                                    <Field
                                                        type="text"
                                                        id="localidade"
                                                        name="endereco.localidade"
                                                        className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                        required
                                                        onBlur={handleBlur('endereco.localidade')} // Add onBlur
                                                    />
                                                    {touched.endereco?.localidade && errors.endereco?.localidade && (
                                                        <div className="text-red-500 text-sm mt-1">{errors.endereco.localidade}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="uf" className="block text-base font-medium text-gray-700 mb-2">Estado</label>
                                                    <Field
                                                        type="text"
                                                        id="uf"
                                                        name="endereco.uf"
                                                        className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                        required
                                                        onBlur={handleBlur('endereco.uf')} // Add onBlur
                                                    />
                                                    {touched.endereco?.uf && errors.endereco?.uf && (
                                                        <div className="text-red-500 text-sm mt-1">{errors.endereco.uf}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-6 flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition text-lg"
                                                >
                                                    Voltar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                                    disabled={!isStep2Valid()}
                                                >
                                                    Próximo
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Confirmação */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="font-medium text-lg text-gray-900 mb-3">Informações Pessoais</h3>
                                                <div className="mt-2 space-y-2 text-base text-gray-700">
                                                    <p><span className="font-medium">Nome:</span> {values.nome}</p>
                                                    <p><span className="font-medium">CPF:</span> {values.cpf}</p>
                                                    <p><span className="font-medium">Email:</span> {values.email}</p>
                                                    <p><span className="font-medium">Telefone:</span> {values.telefone}</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="font-medium text-lg text-gray-900 mb-3">Endereço</h3>
                                                <div className="mt-2 space-y-2 text-base text-gray-700">
                                                    <p><span className="font-medium">CEP:</span> {values.endereco.cep}</p>
                                                    <p><span className="font-medium">Logradouro:</span> {values.endereco.logradouro}, {values.endereco.numero}</p>
                                                    {values.endereco.complemento && <p><span className="font-medium">Complemento:</span> {values.endereco.complemento}</p>}
                                                    <p><span className="font-medium">Bairro:</span> {values.endereco.bairro}</p>
                                                    <p><span className="font-medium">Cidade/UF:</span> {values.endereco.localidade}/{values.endereco.uf}</p>
                                                </div>
                                            </div>

                                            <div className="pt-6 flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition text-lg"
                                                >
                                                    Voltar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                                                >
                                                    Confirmar Cadastro
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </>
    );
}