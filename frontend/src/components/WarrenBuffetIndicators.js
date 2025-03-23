import React, { useState, useEffect } from "react";
import { Table, Card, CardBody, Row, Col } from "reactstrap";
import axios from "axios";
import FinancialChart from "./FinancialChart";

const WarrenBuffetIndicators = ({ticker}) => {
    const [wbTableData, setWbTableData] = useState({});
    const [uniqueYears, setUniqueYears] = useState([]);
    const [activeMetric, setActiveMetric] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch the financial data from the backend
          const response = await axios.get(`http://localhost:8000/wb-data/${ticker}/`);
          const wbTableData = response.data['wb_data'];
          const uniqueYears = response.data['uniqueYears'];
          setWbTableData(wbTableData);
          setUniqueYears(uniqueYears);
          
          // Set first metric as default when data loads
          if (wbTableData && Object.keys(wbTableData).length > 0) {
            setActiveMetric(Object.keys(wbTableData)[0]);
          }
        } catch (error) {
          console.error("Error fetching financial data:", error);
        }
      };
  
      fetchData();
    }, [ticker]);
    
    // Handle metric hover
    const handleMetricHover = (metric) => {
      setActiveMetric(metric);
    };

    if (!uniqueYears || uniqueYears.length === 0 || !wbTableData) {
      return <p className="text-center">No financial data available</p>;
    }

    // Format data for chart display
    const getChartData = () => {
      if (!activeMetric || !wbTableData[activeMetric]) return {};
      
      const chartData = {};
      uniqueYears.forEach(year => {
        chartData[year] = {
          value: parseFloat(wbTableData[activeMetric][year]?.value) || 0
        };
      });
      
      return chartData;
    };

    return (
      <><Row>
        <Col md={8}>
          <Card className="mb-4">
            <CardBody>
              <h5 className="card-title">Warren Buffett's Indicators</h5>
              <p className="card-text text-muted mb-3">Part of Warren Buffets insight was to divide the world of business 
                into two different groups: <br></br>
                  - business with long-term competivive adavantage over there competitors. You want to buy them at a fair price. <br></br>
                  - mediocre businesses that struggle year after year in a competitive market, which makes them poor long term investments. 
              </p>
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
                    {Object.entries(wbTableData).map(([metric, data]) => (
                      <tr key={metric}>
                        <td
                          className="table-metric"
                          onMouseEnter={() => handleMetricHover(metric)}
                          style={{ cursor: 'pointer' }}
                        >
                          {metric}
                          <span
                            data-bs-toggle="tooltip"
                            data-metric-key={metric}
                            className="badge rounded-circle bg-light text-dark ms-2"
                          >
                            i
                          </span>
                        </td>
                        {uniqueYears.map((year) => (
                          <td key={year} className={data[year]?.class || ""}>
                            {data[year]?.value || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <FinancialChart
            data={getChartData()}
            years={uniqueYears}
            metricName={activeMetric} />
        </Col>
      </Row><Row>
          <Col md={8}>
            <Card className="mb-4">
              <CardBody>
                <div>
                  <p> Net Earnings Ratio: A net Earnings Ratio over 20% is a strong indicator, 
                    that theres is some kind of competivive advantage </p>
                  <p>

                    </p> 
                </div> 
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
          </Col>
        </Row></>
    );
};

export default WarrenBuffetIndicators;