// import React from "react";
import Chart from "../components/category/category_chart/category_chart";
import Table from "../components/category/category_table/category_table";
import Chart2 from "../components/category/category_chart/category_pie_chart";
import Chart3 from "../components/category/category_chart/category_bar_graph";
import CategoryCreate from "../components/category/categoryCreate/categoryCreate";

const category_home = () => {
  return (
    <div>
      <CategoryCreate />
      <Table />
      <Chart />
      <Chart2 />
      <Chart3 />
    </div>
  );
};

export default category_home;
