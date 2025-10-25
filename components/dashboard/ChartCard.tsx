'use client';

import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  data: any[];
  type: 'line' | 'bar';
  dataKeys: { key: string; color: string; name: string }[];
}

export default function ChartCard({ title, data, type, dataKeys }: ChartCardProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="hora" 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              opacity={0.5}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              opacity={0.5}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map((dk) => 
              type === 'line' ? (
                <Line 
                  key={dk.key}
                  type="monotone" 
                  dataKey={dk.key} 
                  stroke={dk.color}
                  strokeWidth={2}
                  name={dk.name}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ) : (
                <Bar 
                  key={dk.key}
                  dataKey={dk.key} 
                  fill={dk.color}
                  name={dk.name}
                  radius={[8, 8, 0, 0]}
                />
              )
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
