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
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Login de Usuário</h2>
                    <Formik
                        initialValues={{
                            email: '',
                            senha: ''
                        }}
                        // validationSchema={} 
                        onSubmit={values => autenticar(values)}>
                        {() => (
                            <Form className="space-y-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text">E-mail</span>
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="input input-bordered w-full"
                                        placeholder="seuemail@exemplo.com"
                                    />
                                    {/* <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" /> */}
                                </div>

                                <div className="form-control">
                                    <label className="label" htmlFor="senha">
                                        <span className="label-text">Senha</span>
                                    </label>
                                    <Field
                                        type="password"
                                        name="senha"
                                        id="senha"
                                        className="input input-bordered w-full"
                                        placeholder="••••••••"
                                    />
                                    {/* <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" /> */}
                                </div>

                                <div className="form-control mt-6">
                                    <button type="submit" className="btn btn-primary w-full">
                                        Entrar
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}