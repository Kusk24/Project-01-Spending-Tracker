
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'

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

    const addRecord = (date, category, amount) => {
        setSpendingData((prev) =>
            [...prev,
            {
                date: date.current.value,
                category: category.current.value,
                amount: amount.current.value
            }])
    }

    return (
        <>
        <h1>Journal</h1>
            <Link to='/'>
                <button>Go to Dashboard</button>
            </Link>
            <div>
                <input type="date" ref={dateRef} />

                <select ref={categoryRef}>
                    <option value={""}>Select a category</option>
                    {categoryData.map((cat, idx) => (
                        <option key={idx} value={cat.category} >{cat.category}</option>
                    ))}
                </select>

                <input type="number" ref={amountRef} />

                <button onClick={() => addRecord(dateRef, categoryRef, amountRef)} >Add Record</button>
            </div>
            <DataTable table={spendingData} />
        </>
    )
}

function DataTable(props) {
    return (
        <div>
            <ol>
                {props.table.map((data, idx) => (
                    <li key={idx}>{data.category}, {data.amount}, {data.date}</li>
                ))}
            </ol>
        </div>
    );
}

export default Journal;