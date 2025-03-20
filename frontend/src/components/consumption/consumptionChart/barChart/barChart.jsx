'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';
import PropTypes from 'prop-types'; // Import prop-types

// Colors for different products
const COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ffbb28', '#00C49F'];

function BarChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();
        console.log("Fetched consumptions:", consumptions);

        // Process the data
        const { processedData, uniqueProducts } = processConsumptionData(consumptions);
        setChartData(processedData);
        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Error fetching consumptions:", err);
        setError("Failed to load consumption data.");
      }
    };
    fetchConsumptions();
  }, []);

  // Process consumption data to aggregate amount_used by product_name
  const processConsumptionData = (consumptions) => {
    // Get unique product names
    const uniqueProducts = [...new Set(consumptions.map((item) => item.product_name))];

    // Aggregate amount_used for each product_name
    const productTotals = {};
    uniqueProducts.forEach((product) => {
      productTotals[product] = { name: product };
      uniqueProducts.forEach((p) => {
        productTotals[product][p] = 0;
      });
    });

    consumptions.forEach((item) => {
      const amount = parseFloat(item.amount_used) || 0;
      productTotals[item.product_name][item.product_name] = (productTotals[item.product_name][item.product_name] || 0) + amount;
    });

    const processedData = Object.values(productTotals);

    return { processedData, uniqueProducts };
  };

  return (
    <div className="p-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2 className="text-2xl font-bold mb-4">Total Consumption </h2>
      {chartData.length === 0 && !error ? (
        <div>No consumption data available for Bar Chart</div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {products.map((product, index) => (
                <Bar
                  key={product}
                  dataKey={product}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// CustomTooltip component with prop types
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        {payload.map((entry, index) => (
          entry.value > 0 && (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}
              <span className="ml-2">{entry.value}</span>
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

// Add prop type validation for CustomTooltip
CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })
  ),
  label: PropTypes.string,
};

export default BarChartComponent;