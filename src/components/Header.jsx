import { Hamburger } from "./Hamburger";
import { useTransactions } from "./TransactionsProvider";

import "./Header.scss";

export const Header = ({ title }) => {
  const [{ grouping }] = useTransactions();
  const numberOfMissingCategories = grouping?.category?.["MISSING CATEGORY"]?.length;
  return (
    <header className="top-header">
      <Hamburger />
      <h1 className="page-title">{title}</h1>
    </header>
  )
  // return (
  //   <Nav className="navbar justify-content-around" variant="pills" defaultActiveKey="/#/dashboard">
  //     <Nav.Item>
  //       <Nav.Link href="/#/dashboard">Dashboard</Nav.Link>
  //     </Nav.Item>
  //     <Nav.Item>
  //       <Nav.Link href="/#/fix-vendors">
  //         Fix Vendors
  //         <Badge style={{ marginLeft: "1rem", color: "#151E29" }} login="ml-1" bg="warning" pill>{numberOfMissingCategories}</Badge>
  //       </Nav.Link>
  //     </Nav.Item>
  //   </Nav>
  // )
}