import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
import kauanTech from '../../../../services/kauanTech';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardAdminComponent() {
  const [dados, setDados] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      const response = await kauanTech.get('/compras', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      } ); // endpoint fictício
      setDados(response.data);
    }
    fetchData();
  }, []);

  // Agrupamento por forma de pagamento
  const pagamentosPorForma = dados.reduce((acc, item) => {
    acc[item.forma_pagamento] = (acc[item.forma_pagamento] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>

      <div className="bg-white shadow rounded-lg p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Pagamentos por Forma</h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
}