
import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import DataTable from '../components/DataTable';
import '../App.css';

function Journal() {
    const [spendingData, setSpendingData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const categoryStored = localStorage.getItem('categoryData');
        if (categoryStored) {
            setCategoryData(JSON.parse(categoryStored));
        }

        const spendingStored = localStorage.getItem('spendingData');
        if (spendingStored) {
            setSpendingData(JSON.parse(spendingStored));
        }
    }, [])

    useEffect(() => {
        if (spendingData.length > 0) {
        localStorage.setItem('spendingData', JSON.stringify(spendingData))
        }
    }, [spendingData])

    const dateRef = useRef();
    const categoryRef = useRef();
    const amountRef = useRef();
    const desRef = useRef();

    const addRecord = (date, category, amount, description) => {
        setSpendingData((prev) =>
            [...prev,
            {
                spending_id: spendingData.length,
                category: category.current.value,
                description: description.current.value,
                amount: amount.current.value,
                date: date.current.value,
            }])
    }

    return (
        <div className="dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
                <h1 className="dashboard-title" style={{ margin: 0 }}>Journal 📒</h1>
                <NavLink to='/'>
                    <button className="submit-button">Go to Dashboard</button>
                </NavLink>
            </div>
            <form className="spending-form-stack" onSubmit={e => e.preventDefault()}>
                <h3 className="form-title">Add New Expense</h3>

                <div className="form-row">
                    <label htmlFor="category-select" className="form-label">Category:</label>
                    <select id="category-select" ref={categoryRef} className="input form-input">
                        <option value={""}>Select a category</option>
                        {categoryData.map((cat, idx) => (
                            <option key={idx} value={cat.category}>{cat.category}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="description-input" className="form-label">Description:</label>
                    <input id="description-input" type="text" ref={desRef} className="input form-input" placeholder="What did you spend on?" />
                </div>

                <div className="form-row">
                    <label htmlFor="amount-input" className="form-label">Amount:</label>
                    <input id="amount-input" type="number" ref={amountRef} className="input form-input" placeholder="0.00" />
                </div>

                <div className="form-row">
                    <label htmlFor="date-input" className="form-label">Date:</label>
                    <input id="date-input" type="date" ref={dateRef} className="input form-input" />
                </div>

                <div className="form-row form-actions">
                    <button type="button" className="submit-button" onClick={() => addRecord(dateRef, categoryRef, amountRef, desRef)}>Add Record</button>
                </div>
            </form>
            <div className="journal-table-card">
                <DataTable table={spendingData} />
            </div>
        </div>
    )
}

export default Journal;