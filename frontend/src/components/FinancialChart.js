import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FinancialChart = ({ data, years, metricName, tooltip }) => {
  // Convert data format for the chart
  const prepareChartData = () => {
    if (!data || !years || years.length === 0) {
      return [];
    }

    return years.map(year => ({
      year,
      value: data[year]?.value || 0
    }));
  };

  const chartData = prepareChartData();

  // Format metric name to be more readable (e.g., "costOfRevenue" -> "Cost of Revenue")
  const formatMetricName = (name) => {
    if (!name) return "";
    return name
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  const formatYAxis = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <Card className="mt-3">
      <CardBody>
        <CardTitle tag="h5">{formatMetricName(metricName)} Trend</CardTitle>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" reversed={true}/>
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip 
                formatter={(value) => [`$${new Intl.NumberFormat().format(value)}`, formatMetricName(metricName)]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={formatMetricName(metricName)} 
                stroke="#0d6efd" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center p-5">No data available for this metric</div>
        )}
        <div>
          <p>{ tooltip }</p>
      </div>
      </CardBody>
    </Card>
  );
};

export default FinancialChart;