import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Nav, NavItem, NavLink, Input, 
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav as BsNav, ListGroup, ListGroupItem 
} from "reactstrap";
import axios from "axios";
import FinancialDataTable from "./FinancialDataTable";
import WarrenBuffetIndicators from "./WarrenBuffetIndicators";

const Dashboard = () => {
  const [searchTicker, setSearchTicker] = useState("AAPL");   // Default ticker
  const [query, setQuery] = useState("");                     // Input field query
  const [suggestions, setSuggestions] = useState([]);         // Search results
  //const [financialData, setFinancialData]

  // Fetch ticker suggestions from Django backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/search-ticker/?q=${query}`);
        setSuggestions(response.data.results || []);
      } catch (error) {
        console.error("Error fetching ticker suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // Debounce API calls

    return () => clearTimeout(delayDebounce);
  }, [query]);  // Runs whenever `query` changes

  // Handle ticker selection
  const handleSelectTicker = (ticker) => {
    setSearchTicker(ticker);
    setQuery("");   // Clear input after selection
    setSuggestions([]);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4>Investment App</h4>
        <Nav vertical>
          <NavItem><NavLink href="#" className="text-white">Dashboard</NavLink></NavItem>
          <NavItem><NavLink href="#" className="text-white">Investments</NavLink></NavItem>
          <NavItem><NavLink href="#" className="text-white">Portfolio</NavLink></NavItem>
          <NavItem><NavLink href="#" className="text-white">Settings</NavLink></NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <Navbar color="light" light expand="md" className="border-bottom px-3">
          <NavbarBrand href="#">Dashboard</NavbarBrand>
          <NavbarToggler />
          <Collapse navbar>
            <BsNav className="ms-auto position-relative" navbar>
              <Input 
                type="search" 
                placeholder="Search ticker..." 
                className="me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())} 
              />
              {/* Dropdown for Search Suggestions */}
              {suggestions.length > 0 && (
                <ListGroup className="position-absolute bg-white w-100 shadow mt-2">
                  {suggestions.map((company) => (
                    <ListGroupItem 
                      key={company.id} 
                      onClick={() => handleSelectTicker(company.ticker)}
                      className="cursor-pointer"
                      style={{ cursor: "pointer" }}
                    >
                      {company.name} ({company.ticker})
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </BsNav>
          </Collapse>
        </Navbar>

        {/* Content Section */}
        <Container className="mt-3">
          <div>{searchTicker}</div>
          <Row>
            <Col md={8}>
              <FinancialDataTable ticker={searchTicker} />
            </Col>
            <Col md={4}>
              <div className="p-3 border bg-light">Chart Placeholder</div>
            </Col>
          </Row>
          <Col md={8}>
              <WarrenBuffetIndicators ticker={searchTicker} />
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;