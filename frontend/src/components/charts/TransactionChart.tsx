import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  date: string;
  deposits: number;
  withdrawals: number;
}

interface TransactionChartProps {
  data: ChartData[];
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function TransactionChart({ data }: TransactionChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                RWF {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Transaction Trends
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Deposits vs Withdrawals (Last 7 Days)
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[220px] h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '10px' }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '10px' }}
              tick={{ fontSize: 10 }}
              tickFormatter={value => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 3 }}
              activeDot={{ r: 4 }}
              name="Deposits"
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', r: 3 }}
              activeDot={{ r: 4 }}
              name="Withdrawals"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
