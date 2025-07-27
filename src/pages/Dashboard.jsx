import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import categoryDataJSON from '../assets/category_data.json';
import spendingDataJSON from '../assets/spending_data.json'
import { SelectedPeriodChart } from '../components/SelectedChart';
import { TotalChart } from '../components/TotalChart';

export const Dashboard = () => {
  const [categoryData, setcategoryData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [selectedPeriodValue, setSelectedPeriodValue] = useState('');

  const inputRef = useRef("");
  const selectRef = useRef("Daily");
  const initialPeriod = localStorage.getItem('period') || 'Monthly';
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  // Removed showPeriodStart and showPeriodEnd

  // const handlePeriodChange = (e) => {
  //   setSelectedPeriod(e.target.value);
  // };

  useEffect(() => {
    const stored = localStorage.getItem('categoryData');
    const spendingStored = localStorage.getItem('spendingData');
    const storedPeriod = localStorage.getItem('period');

    if (!stored) {
      localStorage.setItem('categoryData', JSON.stringify(categoryDataJSON));
      setcategoryData(categoryDataJSON);
      console.log("Saved category data to localStorage");
    } else {
      setcategoryData(JSON.parse(stored));
    }

    if (!spendingStored) {
      localStorage.setItem('spendingData', JSON.stringify(spendingDataJSON));
      setSpendingData(spendingDataJSON);
      console.log('Saved spending data to localStorage');
    } else {
      setSpendingData(JSON.parse(spendingStored))
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('period', selectedPeriod)
  }, [selectedPeriod])

  useEffect(() => {
    if (categoryData.length > 0) {
      localStorage.setItem('categoryData', JSON.stringify(categoryData));
    }
  }, [categoryData]);

  useEffect(() => {
    setTotalAmount(
      spendingData.reduce((sum, item) => { return sum + parseInt(item.amount); }, 0))
  }, [spendingData])

  useEffect(() => {
    // Only allow months in the dropdown
    const monthsSet = new Set();
    spendingData.forEach(item => {
      const date = new Date(item.date);
      const monthStr = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      monthsSet.add(monthStr);
    });
    // Always include current month
    const today = new Date();
    const currentMonth = `${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
    monthsSet.add(currentMonth);
    const sortedMonths = Array.from(monthsSet).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });
    setAvailablePeriods(sortedMonths);

    // Calculate selected total for selected month
    let monthToUse = selectedPeriodValue;
    if (!monthToUse && sortedMonths.length > 0) {
      monthToUse = sortedMonths[0];
    }
    let total = 0;
    spendingData.forEach(item => {
      const date = new Date(item.date);
      const monthStr = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (monthStr === monthToUse) {
        total += parseFloat(item.amount);
      }
    });
    setSelectedTotal(total);
  }, [spendingData, selectedPeriodValue]);


  const groupByCategory = (spendingData) => {
    const grouped = {};
    spendingData.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }

  const getGroupedSpending = () => {
    // No date range filter, just group all spendingData
    const grouped = {};
    spendingData.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    Object.keys(grouped).forEach(category => {
      grouped[category] = groupByPeriod(grouped[category], selectedPeriod);
    });
    return grouped;
  }

  function groupByPeriod(item, period) {
    const groups = {};
    item.forEach(item => {
      const date = new Date(item.date);
      let key;
      if (period === 'Daily') {
        key = date.toISOString().slice(0, 10);
      } else if (period === 'Weekly') {
        // ISO week number
        const year = date.getFullYear();
        const week = Math.ceil(((date - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
        key = `Week ${week} ${year}`;
      } else if (period === 'Monthly') {
        key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }

  const groupedSpending = getGroupedSpending();
  const groupedCategory = groupByCategory(spendingData);

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Dashboard 💸</h1>
        <NavLink to="/Project-01-Spending-Tracker/journal">
          <button className="submit-button">Go to Journal</button>
        </NavLink>
      </div>
      <form className="spending-form spending-form-stack" onSubmit={e => e.preventDefault()}>
        <div className="category-row">
          <label htmlFor="category-select" className="filter-label">Current Categories:</label>
          <select id="category-select" className="input category-select">
            {categoryData.map((cat, idx) => (
              <option key={idx} value={cat.category}>{cat.category}</option>
            ))}
          </select>
          <button type="button" className="submit-button clear" onClick={() => { localStorage.clear(); window.location.reload(); }}>Clear Local Storage</button>
        </div>
        <div className="category-row">
          <label htmlFor="new-category" className="filter-label">Add New Category:</label>
          <input id="new-category" type="text" ref={inputRef} className="input" placeholder="New Category" />
          <button type="button" className="submit-button" onClick={() => {
            const val = inputRef.current.value.trim();
            if (val && !categoryData.some(cat => cat.category === val)) {
              setcategoryData((prev) => [...prev, { category: val }]);
              inputRef.current.value = '';
            }
          }}>Add Category</button>
        </div>
      </form>
      {/* <div className="category-list">
        <h3>Spending Category</h3>
        <ul>
          {categoryData.map((cat, idx) => (
            <li key={idx}>{cat.category}</li>
          ))}
        </ul>
      </div> */}
      <div className="totals-grid">
        <div className="total-card">
          <h2>Total Spending (All Time)</h2>
          <p className="total-value">{totalAmount} Bahts</p>
        </div>
        <div className="total-card">
          <h2>Total ({selectedPeriodValue || availablePeriods[0]})</h2>
          <p className="total-value">{selectedTotal} Bahts</p>
        </div>
      </div>
      <div className="filter-section">
        <div>
          <label className="filter-label">Show by:</label>
          <select
            id="period-select"
            ref={selectRef}
            value={selectedPeriod}
            onChange={e => {
              setSelectedPeriod(e.target.value);
              // Do NOT reset selectedPeriodValue (selected month)
            }}
            className="dropdown"
          >
            <option value='Daily'>Daily</option>
            <option value='Weekly'>Weekly</option>
            <option value='Monthly'>Monthly</option>
          </select>
        </div>
        <div>
          <label className="filter-label">Select Month:</label>
          <select
            id="timeframe-select"
            value={selectedPeriodValue}
            onChange={e => setSelectedPeriodValue(e.target.value)}
            className="dropdown"
          >
            {availablePeriods.map((period, idx) => (
              <option key={idx} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Spending Over Time</h3>
          <TotalChart groupByCategory={groupedCategory} />
        </div>
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <SelectedPeriodChart
            spendingData={spendingData}
            selectedPeriod={selectedPeriod}
            selectedMonth={selectedPeriodValue || (availablePeriods.length > 0 ? availablePeriods[0] : "")}
            availableMonths={availablePeriods}
          />
        </div>
      </div>
    </div>
  );
};