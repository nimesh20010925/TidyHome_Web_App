import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './consumptionSummery.css';
import { ConsumptionService } from '../../../services/consumptionServices';

const HomeSummary = () => {
  const [items, setItems] = useState({ top: [], less: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
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

  return (
    <div className="home-summary-container">
      <button
        onClick={() => setShow(!show)}
        className="toggle-button"
      >
        {show ? 'Hide Summary' : 'Show Summary'}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            className="home-summary"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <h2>Consumption Summary - This Month</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="smooth-slider">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="slide-content"
                  >
                    <h3>{slides[currentIndex].title}</h3>
                    <div className="summary-cards">
                      {slides[currentIndex].data.map((item, index) => (
                        <div className="card" key={index}>
                          <div
                            className="card-icon"
                            style={{
                              backgroundColor: ['#e6f0fa', '#f0e6fa', '#faefe6', '#fae6e6'][index],
                            }}
                          >
                            🛒
                          </div>
                          <div className="card-content">
                            <h3>{item.value.toFixed(2)}</h3>
                            <p>{item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="slider-buttons">
                  <button onClick={() => setCurrentIndex(0)}>Top Items</button>
                  <button onClick={() => setCurrentIndex(1)}>Less Items</button>
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