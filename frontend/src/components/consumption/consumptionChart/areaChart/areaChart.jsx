'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import PropTypes from 'prop-types';
import { ConsumptionService } from '../../../../services/consumptionServices';

// Colors for different products (you can expand this list)
const COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ffbb28', '#00C49F'];

function AreaChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();
        console.log("Fetched consumptions:", consumptions);

        // Process the data
        const processedData = processConsumptionData(consumptions);
        setChartData(processedData.chartData);
        setProducts(processedData.uniqueProducts);
      } catch (err) {
        console.error("Error fetching consumptions:", err);
        setError("Failed to load consumption data.");
      }
    };
    fetchConsumptions();
  }, []);

  // Process consumption data to group by month and product_name
  const processConsumptionData = (consumptions) => {
    // Get unique product names
    const uniqueProducts = [...new Set(consumptions.map((item) => item.product_name))];

    // Group data by month
    const monthlyData = {};

    consumptions.forEach((item) => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2025"

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { name: monthYear };
        uniqueProducts.forEach((product) => {
          monthlyData[monthYear][product] = 0;
        });
      }

      // Add amount_used (convert to number)
      const amount = parseFloat(item.amount_used) || 0;
      monthlyData[monthYear][item.product_name] = (monthlyData[monthYear][item.product_name] || 0) + amount;
    });

    // Convert monthlyData object to array for the chart
    const chartData = Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA - dateB;
    });

    return { chartData, uniqueProducts };
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {chartData.length === 0 && !error ? (
        <div>No consumption data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="5,5" />
            {products.map((product, index) => (
              <Area
                key={product}
                type="monotone"
                dataKey={product}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                stackId="1"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}
            <span className="ml-2">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// PropTypes validation for CustomTooltip
CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

export default AreaChartComponent;