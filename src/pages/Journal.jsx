
import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom'
import DataTable from '../components/DataTable';

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
        <>
        <h1>Journal</h1>
            <NavLink to='/'>
                <button>Go to Dashboard</button>
            </NavLink>
            <div>
                <input type="date" ref={dateRef} />

                <select ref={categoryRef}>
                    <option value={""}>Select a category</option>
                    {categoryData.map((cat, idx) => (
                        <option key={idx} value={cat.category} >{cat.category}</option>
                    ))}
                </select>

                <input type="number" ref={amountRef} />
                
                <input type="text" ref={desRef} />

                <button onClick={() => addRecord(dateRef, categoryRef, amountRef, desRef)} >Add Record</button>
            </div>
            <DataTable table={spendingData} />
        </>
    )
}

export default Journal;