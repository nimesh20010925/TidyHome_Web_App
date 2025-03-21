'use client'; // If using Next.js App Router
import { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';


const generateColorVariant = () => {
  const baseColor = { r: 136, g: 132, b: 216 };
  const variation = 50; 

  const r = Math.min(255, Math.max(0, baseColor.r + Math.floor(Math.random() * variation) - variation / 2));
  const g = Math.min(255, Math.max(0, baseColor.g + Math.floor(Math.random() * variation) - variation / 2));
  const b = Math.min(255, Math.max(0, baseColor.b + Math.floor(Math.random() * variation) - variation / 2));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

class EnhancedPieChart extends PureComponent {
  state = {
    activeIndex: 0,
    pieData: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchConsumptionData();
  }

  fetchConsumptionData = async () => {
    try {
      const consumptions = await ConsumptionService.getAllConsumptions();

      const aggregatedData = consumptions.reduce((acc, consumption) => {
        const productName = consumption.product_name;
        const amountUsed = parseFloat(consumption.amount_used) || 0;

        const existingProduct = acc.find(item => item.name === productName);
        if (existingProduct) {
          existingProduct.value += amountUsed;
        } else {
          acc.push({
            name: productName,
            value: amountUsed,
            fill: generateColorVariant(),
          
            count: 1, 
            lastDate: consumption.date, 
          });
        }
        return acc;
      }, []);

      this.setState({ pieData: aggregatedData, loading: false });
    } catch (error) {
      console.error('Error fetching consumption data:', error);
      this.setState({ error: 'Failed to load consumption data', loading: false });
    }
  };

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  };

  renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <text x={cx} y={cy - 20} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 15} 
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#333" fontSize={14}>
          {`Value: ${value.toFixed(2)}`}
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#666" fontSize={12}>
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  render() {
    const { pieData, loading, error, activeIndex } = this.state;

    const legendStyle = {
      top: '100%',
      right: 0,
      transform: 'translate(0, -50%)',
      lineHeight: '24px',
    };
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading chart...</div>;
    }

    if (error) {
      return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
    }

    return (
      <div style={{ width: '100%', height: 330,  }}>
        <h5 style={{ textAlign: 'left', color: '#333' }}>
          Product Consumption Distribution
        </h5>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={this.renderActiveShape}
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              onMouseEnter={this.onPieEnter}
              paddingAngle={2} // Add some separation between segments
            />
<Legend
                  iconSize={10}
                  layout="horizontal"
                  
                  verticalAlign="middle"
                  wrapperStyle={legendStyle}
                  className="legendradialbarchart"
                />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: data.fill }}>
                        {data.name}
                      </p>
                      <p style={{ margin: '5px 0' }}>{`Total Used: ${data.value.toFixed(2)}`}</p>
                      <p style={{ margin: '5px 0' }}>{`Percentage: ${(data.value / pieData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(2)}%`}</p>
                      <p style={{ margin: '5px 0' }}>{`Records: ${data.count}`}</p>
                      <p style={{ margin: '5px 0' }}>{`Last Date: ${new Date(data.lastDate).toLocaleDateString()}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default EnhancedPieChart;