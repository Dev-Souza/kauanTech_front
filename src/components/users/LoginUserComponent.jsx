import { Formik, Form, Field, ErrorMessage } from 'formik';
import kauanTech from '../../services/kauanTech';
import { useNavigate } from 'react-router-dom';
import HeaderPatternComponent from '../headers/HeaderPatternComponent';

export default function LoginUserComponent() {
    // Config navegação
    const navigate = useNavigate();

    // Function de autenticar no sistema
    const autenticar = async (values) => {
        try {
            const resultado = await kauanTech.post('auth/login', values);
            const token = (resultado.data.token);
            localStorage.setItem('token', token);
            if (resultado.data.role == 'admin') {
                navigate('/painel')
            } else {
                // Redireciona a tela inicial para users que não são admin
                navigate('/')
            }
        } catch (error) {
            alert(error.response?.data?.mensagem)
        }
    }

    return (
        <>
            <HeaderPatternComponent caminho="/"/>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8 transform transition-all hover:shadow-lg">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Bem-vindo de volta</h2>
                        <p className="text-gray-600 mt-2">Faça login para acessar sua conta</p>
                    </div>
                    
                    <Formik
                        initialValues={{
                            email: '',
                            senha: ''
                        }}
                        // validationSchema={} 
                        onSubmit={values => autenticar(values)}>
                        {() => (
                            <Form className="space-y-6">
                                <div className="form-control">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text font-medium text-gray-700">E-mail</span>
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="seuemail@exemplo.com"
                                    />
                                    {/* <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" /> */}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="senha">
                                        <span className="label-text font-medium text-gray-700">Senha</span>
                                    </label>
                                    <Field
                                        type="password"
                                        name="senha"
                                        id="senha"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                    {/* <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" /> */}
                                </div>

                                <div className="form-control mt-8">
                                    <button type="submit" className="btn btn-primary w-full py-3 text-lg font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 border-none hover:from-indigo-700 hover:to-indigo-800">
                                        Entrar
                                    </button>
                                </div>
                                
                                <div className="text-center mt-4">
                                    <p className="text-gray-600">Não tem uma conta? <a href="/registro" className="text-indigo-600 font-medium hover:text-indigo-800">Cadastre-se</a></p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}