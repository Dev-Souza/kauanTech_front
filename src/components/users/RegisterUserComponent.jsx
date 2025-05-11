import { Formik } from 'formik';

export default function RegisterUserComponent() {
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

  const cadastrarUser = (values) => {
    alert("OPA!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar Usuário</h1>
        <Formik initialValues={user} onSubmit={cadastrarUser}>
          {(props) => (
            <form onSubmit={props.handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.nome}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  id="cpf"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.cpf}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  name="senha"
                  id="senha"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.senha}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  id="telefone"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.telefone}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botão */}
              <div className="text-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Registrar
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}