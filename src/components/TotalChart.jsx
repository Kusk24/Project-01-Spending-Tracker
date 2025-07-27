import { LineChart, PieChart } from "@mui/x-charts";
import React from "react";

export const TotalChart = ({ groupByCategory }) => {

    const pieChartData = Object.keys(groupByCategory).map(category => {
    const total = groupByCategory[category].reduce((sum, item) => sum + parseFloat(item.amount), 0);
    return {
      id: category,
      value: total,
      label: category
    };
  });
  
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
    };
  });
  
  return (
    <div className="chart-content">
      <h4 className="chart-heading">All Time Pie Chart & Line Chart</h4>
      <LineChart
        xAxis={[{ 
          data: xAxisDates, 
          scaleType: 'point', 
          label: 'All Time',
          tickLabelStyle: {
            fontSize: 0, 
          }
        }]}
        series={series}
        height={300}
        margin={{ 
          left: 70, 
          right: 40, 
          top: 40, 
          bottom: 60 
        }}
        className="custom-line-chart"
      />
      <PieChart
        series={[{ 
          data: pieChartData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
        }]}
        width={300}
        height={300}
        className="custom-pie-chart"
      />
    <p1 style={{ textAlign: 'center' }}>
        {`Pie Chart of All Time`}
      </p1>
    </div>
  );
};