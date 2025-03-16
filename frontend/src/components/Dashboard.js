import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Nav, NavItem, NavLink, Input, 
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav as BsNav, ListGroup, ListGroupItem,
  TabContent, TabPane
} from "reactstrap";
import axios from "axios";
import FinancialDataTable from "./FinancialDataTable";
import WarrenBuffetIndicators from "./WarrenBuffetIndicators";

const Dashboard = () => {
  const [searchTicker, setSearchTicker] = useState("AAPL");   // Default ticker
  const [query, setQuery] = useState("");                     // Input field query
  const [suggestions, setSuggestions] = useState([]);         // Search results
  const [activeTab, setActiveTab] = useState('1');            // Track active tab

  // Toggle tab function
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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
          <div>
            <h3 className="mb-3">{searchTicker}</h3>
            <Row className="mb-4">
              <Col md={12}>
                {/* Tab Navigation */}
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={activeTab === '1' ? 'active' : ''}
                      onClick={() => toggleTab('1')}
                      style={{ cursor: 'pointer' }}
                    >
                      Income Statement
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '2' ? 'active' : ''}
                      onClick={() => toggleTab('2')}
                      style={{ cursor: 'pointer' }}
                    >
                      Warren Buffett Indicators
                    </NavLink>
                  </NavItem>
                </Nav>
                
                {/* Tab Content */}
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <FinancialDataTable ticker={searchTicker} />
                  </TabPane>
                  <TabPane tabId="2">
                    <WarrenBuffetIndicators ticker={searchTicker} />
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;