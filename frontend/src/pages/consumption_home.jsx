import { HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";

import ConsumptionTable from "../components/consumption/consumptionTable/consumptionTable";
import BarChart from "../components/consumption/consumptionChart/barChart/barChart";
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useState } from 'react';

const ContactPage = ({ image }) => {
  const defaultDescription =
    "Track and manage your household inventory effortlessly with TidyHome. Keep an eye on your stock, monitor usage, and reduce waste with our smart home stock management system.";
  const defaultKeywords =
    "home inventory, stock management, household stock, consumption log, home storage, pantry tracking, home supplies tracker, inventory tracking, stock monitoring, home organization, household management, grocery tracking, smart home stock, kitchen inventory, home essentials, home stock control";
  const defaultTitle = "TidyHome | Consumption Home";
  const defaultImage = "https://placehold.co/600x400/png";

  const Dashboard = () => {
    // Initial state of items
    const [items, setItems] = useState([
      { i: '1', x: 0, y: 0, w: 2, h: 2 },
      { i: '2', x: 2, y: 0, w: 2, h: 2 },
      { i: '3', x: 0, y: 2, w: 2, h: 2 },
      { i: '4', x: 2, y: 2, w: 2, h: 2 },
    ]);
  
    // Callback function to update position when an item is moved
    const onLayoutChange = (layout) => {
      setItems(layout);
    };
  
    return (
      <div>
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

            <ReactGridLayout
              className="layout"
              layout={items}
              cols={4}  // Number of columns in grid
              rowHeight={30}  // Height of each row
              width={1200}  // Total width of grid
              onLayoutChange={onLayoutChange}  // Callback to update state
            >
              <div key="1" className="box" style={{ backgroundColor: 'lightblue' }}>
                <ConsumptionTable />
              </div>
              <div key="2" className="box" style={{ backgroundColor: 'lightgreen' }}>
                <BarChart />
              </div>
              <div key="3" className="box" style={{ backgroundColor: 'lightcoral' }}>
                Widget 3
              </div>
              <div key="4" className="box" style={{ backgroundColor: 'lightyellow' }}>
                Widget 4
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

  // Return the Dashboard component from ContactPage
  return <Dashboard />;
};

export default ContactPage;