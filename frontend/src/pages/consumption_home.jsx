import { HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import ConsumptionTable from "../components/consumption/consumptionTable/consumptionTable";
import BarChart from "../components/consumption/consumptionChart/barChart/barChart";
import AreaChart from "../components/consumption/consumptionChart/areaChart/areaChart";
import PieChart from "../components/consumption/consumptionChart/pieChart/pieChart";
import RadialBarChart from "../components/consumption/consumptionChart/radialBarChart/radialBarChart";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Modal from "../components/consumption/consumptionCreateModel/consumptionCreateModel";
import ConsumptionSummery from "../components/consumption/consumptionSummery/consumptionSummery";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ContactPage = ({ image }) => {
  const defaultDescription =
    "Track and manage your household inventory effortlessly with TidyHome. Keep an eye on your stock, monitor usage, and reduce waste with our smart home stock management system.";
  const defaultKeywords =
    "home inventory, stock management, household stock, consumption log, home storage, pantry tracking, home supplies tracker, inventory tracking, stock monitoring, home organization, household management, grocery tracking, smart home stock, kitchen inventory, home essentials, home stock control";
  const defaultTitle = "TidyHome | Consumption Home";
  const defaultImage = "https://placehold.co/600x400/png";

  // Define layouts for different breakpoints
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "consumptionTable", x: 0, y: 0, w: 12, h: 5 },
      { i: "barChart", x: 0, y: 4, w: 6, h: 4 },
      { i: "areaChart", x: 6, y: 4, w: 6, h: 4 },
      { i: "pieChart", x: 0, y: 8, w: 6, h: 4 },
      { i: "radialBarChart", x: 6, y: 8, w: 6, h: 4 },
    ],
    md: [
      { i: "consumptionTable", x: 0, y: 0, w: 8, h: 5 },
      { i: "barChart", x: 0, y: 4, w: 4, h: 4 },
      { i: "areaChart", x: 4, y: 4, w: 4, h: 4 },
      { i: "pieChart", x: 0, y: 8, w: 4, h: 4 },
      { i: "radialBarChart", x: 4, y: 8, w: 4, h: 4 },
    ],
    sm: [
      { i: "consumptionTable", x: 0, y: 0, w: 6, h: 5 },
      { i: "barChart", x: 0, y: 4, w: 6, h: 4 },
      { i: "areaChart", x: 0, y: 8, w: 6, h: 4 },
      { i: "pieChart", x: 0, y: 12, w: 6, h: 4 },
      { i: "radialBarChart", x: 0, y: 16, w: 6, h: 4 },
    ],
  });

  // Define breakpoints and column counts
  const breakpoints = { lg: 1200, md: 996, sm: 768 };
  const cols = { lg: 12, md: 8, sm: 6 };

  const onLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "20px", background: "#ffffff" }}>
      <style>{`
        .grid-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          transition: 0.3s ease;
          
        }

        .grid-item:hover {
          box-shadow: 0 4px 8px rgba(191, 191, 191, 0.55);
          transition: box-shadow 0.3s ease;
        }

        .container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .content {
          width: 100%;
        }
        .create-consumption-button{
          background: linear-gradient(to right, #C799FF, #8f94fb) !important;
          color: white;
          margin: 20px 20px;
            padding: 10px;
    
    
    border: none;
    border-radius: 4px;
    cursor: pointer;
    

        
          }
          .create-consumption-button:hover{
            background: linear-gradient(to right, #C799FF, #8f94fb) !important;
            color: white;
            
            }
      `}</style>

      <div className="container">
        <div className="content">
          <HelmetProvider>
            <title>{defaultTitle}</title>
            <link
              rel="icon"
              type="image/png"
              href={image || defaultImage}
              sizes="16x16"
            />
            <meta name="description" content={defaultDescription} />
            <meta name="keywords" content={defaultKeywords} />
            <meta property="og:title" content={defaultTitle} />
            <meta property="og:description" content={defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:title" content={defaultTitle} />
            <meta name="twitter:description" content={defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
            <meta name="twitter:card" content="summary_large_image" />
          </HelmetProvider>
          <ConsumptionSummery />
          <button className="create-consumption-button" onClick={openModal}>
            Create Consumption
          </button>
          <Modal isOpen={isModalOpen} closeModal={closeModal} />

          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={100}
            isDraggable={true}
            isResizable={true}
            draggableHandle=".drag-handle"
            margin={[20, 20]}
          >
            <div key="consumptionTable" className="grid-item">
              <div
                className="drag-handle"
                style={{
                  padding: "10px",
                  
                  cursor: "move",
                  marginBottom: "10px",
                }}
              >
                Consumption Table
              </div>
              <div style={{ padding: "20px" }}>
                <ConsumptionTable />
              </div>
            </div>

            <div key="barChart" className="grid-item">
              <div
                className="drag-handle"
                style={{
                  padding: "10px",
                  
                  cursor: "move",
                  marginBottom: "10px",
                }}
              >
                Bar Chart
              </div>
              <div style={{ padding: "20px" }}>
                <BarChart />
              </div>
            </div>

            <div key="areaChart" className="grid-item">
              <div
                className="drag-handle"
                style={{
                  padding: "10px",
                  
                  cursor: "move",
                  marginBottom: "10px",
                }}
              >
                Area Chart
              </div>
              <div style={{ padding: "20px" }}>
                <AreaChart />
              </div>
            </div>

            <div key="pieChart" className="grid-item">
              <div
                className="drag-handle"
                style={{
                  padding: "10px",
                  // background:"linear-gradient(to right, #C799FF, #8f94fb) ",
                  // borderRadius: "10px",
                  cursor: "move",
                  marginBottom: "10px",
                  
                }}
              >
                Pie Chart
              </div>
              <div style={{ padding: "20px" }}>
                <PieChart />
              </div>
            </div>

            <div key="radialBarChart" className="grid-item">
              <div
                className="drag-handle"
                style={{
                  padding: "10px",
                  
                  cursor: "move",
                  marginBottom: "10px",
                }}
              >
                Radial Bar Chart
              </div>
              <div style={{ padding: "20px" }}>
                <RadialBarChart />
              </div>
            </div>
          </ResponsiveGridLayout>
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