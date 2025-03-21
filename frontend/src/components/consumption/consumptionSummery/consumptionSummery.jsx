import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './consumptionSummery.css';
import { ConsumptionService } from '../../../services/consumptionServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HomeSummary = () => {
  const [items, setItems] = useState({ top: [], less: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('top');
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchConsumptionData = async () => {
      try {
        const consumptions = await ConsumptionService.getAllConsumptions();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyConsumptions = consumptions.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getMonth() === currentMonth &&
            itemDate.getFullYear() === currentYear
          );
        });

        const aggregatedData = monthlyConsumptions.reduce((acc, item) => {
          const productName = item.product_name;
          const amountUsed = parseFloat(item.amount_used) || 0;
          acc[productName] = (acc[productName] || 0) + amountUsed;
          return acc;
        }, {});

        const sortedItems = Object.entries(aggregatedData)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        const topItems = sortedItems.slice(0, 4);
        const lessItems = sortedItems.slice(-4).reverse();

        setItems({ top: topItems, less: lessItems });
      } catch (err) {
        setError('Failed to load consumption data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptionData();
  }, []);

  const slides = [
    {
      title: 'Top Consumed Items',
      data: items.top,
    },
    {
      title: 'Less Consumed Items',
      data: items.less,
    },
  ];

  const currentData = viewMode === 'top' ? slides[0] : slides[1];

  return (
    <div className="summary-wrapper">
      <button
        onClick={() => setShow(prev => !prev)}
        className="visibility-toggle"
        style={{ fontSize: '1.1rem', padding: '5px 10px' }}
      >
        <FontAwesomeIcon 
  icon={show ? faEye : faEyeSlash} 
  color={show ? "#000000" : "#000000"}
/>
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            className="summary-section"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="carousel-container">
                <div className="carousel-slide">
                  <h4>{currentData.title}</h4>
                  <div className="item-grid">
                    {currentData.data.map((item, index) => (
                      <div className="item-box" key={index}>
                        <div
                          className="item-avatar"
                          style={{
                            backgroundColor: ['#e6f0fa', '#f0e6fa', '#faefe6', '#fae6e6'][index],
                          }}
                        >
                          🛒
                        </div>
                        <div className="item-details">
                          <h3>{item.value.toFixed(2)}</h3>
                          <p>{item.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div 
                  style={{ 
                    position: 'absolute',
                    top: '10px',
                    right: '10px'
                  }}
                >
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    style={{ padding: '5px',  borderRadius: '5px', border:'none' }}

                  >
                    <option value="top">Top Consumed Items</option>
                    <option value="less">Less Consumed Items</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeSummary;