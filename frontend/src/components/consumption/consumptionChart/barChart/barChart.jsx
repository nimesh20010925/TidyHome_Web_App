'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';
import PropTypes from 'prop-types';

// Extended color palette
const COLORS = [
  '#00C4B4',
  '#8884d8',
  '#ff7300',
  '#82ca9d',
  '#ffc658',
  '#ff6f61',
];

function BarChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        setLoading(true);
        const consumptions = await ConsumptionService.getAllConsumptions();
        console.log("Fetched consumptions:", consumptions);

        const { processedData, uniqueProducts } = processConsumptionData(consumptions);
        setChartData(processedData);
        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Error fetching consumptions:", err);
        setError("Failed to load consumption data.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsumptions();
  }, []);

  const processConsumptionData = (consumptions) => {
    const uniqueProducts = [...new Set(consumptions.map((item) => item.product_name))];

    // Aggregate data with additional details
    const productTotals = {};
    consumptions.forEach((item) => {
      const product = item.product_name;
      const amount = parseFloat(item.amount_used) || 0;
      
      if (!productTotals[product]) {
        productTotals[product] = { 
          name: product,
          totalAmount: 0,
          count: 0,
          lastDate: item.date,
        };
      }
      
      productTotals[product].totalAmount += amount;
      productTotals[product].count += 1;
      productTotals[product].lastDate = new Date(item.date) > new Date(productTotals[product].lastDate) 
        ? item.date 
        : productTotals[product].lastDate;
      
      // Set the product-specific value
      productTotals[product][product] = productTotals[product].totalAmount;
    });

    const processedData = Object.values(productTotals);
    return { processedData, uniqueProducts };
  };

  const totalConsumption = chartData.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h5 className="text-2xl font-bold mb-4 text-gray-800 " style={{textAlign: 'left'}}>
        Total Product Consumption
      </h5>
      
      {loading && (
        <div className="text-center py-4 text-gray-600">Loading chart...</div>
      )}
      
      {error && (
        <div className="alert alert-danger p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!loading && !error && chartData.length === 0 && (
        <div className="text-center py-4 text-gray-600">
          No consumption data available for Bar Chart
        </div>
      )}
      
      {!loading && !error && chartData.length > 0 && (
        <div style={{ width: '100%', height: 310 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ 
                  value: 'Amount Used', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 10 
                }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip totalConsumption={totalConsumption} />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ paddingBottom: 10 }}
              />
              {products.map((product, index) => (
                <Bar
                  key={product}
                  dataKey={product}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                  name={product}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, totalConsumption }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.totalAmount / totalConsumption) * 100).toFixed(2);
    
    return (
      <div style={{
        backgroundColor: 'rgba(38, 38, 38, 0.74)',  
        padding: '16px', 
        color: '#fff',    
        borderRadius: '6px',  
        boxShadow: '0 4px 6px rgba(38, 38, 38, 0.24)',  
      }}>
        <p className="text-lg font-semibold mb-2">{label}</p>
        <div className="flex flex-col gap-2">
          <p style={{ color: payload[0].color }}>
            <span className="font-medium">Total Used:</span> {data.totalAmount.toLocaleString()}
          </p>
          <p style={{ color: payload[0].color }}>
            <span className="font-medium">Percentage:</span> {percentage}%
          </p>
          <p style={{ color: payload[0].color }}>
            <span className="font-medium">Records:</span> {data.count}
          </p>
          <p style={{ color: payload[0].color }}>
            <span className="font-medium">Last Used:</span> {new Date(data.lastDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      payload: PropTypes.object,
    })
  ),
  label: PropTypes.string,
  totalConsumption: PropTypes.number,
};

export default BarChartComponent;