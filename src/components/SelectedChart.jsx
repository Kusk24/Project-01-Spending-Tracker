import { LineChart, PieChart } from '@mui/x-charts';
import React from 'react'

export const SelectedPeriodChart = ({ groupedSpending, selectedPeriodValue, availablePeriods }) => {
  // Use selectedPeriodValue or default to first available
  const periodKey = selectedPeriodValue || availablePeriods[0];
  // Pie chart: total per category for selected period
  const pieChartData = Object.keys(groupedSpending).map(category => {
    const items = groupedSpending[category][periodKey] || [];
    const total = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    return {
      id: category,
      value: total,
      label: category
    };
  });
  // Line chart: for each category, amounts for each date in selected period
  const allItems = Object.values(groupedSpending).map(catPeriods => catPeriods[periodKey] || []).flat();
  const sortedItems = allItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  const xAxisDates = sortedItems.map(item => item.date);
  const categories = Object.keys(groupedSpending);
  const series = categories.map(category => {
    const items = groupedSpending[category][periodKey] || [];
    const amounts = xAxisDates.map(date => {
      const found = items.find(item => item.date === date);
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
      <h4>Pie Chart & Line Chart of {periodKey}</h4>
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