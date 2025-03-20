'use client'; // If using Next.js App Router
import { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices';

// Function to generate a random color variant based on #8884d8
const generateColorVariant = () => {
  const baseColor = { r: 136, g: 132, b: 216 }; // RGB equivalent of #8884d8
  const variation = 50; // Max variation range for each RGB component

  const r = Math.min(255, Math.max(0, baseColor.r + Math.floor(Math.random() * variation) - variation / 2));
  const g = Math.min(255, Math.max(0, baseColor.g + Math.floor(Math.random() * variation) - variation / 2));
  const b = Math.min(255, Math.max(0, baseColor.b + Math.floor(Math.random() * variation) - variation / 2));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

class Example extends PureComponent {
  state = {
    activeIndex: 0,
    pieData: [], // Store the pie chart data
  };

  componentDidMount() {
    this.fetchConsumptionData();
  }

  fetchConsumptionData = async () => {
    try {
      // Fetch data from the service
      const consumptions = await ConsumptionService.getAllConsumptions();

      // Aggregate data by product_name and assign random color variants
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
            fill: generateColorVariant(), // Assign a random variant of #8884d8
          });
        }
        return acc;
      }, []);

      this.setState({ pieData: aggregatedData });
    } catch (error) {
      console.error('Error fetching consumption data:', error);
    }
  };

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  };

  // Define the renderActiveShape function to customize the active sector
  renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10} // Slightly larger outer radius for the active sector
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#999">
          {`(Value: ${value.toFixed(2)}, ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  render() {
    const { pieData } = this.state;

    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={this.renderActiveShape}
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={this.onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Example;