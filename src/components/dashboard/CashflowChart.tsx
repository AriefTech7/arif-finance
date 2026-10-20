import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { CashflowPoint } from '../../types/finance'
import { formatRupiah, formatRupiahShort } from '../../utils/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface CashflowChartProps {
  data: CashflowPoint[]
}

/** Grafik arus kas 6 bulan terakhir (pemasukan vs pengeluaran). */
export function CashflowChart({ data }: CashflowChartProps) {
  const chartData = {
    labels: data.map((point) => point.label),
    datasets: [
      {
        label: 'Pemasukan',
        data: data.map((point) => point.income),
        borderColor: '#20b486',
        backgroundColor: 'rgba(32, 180, 134, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#20b486',
      },
      {
        label: 'Pengeluaran',
        data: data.map((point) => point.expense),
        borderColor: '#f49a42',
        backgroundColor: 'rgba(244, 154, 66, 0.04)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#f49a42',
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, padding: 20, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.dataset.label ?? ''}: ${formatRupiah(item.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#eef1f5' },
        ticks: { callback: (value) => formatRupiahShort(Number(value)) },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
    },
  }

  return (
    <div className="chart-wrap">
      <Line data={chartData} options={options} aria-label="Grafik arus kas" role="img" />
    </div>
  )
}
