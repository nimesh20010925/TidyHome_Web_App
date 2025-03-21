import  { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';

const colors = [
  '#00C4B4',
  '#8884d8',
  '#ff7300',
  '#82ca9d',
  '#ffc658',
  '#ff6f61',
];

const ConsumptionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();

        const formattedData = consumptions.map(consumption => ({
          amount_used: parseFloat(consumption.amount_used) || 0,
          remaining_stock: parseFloat(consumption.remaining_stock) || 0,
          product_name: consumption.product_name,
          date: new Date(consumption.date).toLocaleDateString(),
        }));

        const products = [...new Set(
          consumptions.map(item => item.product_name)
        )];

        setChartData(formattedData);
        setProductNames(products);
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>{error}</div>;

  // Calculate min and max values with padding
  const amountUsedValues = chartData.map(d => d.amount_used);
  const remainingStockValues = chartData.map(d => d.remaining_stock);
  const xMin = Math.min(...amountUsedValues);
  const xMax = Math.max(...amountUsedValues);
  const yMin = Math.min(...remainingStockValues);
  const yMax = Math.max(...remainingStockValues);
  
  // Add padding to domain (10% of range on each side)
  const xPadding = (xMax - xMin) * 0.1;
  const yPadding = (yMax - yMin) * 0.1;

  return (
    <div className="chart-container">
      <h5 style={{ textAlign: 'left' }}>Consumption vs Stock Report</h5>
      <ResponsiveContainer width="100%" height={330}>
        <ScatterChart
          margin={{ top: 30, right: 40, left: 40, bottom: 40 }} // Increased margins
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="amount_used"
            name="Amount Used"
            // label={{ value: 'Amount Used', position: 'bottom', offset: 10 }}
            domain={[xMin - xPadding, xMax + xPadding]}
            tickCount={6}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            type="number"
            dataKey="remaining_stock"
            name="Remaining Stock"
            // label={{ value: 'Remaining Stock', angle: -90, position: 'insideLeft', offset: 10 }}
            domain={[yMin - yPadding, yMax + yPadding]}
            tickCount={6}
            padding={{ top: 10, bottom: 10 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '5px 10px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{`Product: ${data.product_name}`}</p>
                    <p style={{ margin: 0 }}>{`Date: ${data.date}`}</p>
                    <p style={{ margin: 0 }}>{`Amount Used: ${data.amount_used}`}</p>
                    <p style={{ margin: 0 }}>{`Remaining Stock: ${data.remaining_stock}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {productNames.map((product, index) => (
            <Scatter
              key={product}
              name={product}
              data={chartData.filter(item => item.product_name === product)}
              fill={colors[index % colors.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;