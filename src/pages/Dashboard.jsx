import React, { useEffect, useRef, useState } from 'react';
import { 
  NavLink } from 'react-router-dom';
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
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  // Removed showPeriodStart and showPeriodEnd

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  useEffect(() => {
    const stored = localStorage.getItem('categoryData');
    const spendingStored = localStorage.getItem('spendingData');

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
    if (categoryData.length > 0) {
      localStorage.setItem('categoryData', JSON.stringify(categoryData));
    }
  }, [categoryData]);

  useEffect(() => {
    setTotalAmount(
      spendingData.reduce((sum, item) => { return sum + parseInt(item.amount); }, 0))
  }, [spendingData])

  useEffect(() => {
    // Get grouped spending for the selected period type
    const groupedSpending = getGroupedSpending();
    let periods = [];
    // Add current period options
    const today = new Date();
    if (selectedPeriod === 'Daily') {
      periods.push(today.toISOString().slice(0, 10));
    } else if (selectedPeriod === 'Weekly') {
      const year = today.getFullYear();
      const week = Math.ceil(((today - new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
      periods.push(`Week ${week} ${year}`);
    } else if (selectedPeriod === 'Monthly') {
      periods.push(`${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`);
    }
    // Add all available periods from data
    Object.keys(groupedSpending).forEach(category => {
      Object.keys(groupedSpending[category]).forEach(periodKey => {
        if (!periods.includes(periodKey)) periods.push(periodKey);
      });
    });
    // Sort periods from latest to oldest
    const sortedPeriods = periods.slice().sort((a, b) => {
      // Daily: YYYY-MM-DD
      if (selectedPeriod === 'Daily') {
        return new Date(b) - new Date(a);
      }
      // Weekly: 'Week N YYYY'
      if (selectedPeriod === 'Weekly') {
        const [_, weekA, yearA] = a.match(/Week (\d+) (\d{4})/) || [];
        const [__, weekB, yearB] = b.match(/Week (\d+) (\d{4})/) || [];
        if (yearA !== yearB) return yearB - yearA;
        return weekB - weekA;
      }
      // Monthly: 'Month YYYY'
      if (selectedPeriod === 'Monthly') {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateB - dateA;
      }
      return 0;
    });
    setAvailablePeriods(sortedPeriods);

    // Calculate selected total for selected period value
    let periodToUse = selectedPeriodValue;
    if (!periodToUse && periods.length > 0) {
      periodToUse = periods[0];
    }
    let total = 0;
    Object.keys(groupedSpending).forEach(category => {
      if (groupedSpending[category][periodToUse]) {
        total += groupedSpending[category][periodToUse].reduce((sum, item) => sum + parseFloat(item.amount), 0);
      }
    });
    setSelectedTotal(total);
  }, [selectedPeriod, spendingData, selectedPeriodValue]);


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
    <>

      <div>
        <span>
          <h1>Dashboard</h1>
          <NavLink to={"/journal"}>
            <button>Journal</button>
          </NavLink>
        </span>
        <h3>Spending Category</h3>
        <ul>
          {categoryData.map((cat, idx) => (
            <li key={idx}> {cat.category} </li>
          ))}
        </ul>
        <input type="text" ref={inputRef} />
        <button onClick={() => {
          setcategoryData((prev) => [...prev, { category: inputRef.current.value }])
        }}>
          Save
        </button>
      </div>

      <span>
        <button onClick={() => { localStorage.clear() }}>
          Clear Local Storage
        </button>
      </span>

      <p><strong>Total Spending (All Time):</strong> {totalAmount}</p>

      <div style={{ display: 'flex', gap: '2em', flexWrap: 'wrap' }}>
        <TotalChart groupByCategory={groupedCategory} />


        <div style={{ margin: '1em 0' }}>
        <label htmlFor="period-select"><strong>Show by:</strong></label>
        <select
          id="period-select"
          ref={selectRef}
          value={selectedPeriod}
          onChange={e => {
            setSelectedPeriod(e.target.value);
            setSelectedPeriodValue('');
          }}
        >
          <option value='Daily'>Daily</option>
          <option value='Weekly'>Weekly</option>
          <option value='Monthly'>Monthly</option>
        </select>
      </div>

      <div style={{ margin: '1em 0' }}>
        <label htmlFor="timeframe-select"><strong>Select {selectedPeriod} period:</strong></label>
        <select
          id="timeframe-select"
          value={selectedPeriodValue}
          onChange={e => setSelectedPeriodValue(e.target.value)}
        >
          {availablePeriods.map((period, idx) => (
            <option key={idx} value={period}>{period}</option>
          ))}
        </select>
      </div>

      <p><strong>Total Spending ({selectedPeriodValue || availablePeriods[0]}):</strong> {selectedTotal}</p>
        <SelectedPeriodChart
          groupedSpending={groupedSpending}
          selectedPeriodValue={selectedPeriodValue}
          availablePeriods={availablePeriods}
        />
      </div>

    </>
  );
};