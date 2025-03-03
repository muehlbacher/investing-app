import React from "react";
import { Container, Row, Col, Nav, NavItem, NavLink, Input, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav as BsNav } from "reactstrap";
import FinancialsTable from "./FinancialsTable";
import FinancialDataTable from "./FinancialDataTable"

const Dashboard = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4>Investment App</h4>
        <Nav vertical>
          <NavItem>
            <NavLink href="#" className="text-white">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="text-white">Investments</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="text-white">Portfolio</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="text-white">Settings</NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <Navbar color="light" light expand="md" className="border-bottom px-3">
          <NavbarBrand href="#">Dashboard</NavbarBrand>
          <NavbarToggler />
          <Collapse navbar>
            <BsNav className="ms-auto" navbar>
              <Input type="search" placeholder="Search..." className="me-2" />
            </BsNav>
          </Collapse>
        </Navbar>

        {/* Content Section */}
        <Container className="mt-3">
          <Row>
            <Col md={8}>
            <FinancialsTable />
            </Col>
            <Col md={4}>
              <div className="p-3 border bg-light">Chart Placeholder</div>
            </Col>
          </Row>
          <Col md={8}>
          <FinancialDataTable ticker="AAPL" uniqueYears={[2023, 2022, 2021]} />
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
