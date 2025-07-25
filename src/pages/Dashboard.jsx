import React, { useState } from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend} from 'recharts';
import '../App.css';

const COLORS = ['#26668B', '#478CC9', '#63C7C5', '#FFE6A7','#F9844A','#F7F7F7'];

function filterSpendings(spendings, timeFilter) {
    const now = new Date();
    return spendings.filter((s) => {
        const date = new Date(s.date);
        if (timeFilter === 'Daily') {
        return date.toDateString() === now.toDateString();
        } else if (timeFilter === 'Weekly') {
        const diff = now - date;
        return diff < 7 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'Monthly') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        return true;
    });
    }

export default function AnalyticsDashboard() {
    const [selectedTime, setSelectedTime] = useState('Monthly');
    const [spendings, setSpendings] = useState([]);
    const [form, setForm] = useState({ category: '', amount: '', date: '' }); //idk what to add more plz add it naa

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.category || !form.amount || !form.date) return;
        setSpendings([...spendings, { ...form, amount: parseFloat(form.amount) }]);
        setForm({ category: '', amount: '', date: '' });
    };

    const filteredSpendings = filterSpendings(spendings, selectedTime);
    const totalSpendingAllTime = spendings.reduce((acc, s) => acc + s.amount, 0);
    const totalSpendingSelected = filteredSpendings.reduce((acc, s) => acc + s.amount, 0);

    const pieData = Object.values(
        filteredSpendings.reduce((acc, s) => {
        acc[s.category] = acc[s.category] || { name: s.category, value: 0 };
        acc[s.category].value += s.amount;
        return acc;
        }, {})
    );

    const lineData = filteredSpendings.map(s => ({
        date: s.date,
        amount: s.amount
    }));

    const [categories, setCategories] = useState(['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Other']);



return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Analytics Dashboard💸</h1>

    <form onSubmit={handleSubmit} className="spending-form">
    <select
        name="category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="input"
    >
    <option value="">-- Select Category --</option>
        {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
            {cat}
            </option>
        ))}
    </select>

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="input"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="submit-button">
        Add Spending
      </button>
    </form>

    <div className="filter-section">
      <label className="filter-label">View by:</label>
      <select
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="dropdown"
      >
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
    </div>

    <div className="totals-grid">
      <div className="total-card">
        <h2>Total Spending (All Time)</h2>
        <p className="total-value">${totalSpendingAllTime.toFixed(2)}</p>
      </div>
      <div className="total-card">
        <h2>Total ({selectedTime})</h2>
        <p className="total-value">${totalSpendingSelected.toFixed(2)}</p>
      </div>
    </div>

    <div className="charts-grid">
      <div className="chart-card">
        <h3>Spending Over Time</h3>
        <LineChart width={400} height={250} data={lineData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="chart-card">
        <h3>Spending by Category</h3>
        <PieChart width={400} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  </div>
);
}
