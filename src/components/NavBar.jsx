import { Nav } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import { useTransactions } from "./TransactionsProvider";

export const NavBar = () => {
  const [{ grouping }] = useTransactions();
  const numberOfMissingCategories = grouping?.category["MISSING CATEGORY"].length;
  return (
    <Nav className="navbar justify-content-around" variant="pills" defaultActiveKey="/#/dashboard">
      <Nav.Item>
        <Nav.Link href="/#/dashboard">Dashboard</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/#/fix-vendors">
          Fix Vendors
          <Badge style={{ marginLeft: "1rem", color: "#151E29" }} login="ml-1" bg="warning" pill>{numberOfMissingCategories}</Badge>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}