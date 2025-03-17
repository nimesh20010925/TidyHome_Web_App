'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import PropTypes from 'prop-types';


const consumption = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

function AreaChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={consumption}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" strokeDasharray="5,5" />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" stackId="1" />
        <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d"stackId="1" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
          <p className="text-sm text-blue-400">
            Product 1
            <span className="ml-2">${payload[0].value}</span>
          </p>
          <p className="text-sm text-indigo-400">
            Product 2
            <span className="ml-2">${payload[1]?.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // ✅ Add PropTypes validation
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
  };
  

export default AreaChartComponent;