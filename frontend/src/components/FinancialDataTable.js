import React, { useState, useEffect } from "react";
import { Table, Card, CardBody } from "reactstrap";
import axios from "axios";

const formatNumber = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';  // Billions
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';  // Millions
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';  // Thousands
  } else {
    return number;  // Less than thousand, no change
  }
};

const FinancialDataTable = ({ ticker = [] }) => {
  const [financialTableData, setFinancialTableData] = useState({});
  const [uniqueYears, setUniqueYears] = useState([])
  const [showOperatingExpenses, setShowOperatingExpenses] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the financial data from the backend
        const response = await axios.get(`http://localhost:8000/financial-data/${ticker}/`);
        const financialTableData = response.data['metricData'];
        const uniqueYears = response.data['uniqueYears'];
        setFinancialTableData(financialTableData);
        setUniqueYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, [ticker]);

  if (!uniqueYears || uniqueYears.length === 0) {
    return <p className="text-center">No financial data available</p>;
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <h5 className="card-title">Income Statement</h5>
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead className="thead-dark">
              <tr>
                <th></th>
                {uniqueYears.map((year, index) => (
                  <th key={index} scope="col">{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Revenue", key: "revenue" },
                { label: "Cost of Revenue", key: "costOfRevenue" },
                { label: "Gross Profit", key: "grossProfit", bold: true },
              ].map(({ label, key, bold }) => (
                <tr key={key} className={bold ? "fw-bold" : ""}>
                  <td>
                    {label}
                    <span className="badge rounded-circle bg-light text-dark ms-2" style={{ cursor: "pointer" }}>i</span>
                  </td>
                  {uniqueYears.map((year) => (
                    <td key={year} className="text-end">
                      {formatNumber(financialTableData[key]?.[year]?.value || "-")}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Operating Expenses Dropdown */}
              <tr>
                <td>
                  <button className="no-underline-btn d-flex align-items-center" onClick={() => setShowOperatingExpenses(!showOperatingExpenses)}>
                    <span className={`me-2 ${showOperatingExpenses ? "rotate" : ""}`}>&#9654;</span>
                    Operating Expenses
                    <span className="badge rounded-circle bg-light text-dark ms-2" style={{ cursor: "pointer" }}>i</span>
                  </button>
                </td>
                {uniqueYears.map((year) => (
                  <td key={year} className="text-end">
                    {formatNumber(financialTableData.operatingExpenses?.[year]?.value || "-")}
                  </td>
                ))}
              </tr>
              
              {showOperatingExpenses &&
                [
                  { label: "Selling, General and Administration", key: "sellingGeneralAndAdministrativeExpenses" },
                  { label: "Research and Development", key: "researchAndDevelopmentExpenses" },
                  { label: "Other Expenses", key: "otherExpenses" },
                ].map(({ label, key }) => (
                  <tr key={key}>
                    <td className="ps-5">{label}</td>
                    {uniqueYears.map((year) => (
                      <td key={year} className="text-end">
                      {formatNumber(financialTableData[key]?.[year]?.value || "-")}
                      </td>
                    ))}
                  </tr>
                ))}

              {[
                { label: "Operating Income", key: "operatingIncome", bold: true },
                { label: "Interest Expense", key: "interestExpense", bold: true },
                { label: "Depreciation", key: "depreciationAndAmortization", bold: true },
                { label: "Income Before Tax", key: "incomeBeforeTax", bold: true },
              ].map(({ label, key, bold }) => (
                <tr key={key} className={bold ? "fw-bold" : ""}>
                  <td>
                    {label}
                    <span className="badge rounded-circle bg-light text-dark ms-2" style={{ cursor: "pointer" }}>i</span>
                  </td>
                  {uniqueYears.map((year) => (
                    <td key={year} className="text-end">
                      {formatNumber(financialTableData[key]?.[year]?.value || "-")}
                      </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default FinancialDataTable;
