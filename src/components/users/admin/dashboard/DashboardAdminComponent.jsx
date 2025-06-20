import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { useEffect, useState } from 'react';
import kauanTech from '../../../../services/kauanTech';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function DashboardAdminComponent() {
  const [dados, setDados] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      try {
        const [comprasResponse, produtosResponse] = await Promise.all([
          kauanTech.get('/compras', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          kauanTech.get('/produtos', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        setDados(comprasResponse.data);
        setProdutos(produtosResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, [token]);

  // Cálculos para os cards
  const totalProdutos = produtos.length;
  const produtosZerados = produtos.filter(p => p.quantidade === 0).length;
  const faturamentoTotal = dados.reduce((total, compra) => total + compra.total_pagar, 0);

  // Dados para gráfico de formas de pagamento
  const pagamentosPorForma = dados.reduce((acc, item) => {
    acc[item.forma_pagamento] = (acc[item.forma_pagamento] || 0) + 1;
    return acc;
  }, {});

  // Dados para gráfico de faturamento por forma de pagamento
  const faturamentoPorForma = dados.reduce((acc, item) => {
    acc[item.forma_pagamento] = (acc[item.forma_pagamento] || 0) + item.total_pagar;
    return acc;
  }, {});

  // Dados para gráfico de produtos mais vendidos
  const produtosVendidos = {};
  dados.forEach(compra => {
    compra.carrinho.produto.forEach(item => {
      const produtoId = item.id._id;
      const produtoNome = item.id.nome;
      produtosVendidos[produtoNome] = (produtosVendidos[produtoNome] || 0) + item.quantidade;
      console.log(produtosVendidos)
    });
  });

  const chartDataPagamentos = {
    labels: Object.keys(pagamentosPorForma),
    datasets: [
      {
        label: 'Nº de Pagamentos',
        data: Object.values(pagamentosPorForma),
        backgroundColor: ['#60A5FA', '#F59E0B', '#10B981', '#F43F5E'],
        borderWidth: 1,
      },
    ],
  };

  const chartDataFaturamento = {
    labels: Object.keys(faturamentoPorForma),
    datasets: [
      {
        label: 'Faturamento por Forma de Pagamento (R$)',
        data: Object.values(faturamentoPorForma),
        backgroundColor: ['#60A5FA', '#F59E0B', '#10B981', '#F43F5E'],
        borderWidth: 1,
      },
    ],
  };

  const chartDataProdutosVendidos = {
    labels: Object.keys(produtosVendidos),
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: Object.values(produtosVendidos),
        backgroundColor: '#60A5FA',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total de Produtos</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalProdutos}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Produtos com Estoque Zerado</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{produtosZerados}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Faturamento Total</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {faturamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Pagamentos por Forma</h2>
          <div className="h-64">
            <Pie data={chartDataPagamentos} options={options} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Faturamento por Forma de Pagamento</h2>
          <div className="h-64">
            <Bar data={chartDataFaturamento} options={options} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="h-64">
            <Bar data={chartDataProdutosVendidos} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}