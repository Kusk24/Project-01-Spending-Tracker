import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../App.css';

export default function DataTable(props) {
  // Add delete handler
  const handleDelete = (id) => {
    // Remove from localStorage
    const stored = localStorage.getItem('spendingData');
    let arr = stored ? JSON.parse(stored) : [];
    arr = arr.filter(item => item.spending_id !== id);
    localStorage.setItem('spendingData', JSON.stringify(arr));
    // If parent provided a setter, update parent state
    if (props.setSpendingData) {
      props.setSpendingData(arr);
    }
    // Otherwise, force reload (fallback)
    else {
      window.location.reload();
    }
  };
  return (
    <TableContainer component={Paper} className="data-table-container">
      <Table className="data-table" aria-label="simple table">
        <TableHead>
          <TableRow className="data-table-header-row">
            <TableCell className="data-table-header">Spending ID</TableCell>
            <TableCell align="right" className="data-table-header">Category</TableCell>
            <TableCell align="right" className="data-table-header">Description</TableCell>
            <TableCell align="right" className="data-table-header">Amount</TableCell>
            <TableCell align="right" className="data-table-header">Date</TableCell>
            <TableCell align="right" className="data-table-header">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.table.map((data,idx) => (
            <TableRow
              key={data.spending_id}
              className={idx % 2 === 0 ? 'data-table-row-odd' : 'data-table-row-even'}
            >
              <TableCell component="th" scope="row" className="data-table-id">
                {data.spending_id}
              </TableCell>
              <TableCell align="right" className="data-table-category">{data.category}</TableCell>
              <TableCell align="right" className="data-table-description">{data.description}</TableCell>
              <TableCell align="right" className="data-table-amount">{data.amount} Bahts</TableCell>
              <TableCell align="right" className="data-table-date">{data.date}</TableCell>
              <TableCell align="right">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(data.spending_id)}
                  title="Delete this record"
                  type="button"
                >Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}