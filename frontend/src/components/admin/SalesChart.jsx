import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import api from '../../services/api/api';
import Loading from '../common/Loading';

const SalesChart = () => {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line'); // line, bar, area

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/analytics/sales?period=${period}`);
      setData(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading sales data..." />;
  }

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
          No Sales Data Available
        </h3>
        <p style={{ color: '#666' }}>
          Sales data will appear here once orders are placed.
        </p>
      </div>
    );
  }

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const ChartComponent = chartType === 'line' ? LineChart : chartType === 'bar' ? BarChart : AreaChart;
  const DataComponent = chartType === 'line' ? Line : chartType === 'bar' ? Bar : Area;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.8rem' }}>
          Sales Analytics
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Period Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f5f5f5', padding: '0.3rem', borderRadius: '8px' }}>
            {['day', 'week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: period === p ? 'var(--primary-color)' : 'transparent',
                  color: period === p ? 'white' : 'var(--dark-color)',
                  fontWeight: period === p ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {/* Chart Type Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f5f5f5', padding: '0.3rem', borderRadius: '8px' }}>
            {['line', 'bar', 'area'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: chartType === type ? 'var(--secondary-color)' : 'transparent',
                  color: chartType === type ? 'white' : 'var(--dark-color)',
                  fontWeight: chartType === type ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && summary.total_sales > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
              Total Sales
            </p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              {formatCurrency(summary.total_sales)}
            </h3>
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
              Total Orders
            </p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              {summary.total_orders}
            </h3>
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
              Avg Sales
            </p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              {formatCurrency(summary.average_sales)}
            </h3>
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
              Avg Orders
            </p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              {summary.average_orders.toFixed(1)}
            </h3>
          </div>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="label"
            stroke="#666"
            style={{ fontSize: '0.85rem' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="sales"
            stroke="#D32F2F"
            style={{ fontSize: '0.85rem' }}
            tickFormatter={formatCurrency}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            stroke="#FF9800"
            style={{ fontSize: '0.85rem' }}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
            }}
            formatter={(value, name) => {
              if (name === 'sales') return formatCurrency(value);
              return value;
            }}
          />
          <Legend />
          <DataComponent
            yAxisId="sales"
            type="monotone"
            dataKey="sales"
            stroke="#D32F2F"
            strokeWidth={3}
            fill="#D32F2F"
            fillOpacity={chartType === 'area' ? 0.6 : 0}
            name="Sales ($)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <DataComponent
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke="#FF9800"
            strokeWidth={3}
            fill="#FF9800"
            fillOpacity={chartType === 'area' ? 0.6 : 0}
            name="Orders"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

