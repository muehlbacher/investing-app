import React, { useState, useEffect } from "react";
import { Table, Card, CardBody, Row, Col } from "reactstrap";
import axios from "axios";
import FinancialChart from "./FinancialChart";

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

const FinancialDataTable = ({ ticker, tooltips }) => {
  const [financialTableData, setFinancialTableData] = useState({});
  const [uniqueYears, setUniqueYears] = useState([]);
  const [showOperatingExpenses, setShowOperatingExpenses] = useState(false);
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [activeTooltip, setActiveTooltip] = useState(tooltips['revenue'])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the financial data from the backend
        const response = await axios.get(`http://localhost:8000/financial-data/${ticker}/`);
        const financialTableData = response.data['metricData'];
        const uniqueYears = response.data['uniqueYears'];
        setFinancialTableData(financialTableData);
        setUniqueYears(uniqueYears);
        
        // Set default metric to revenue when data loads
        setActiveMetric("revenue");
        setActiveTooltip(tooltips['revenue'])
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchData();
  }, [ticker]);

  if (!uniqueYears || uniqueYears.length === 0) {
    return <p className="text-center">No financial data available</p>;
  }

  // Handle metric hover
  const handleMetricHover = async (metric) => {
    setActiveMetric(metric);
    setActiveTooltip(tooltips[metric]);
  };

  
  // Financial metrics in order
  const financialMetrics = [
    { label: "Revenue", key: "revenue", bold: true },
    { label: "Cost of Revenue", key: "costOfRevenue" },
    { label: "Gross Profit", key: "grossProfit", bold: true },
    { label: "Operating Income", key: "operatingIncome", bold: true },
    { label: "Interest Expense", key: "interestExpense" },
    { label: "Depreciation", key: "depreciationAndAmortization" },
    { label: "Income Before Tax", key: "incomeBeforeTax", bold: true },
    { label: "Income Taxes Paid", key: "incomeTaxExpense", bold: true},
    { label: "Net Earnings ", key: "netIncome", bold: true },
  ];
  
  // Operating expense items
  const operatingExpenses = [
    { label: "Selling, General and Administration", key: "sellingGeneralAndAdministrativeExpenses" },
    { label: "Research and Development", key: "researchAndDevelopmentExpenses" },
    { label: "Other Expenses", key: "otherExpenses" },
  ];

  return (
    <Row>
      <Col md={8}>
        <Card className="mb-4">
          <CardBody>
            <h5 className="card-title">Income Statement</h5>
            <p className="card-text text-muted mb-3">Hover over any metric to see its trend chart</p>
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
                  {/* Regular metrics */}
                  {financialMetrics.map((metric, index) => (
                    // Insert operating expenses before Operating Income (index 3)
                    index === 3 ? (
                      <React.Fragment key={`fragment-${index}`}>
                        {/* Operating Expenses header row */}
                        <tr key="operatingExpenses">
                          <td>
                            <button 
                              className="no-underline-btn d-flex align-items-center" 
                              onClick={() => {setShowOperatingExpenses(!showOperatingExpenses);
                                handleMetricHover("operatingExpenses");
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className={`me-2 ${showOperatingExpenses ? "rotate" : ""}`}>&#9654;</span>
                              Operating Expenses
                              <span className="badge rounded-circle bg-light text-dark ms-2">i</span>
                            </button>
                          </td>
                          {uniqueYears.map((year) => (
                            <td key={year} className="text-end">
                              {formatNumber(financialTableData["operatingExpenses"]?.[year]?.value || "-")}
                            </td>
                          ))}
                        </tr>
                        
                        {/* Operating expenses detail rows */}
                        {showOperatingExpenses && operatingExpenses.map((expenseItem) => (
                          <tr key={expenseItem.key}>
                            <td 
                              className="ps-5"
                              onClick={() => handleMetricHover(expenseItem.key)}
                              style={{ cursor: 'pointer' }}
                            >
                              {expenseItem.label}
                            </td>
                            {uniqueYears.map((year) => (
                              <td key={year} className="text-end">
                                {formatNumber(financialTableData[expenseItem.key]?.[year]?.value || "-")}
                              </td>
                            ))}
                          </tr>
                        ))}
                        
                        {/* Current regular metric */}
                        <tr key={metric.key} className={metric.bold ? "fw-bold" : ""}>
                          <td 
                            onClick={() => handleMetricHover(metric.key)}
                            style={{ cursor: 'pointer' }}
                          >
                            {metric.label}
                            <span className="badge rounded-circle bg-light text-dark ms-2">i</span>
                          </td>
                          {uniqueYears.map((year) => (
                            <td key={year} className="text-end">
                              {formatNumber(financialTableData[metric.key]?.[year]?.value || "-")}
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    ) : (
                      // Regular metric rows
                      <tr key={metric.key} className={metric.bold ? "fw-bold" : ""}>
                        <td 
                          onClick={() => handleMetricHover(metric.key)}
                          style={{ cursor: 'pointer' }}
                        >
                          {metric.label}
                          <span className="badge rounded-circle bg-light text-dark ms-2">i</span>
                        </td>
                        {uniqueYears.map((year) => (
                          <td key={year} className="text-end">
                            {formatNumber(financialTableData[metric.key]?.[year]?.value || "-")}
                          </td>
                        ))}
                      </tr>
                    )
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <FinancialChart 
          data={financialTableData[activeMetric] || {}} 
          years={uniqueYears}
          metricName={activeMetric}
          tooltip={activeTooltip}
        />
      </Col>
    </Row>
  );
};

export default FinancialDataTable;