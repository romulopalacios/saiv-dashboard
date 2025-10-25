'use client';

import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  data: any[];
  type: 'line' | 'bar';
  dataKeys: { key: string; color: string; name: string }[];
  description?: string;
}

export default function ChartCard({ title, data, type, dataKeys, description }: ChartCardProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="p-6 border border-gray-200 dark:border-gray-800 transition-smooth hover-glow shadow-soft hover:shadow-lg bg-white dark:bg-gray-900">
        {/* Header minimalista */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Gráfico con fondo sutil */}
        <div className="rounded-lg bg-gray-50/50 dark:bg-gray-800/30 p-4">
          <ResponsiveContainer width="100%" height={300}>
            <ChartComponent data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor"
                opacity={0.1}
                vertical={false}
              />
              <XAxis 
                dataKey="hora" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                stroke="currentColor"
                opacity={0.3}
                axisLine={{ strokeWidth: 0 }}
                tickLine={{ strokeWidth: 0 }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                stroke="currentColor"
                opacity={0.3}
                axisLine={{ strokeWidth: 0 }}
                tickLine={{ strokeWidth: 0 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
                labelStyle={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                itemStyle={{
                  color: 'hsl(var(--foreground))',
                  fontSize: '13px',
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))', fontSize: '13px', fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />
              {dataKeys.map((dk) => 
                type === 'line' ? (
                  <Line 
                    key={dk.key}
                    type="monotone" 
                    dataKey={dk.key} 
                    stroke={dk.color}
                    strokeWidth={3}
                    name={dk.name}
                    dot={{ r: 4, fill: dk.color, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                ) : (
                  <Bar 
                    key={dk.key}
                    dataKey={dk.key} 
                    fill={dk.color}
                    name={dk.name}
                    radius={[6, 6, 0, 0]}
                  />
                )
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Footer con info sutil */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            {data.length} puntos de datos
          </span>
          <span>Actualizado recientemente</span>
        </div>
      </Card>
    </motion.div>
  );
}
