import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SupplierChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 225);
    gradient.addColorStop(0, 'rgba(215, 227, 244, 1)');
    gradient.addColorStop(1, 'rgba(215, 227, 244, 0)');

    // Destroy the previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales ($)',
          fill: true,
          backgroundColor: gradient,
          borderColor: '#007bff',
          data: [
            2115, 1562, 1584, 1892, 1587, 1923, 2566, 2448, 2805, 3438, 2917, 3327
          ]
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0,0,0,0.0)'
            }
          },
          y: {
            ticks: {
              stepSize: 1000
            },
            grid: {
              color: 'rgba(0,0,0,0.0)'
            }
          }
        }
      }
    });

    // Cleanup function to destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="card flex-fill w-100 draggable">
      <div className="card-header">
        <h5 className="card-title mb-0">Recent Movement</h5>
      </div>
      <div className="card-body py-3">
        <canvas ref={chartRef} style={{ height: '252px', width: '100%' }} />
      </div>
    </div>
  );
};

export default SupplierChart;
