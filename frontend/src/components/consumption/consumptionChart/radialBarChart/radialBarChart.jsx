'use client';
import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';

// Extended color palette for better visual distinction
const COLORS = [
  '#00C4B4',
  '#8884d8',
  '#ff7300',
  '#82ca9d',
  '#ffc658',
  '#ff6f61',
];

const legendStyle = {
  top: '90%',
  left: '50%',
  transform: 'translateX(-50%)',
  lineHeight: '24px',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '10px',
  borderRadius: '8px',
};

/**
 * RadialBarChartComponent - A React component that displays consumption data in a radial bar chart format
 * @description Enhanced version with beautiful styling and heading
 */
function RadialBarChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();
        console.log("Fetched consumptions:", consumptions);
        const processedData = processConsumptionData(consumptions);
        setChartData(processedData);
      } catch (err) {
        console.error("Error fetching consumptions:", err);
        setError("Failed to load consumption data.");
      }
    };
    fetchConsumptions();
  }, []);

  const processConsumptionData = (consumptions) => {
    const uniqueProducts = [...new Set(consumptions.map((item) => item.product_name))];
    
    return uniqueProducts.map((product, index) => {
      const totalAmount = consumptions
        .filter((item) => item.product_name === product)
        .reduce((sum, item) => sum + (parseFloat(item.amount_used) || 0), 0);

      return {
        name: product,
        uv: totalAmount,
        fill: COLORS[index % COLORS.length],
      };
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className=" max-w-2xl w-full  rounded-lg">
        {/* Chart Heading */}
        <div className="mb-6 text-center">
          <h5 style={{textAlign: 'left'}}>
            Product Consumption Overview
          </h5>
          
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Chart Content */}
        {chartData.length === 0 && !error ? (
          <div className="text-center py-10 text-gray-600 font-medium">
            No consumption data available to display
          </div>
        ) : (
          <div style={{ width: '100%', height: 310 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={15}
                data={chartData}
                className="radialbarchart"
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  minAngle={15}
                  label={{ 
                    position: 'insideStart', 
                    fill: '#fff',
                    fontSize: 12,
                    formatter: (value) => `${value.toFixed(1)}`
                  }}
                  background={{ fill: '#eee' }}
                  clockWise
                  dataKey="uv"
                  cornerRadius={5}
                />
                <Legend
                  iconSize={12}
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={legendStyle}
                  className="legendradialbarchart"
                  formatter={(value) => (
                    <span className="text-gray-700 font-medium">{value}</span>
                  )}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default RadialBarChartComponent;