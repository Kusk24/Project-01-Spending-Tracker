import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './App.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

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
  const [form, setForm] = useState({ category: '', amount: '', date: '' });

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Spending
        </button>
      </form>

      <div className="mb-6">
        <label className="font-semibold mr-4">View by:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold">Total Spending (All Time)</h2>
          <p className="text-2xl text-blue-600 font-bold">${totalSpendingAllTime.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold">Total ({selectedTime})</h2>
          <p className="text-2xl text-green-600 font-bold">${totalSpendingSelected.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Spending Over Time</h3>
          <LineChart width={400} height={250} data={lineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
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
