import { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { ConsumptionService } from '../../../../services/consumptionServices'; // Import the service

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

      // Format data for Pie chart (assuming the data has a `product_name` and `amount_used`)
      const pieData = consumptions.map(consumption => ({
        name: consumption.product_name,
        value: parseInt(consumption.amount_used, 10), // Ensure value is a number
      }));

      this.setState({ pieData });
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
          {`(Value: ${value}, ${(percent * 100).toFixed(2)}%)`}
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
              activeShape={this.renderActiveShape} // Use the defined renderActiveShape function
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
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