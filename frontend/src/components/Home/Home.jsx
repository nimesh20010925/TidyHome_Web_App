import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout"; // Corrected import
import HomeSummary from "./HomeModals/HomeSummary";
import SpecialNotices from "./HomeModals/SpecialNotices";
import ShoppingDashboard from "./HomeModals/ShoppingDashboard";
import ShoppingListDisplay from "./HomeModals/ShoppingListDisplay";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home = () => {
  // Define layout for different breakpoints
  const layouts = {
    lg: [
      { i: "SpecialNotices", x: 0, y: 0, w: 8, h: 7 },
      { i: "HomeSummary", x: 6, y: 0, w: 6, h: 7 },
      { i: "ShoppingDashboard", x: 0, y: 7, w: 6, h: 12 },
      { i: "ShoppingListDisplay", x: 6, y: 7, w: 6, h: 15 },
    ],
    md: [
      { i: "SpecialNotices", x: 0, y: 0, w: 18, h: 8 },
      { i: "HomeSummary", x: 4, y: 0, w: 8, h: 7 },
      { i: "ShoppingDashboard", x: 0, y: 7, w: 8, h: 12 },
      { i: "ShoppingListDisplay", x: 4, y: 7, w: 8, h: 12 },
    ],
    sm: [
      { i: "SpecialNotices", x: 0, y: 0, w: 18, h: 10 },
      { i: "HomeSummary", x: 0, y: 4, w: 4, h: 8 },
      { i: "ShoppingDashboard", x: 0, y: 8, w: 8, h: 15 },
      { i: "ShoppingListDisplay", x: 0, y: 12, w: 8, h: 15 },
    ],
  };

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts} // Use corrected variable name
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 8, sm: 4 }}
        rowHeight={30}
        autoSize={true} // Makes layout adjust dynamically
        isResizable={true} // Enable resizing
        isDraggable={true} // Enable dragging
        useCSSTransforms={true} // Improves performance
        onDragStop={() => {
          // This ensures buttons are clickable after dragging stops
          setTimeout(() => {
            document.querySelectorAll("button").forEach((btn) => {
              btn.style.pointerEvents = "auto";
            });
          }, 100);
        }}
      >
        {/* Each component becomes a draggable/resizable grid item */}
        <div key="SpecialNotices" className="p-4 bg-white shadow-sm rounded-lg">
          <SpecialNotices />
        </div>
        <div key="HomeSummary" className="p-4 bg-white shadow-sm rounded-lg">
          <HomeSummary />
        </div>
        <div key="ShoppingDashboard" className="p-4 bg-white shadow-sm rounded-lg">
          <ShoppingDashboard />
        </div>
        <div key="ShoppingListDisplay" className="p-4 bg-white shadow-sm rounded-lg">
          <ShoppingListDisplay />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Home;
