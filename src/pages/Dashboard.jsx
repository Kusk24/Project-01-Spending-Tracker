import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import categoryDataJSON from '../assets/category_data.json';
import spendingDataJSON from '../assets/spending_data.json'


export const Dashboard = () => {
  const [categoryData, setcategoryData] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const inputRef = useRef("");
  const selectRef = useRef("Daily");
  const [selectPeriod, setSelectedPeriod] = useState('Daily');

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
    const today = new Date();

    const filtered = spendingData.filter((item) => {
      const itemDate = new Date(item.date);

      switch (selectRef.current.value) {
        case 'Daily':
          return (
            itemDate.getDate() === today.getDate() &&
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getFullYear() === today.getFullYear()
          );
        case 'Weekly': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(today.getDate() - 7);
          return itemDate >= oneWeekAgo && itemDate <= today;
        }
        case 'Monthly':
          return (
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getFullYear() === today.getFullYear()
          );
        default:
          return true;
      }
    });

    const total = filtered.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    setSelectedTotal(total);
  }, [selectRef, spendingData]);


  return (
    <>

      <div>
        <span>
          <h1>Dashboard</h1>
          <Link to={"/journal"}>
            <button>Journal</button>
          </Link>
          <select ref={selectRef} value = {selectPeriod} onChange= {handlePeriodChange}>
            <option value='Daily'>Daily</option>
            <option value='Weekly'>Weekly</option>
            <option value='Monthly'>Monthly</option>
          </select>
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

      <p>Total Spending All Time = {totalAmount}</p>
      <p>Total Spending {selectRef.current.value} = {selectedTotal}</p>

    </>
  );
};


