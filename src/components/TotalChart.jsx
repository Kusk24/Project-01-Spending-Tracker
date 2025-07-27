import { LineChart, PieChart } from "@mui/x-charts";
import React from "react";

export const TotalChart = ({ groupByCategory }) => {
  // Pie chart: total per category (all time)
  const pieChartData = Object.keys(groupByCategory).map(category => {
    const total = groupByCategory[category].reduce((sum, item) => sum + parseFloat(item.amount), 0);
    return {
      id: category,
      value: total,
      label: category
    };
  });
  // Line chart: all time, by date
  const allItems = Object.values(groupByCategory).flat();
  const sortedItems = allItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  const xAxisDates = sortedItems.map(item => item.date);
  const categories = Object.keys(groupByCategory);
  const series = categories.map(category => {
    const amounts = xAxisDates.map(date => {
      const found = groupByCategory[category].find(item => item.date === date);
      return found ? parseFloat(found.amount) : 0;
    });
    return {
      data: amounts,
      label: category,
      area: true,
    };
  });
  return (
    <div>
      <h4>All Time Pie Chart & Line Chart</h4>
      <LineChart
        xAxis={[{ data: xAxisDates, scaleType: 'point', label: 'Date' }]}
        series={series}
        height={300}
      />
      <PieChart
        series={[{ data: pieChartData }]}
        width={300}
        height={300}
      />
    </div>
  );
};