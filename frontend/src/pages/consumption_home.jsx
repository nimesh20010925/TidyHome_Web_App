import { HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import ConsumptionTable from "../components/consumption/consumptionTable/consumptionTable";
import BarChart from "../components/consumption/consumptionChart/barChart/barChart";
import AreaChart from "../components/consumption/consumptionChart/areaChart/areaChart";
import PieChart from "../components/consumption/consumptionChart/pieChart/pieChart";
import RadialBarChart  from "../components/consumption/consumptionChart/radialBarChart/radialBarChart";
import ReactGridLayout from 'react-grid-layout';
import { useState } from 'react';
import 'react-grid-layout/css/styles.css'; 
import 'react-resizable/css/styles.css'; 
import Modal from '../components/consumption/consumptionCreateModel/consumptionCreateModel';


const ContactPage = ({ image }) => {
  const defaultDescription =
    "Track and manage your household inventory effortlessly with TidyHome. Keep an eye on your stock, monitor usage, and reduce waste with our smart home stock management system.";
  const defaultKeywords =
    "home inventory, stock management, household stock, consumption log, home storage, pantry tracking, home supplies tracker, inventory tracking, stock monitoring, home organization, household management, grocery tracking, smart home stock, kitchen inventory, home essentials, home stock control";
  const defaultTitle = "TidyHome | Consumption Home";
  const defaultImage = "https://placehold.co/600x400/png";

 
  const [layout, setLayout] = useState([
    { i: 'consumptionTable', x: 0, y: 0, w: 12, h: 4 },
    { i: 'barChart', x: 0, y: 0, w: 6, h: 4 },
    { i: 'areaChart', x: 6, y: 0, w: 6, h: 4 },
    { i: 'pieChart', x: 0, y: 0, w: 6, h: 4 },
    { i: 'radialBarChart', x: 6, y: 0, w: 6, h: 4 },
  ]);

 
  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };


   const [isModalOpen, setModalOpen] = useState(false);
  
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
  
  return (
    <div>
      <style>{`
        .grid-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .grid-item:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="container">
        <div className="content">
          <HelmetProvider>
            {/* Title */}
            <title>{defaultTitle}</title>

            {/* Favicon */}
            <link
              rel="icon"
              type="image/png"
              href={image || defaultImage}
              sizes="16x16"
            />

            {/* Meta Description and Keywords */}
            <meta name="description" content={defaultDescription} />
            <meta name="keywords" content={defaultKeywords} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={defaultTitle} />
            <meta property="og:description" content={defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={window.location.href} />

            {/* Twitter Meta Tags */}
            <meta name="twitter:title" content={defaultTitle} />
            <meta name="twitter:description" content={defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
            <meta name="twitter:card" content="summary_large_image" />
          </HelmetProvider>
          <button onClick={openModal}>Create Consumption</button>

<Modal isOpen={isModalOpen} closeModal={closeModal} />
          <ReactGridLayout
            className="layout"
            layout={layout}
            onLayoutChange={onLayoutChange}
            cols={12} // Number of columns in the grid
            rowHeight={100} // Height of each row
            width={1200} // Width of the grid container
            isDraggable={true}
            isResizable={true}
            draggableHandle=".drag-handle" // Optional: specify a handle for dragging
          >
            <div key="consumptionTable" className="grid-item">
              <div className="drag-handle" style={{ 
                padding: '10px', 
                background: '#f0f0f0', 
                cursor: 'move',
                marginBottom: '10px'
              }}>
                Consumption Table
              </div>
              <div style={{ padding: '20px' }}>
                <ConsumptionTable />
              </div>
            </div>

            <div key="barChart" className="grid-item">
              <div className="drag-handle" style={{ 
                padding: '10px', 
                background: '#f0f0f0', 
                cursor: 'move',
                marginBottom: '10px'
              }}>
                Consumption Chart
              </div>
              <div style={{ padding: '20px' }}>
                <BarChart />
              </div>
            </div>

            <div key="areaChart" className="grid-item">
              <div className="drag-handle" style={{ 
                padding: '10px', 
                background: '#f0f0f0', 
                cursor: 'move',
                marginBottom: '10px'
              }}>
                Area Chart
              </div>
              <div style={{ padding: '20px' }}>
                <AreaChart />
              </div>
            </div>

            <div key="pieChart" className="grid-item">
              <div className="drag-handle" style={{ 
                padding: '10px', 
                background: '#f0f0f0', 
                cursor: 'move',
                marginBottom: '10px'
              }}>
                Pie Chart
              </div>
              <div style={{ padding: '20px' }}>
                <PieChart />
              </div>
            </div>

            <div key="radialBarChart" className="grid-item">
              <div className="drag-handle" style={{ 
                padding: '10px', 
                background: '#f0f0f0', 
                cursor: 'move',
                marginBottom: '10px'
              }}>
                Pie Chart
              </div>
              <div style={{ padding: '20px' }}>
                <RadialBarChart />
              </div>
            </div>
          </ReactGridLayout>
        </div>
      </div>

      
      
    </div>
  );
};

// PropTypes validation
ContactPage.propTypes = {
  image: PropTypes.string,
};

export default ContactPage;