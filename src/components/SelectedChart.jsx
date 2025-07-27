import { LineChart, PieChart } from '@mui/x-charts';
import React from 'react'

export const SelectedPeriodChart = ({ spendingData, selectedPeriod, selectedMonth, availableMonths }) => {

  const itemsForMonth = spendingData.filter(item => {
    const date = new Date(item.date);
    const monthStr = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    return monthStr === selectedMonth;
  });

  const pieChartData = [];
  const categoryTotals = {};
  itemsForMonth.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + parseFloat(item.amount);
  });
  Object.keys(categoryTotals).forEach(category => {
    pieChartData.push({ id: category, value: categoryTotals[category], label: category });
  });

  let xAxisDates = [];
  let categories = Array.from(new Set(spendingData.map(item => item.category)));
  let series = [];

  if (selectedPeriod === 'Monthly') {

    // console.log(...availableMonths)
    const sortedMonths = [...availableMonths].sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });

    const monthCategoryTotals = {};
    spendingData.forEach(item => {
      const date = new Date(item.date);
      const monthStr = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!monthCategoryTotals[monthStr]) monthCategoryTotals[monthStr] = {};
      monthCategoryTotals[monthStr][item.category] = (monthCategoryTotals[monthStr][item.category] || 0) + parseFloat(item.amount);
    });

    xAxisDates = sortedMonths;
    series = categories.map(category => {
      const data = xAxisDates.map(monthStr => monthCategoryTotals[monthStr]?.[category] || 0);
      return { data, label: category };
    });
  } else if (selectedPeriod === 'Daily') {

    const dateObj = new Date(`${selectedMonth.split(' ')[0]} 1, ${selectedMonth.split(' ')[1]}`);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    xAxisDates = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return d.getDate().toString();
    });
    series = categories.map(category => {
      const data = xAxisDates.map((_, index) => {
        const d = new Date(year, month, index + 1);
        const dateStr = d.toISOString().slice(0, 10);
        const found = itemsForMonth.find(item => item.category === category && item.date === dateStr);
        return found ? parseFloat(found.amount) : 0;
      });
      return { data, label: category };
    });
  } else if (selectedPeriod === 'Weekly') {

    const dateObj = new Date(`${selectedMonth.split(' ')[0]} 1, ${selectedMonth.split(' ')[1]}`);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    xAxisDates = [1, 2, 3, 4].map(weekNum => `Week ${weekNum}`);

    const weekCategoryTotals = {};
    itemsForMonth.forEach(item => {
      const date = new Date(item.date);
      if (date.getMonth() === month && date.getFullYear() === year) {
        const weekNum = Math.ceil(date.getDate() / 7);
        const weekStr = `Week ${weekNum}`;
        if (!weekCategoryTotals[weekStr]) weekCategoryTotals[weekStr] = {};
        weekCategoryTotals[weekStr][item.category] = (weekCategoryTotals[weekStr][item.category] || 0) + parseFloat(item.amount);
      }
    });
    series = categories.map(category => {
      const data = xAxisDates.map(weekStr => weekCategoryTotals[weekStr]?.[category] || 0);
      return { data, label: category };
    });
  }
  // console.log(xAxisDates);
  // console.log(series);

  return (
    <div className="chart-content">
      <h4 className="chart-heading">Pie Chart & Line Chart of {selectedMonth}</h4>
      <LineChart
        xAxis={[{
          data: xAxisDates,
          scaleType: 'point',
          label:
            selectedPeriod === 'Monthly'
              ? 'Monthly Line Chart of All Time'
              : selectedPeriod === 'Weekly'
                ? `Weekly Line Chart of ${selectedMonth}`
                : `Daily Line Chart of ${selectedMonth}`,
        }]}
        series={series.map(serie => ({
          ...serie,
          showMark: false  // This hides all markers/dots
        }))} 
        height={300}
        margin={{
          left: 70,
          right: 40,
          top: 40,
          bottom: selectedPeriod === 'Monthly' ? 100 : 60
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
      <p style={{ textAlign: 'center' }}>
        {`Pie Chart of ${selectedMonth}`}
      </p>
    </div>
  );
};