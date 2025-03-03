import React from "react";
import { Table } from "reactstrap";

const FinancialsTable = ({ data }) => {
  return (
    <div className="p-3 border bg-light">
      <h5>Investment Portfolio</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Stock</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.stock}</td>
                <td>{item.shares}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.shares * item.price).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// Sample Data
const sampleData = [
  { stock: "AAPL", shares: 10, price: 150 },
  { stock: "GOOGL", shares: 5, price: 2800 },
  { stock: "TSLA", shares: 3, price: 700 },
];

// Default export with sample data
const FinancialsTableWithSample = () => <FinancialsTable data={sampleData} />;
export { FinancialsTable };
export default FinancialsTableWithSample;
