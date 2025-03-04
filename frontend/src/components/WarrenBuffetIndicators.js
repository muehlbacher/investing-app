import React, { useState, useEffect } from "react";
import { Table, Card, CardBody } from "reactstrap";
import axios from "axios";

const WarrenBuffetIndicators = ({ticker}) => {
    const [wbTableData, setwbTableDataData] = useState({});
    const [uniqueYears, setUniqueYears] = useState([])
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch the financial data from the backend
          const response = await axios.get(`http://localhost:8000/wb-data/${ticker}/`);
          const wbTableData = response.data['wb_data'];
          const uniqueYears = response.data['uniqueYears'];
          setwbTableDataData(wbTableData);
          setUniqueYears(uniqueYears);
        } catch (error) {
          console.error("Error fetching financial data:", error);
        }
      };
  
      fetchData();
    }, [ticker]);
  if (!uniqueYears || uniqueYears.length === 0 || !wbTableData) {
    return <p className="text-center">No financial data available</p>;
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <h5 className="card-title">Warren Buffet's Indicators</h5>
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
                  <td className="table-metric">
                    {metric}
                    <span 
                      data-bs-toggle="tooltip" 
                      data-metric-key={metric} 
                      className="badge rounded-circle bg-light text-dark ms-2" 
                      style={{ cursor: "pointer" }}
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
  );
};

export default WarrenBuffetIndicators;
