'use client';
import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';

// Colors for different products
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const legendStyle = {
  top: '50%',
  right: 0,
  transform: 'translate(0, -50%)',
  lineHeight: '24px',
};

function RadialBarChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsumptions = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();
        console.log("Fetched consumptions:", consumptions);

        // Process the data
        const processedData = processConsumptionData(consumptions);
        setChartData(processedData);
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
    const processedData = uniqueProducts.map((product, index) => {
      const totalAmount = consumptions
        .filter((item) => item.product_name === product)
        .reduce((sum, item) => sum + (parseFloat(item.amount_used) || 0), 0);

      return {
        name: product,
        uv: totalAmount, // Using 'uv' as the dataKey for RadialBar, similar to the example
        fill: COLORS[index % COLORS.length], // Assign a color from COLORS array
      };
    });

    return processedData;
  };

  return (
    <div className="p-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {/* <h2 className="text-2xl font-bold mb-4">Total Consumption (Radial Chart)</h2> */}
      {chartData.length === 0 && !error ? (
        <div>No consumption data available for Radial Chart</div>
      ) : (
        <div style={{ width: '100%', height: 400 }}> {/* Fixed height wrapper */}
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={chartData}
            >
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                clockWise
                dataKey="uv"
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                wrapperStyle={legendStyle}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RadialBarChartComponent;