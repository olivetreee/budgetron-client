import { useState } from "react";
import Badge from 'react-bootstrap/Badge';
import { Link, useLocation } from "react-router-dom";
import { PAGE_DATA } from "../constants";
import { useTransactions } from "./TransactionsProvider";

import "./Hamburger.scss";

export const Hamburger = () => {
  const location = useLocation();
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const [{ grouping }] = useTransactions();
  const numberOfMissingCategories = grouping?.category?.["MISSING CATEGORY"]?.length;

  return (
    <nav className={`hamburger-menu ${shouldCollapse ? "collapse-menu" : ""}`}>
      <button
        className="hamburger"
        onClick={ () => setShouldCollapse(false) }
        onBlur={ () => setShouldCollapse(true) }
      >
        &#9776;
      </button>
      <aside>
          <ul>
            {
              Object.values(PAGE_DATA).map(({ path, name, icon }) => (
                <li key={name} className={location.pathname === path && "current" } onClick={() => setShouldCollapse(true)}>
                  <Link to={path}>
                    {
                      path === "/fix-vendors" && numberOfMissingCategories
                      ? <Badge bg="warning" pill>{numberOfMissingCategories}</Badge>
                      : <i className={`fa-solid ${icon}`}/>
                    }
                    {name}
                  </Link>
                </li>
              ))
            }
          </ul>
      </aside>
    </nav>
  )
}
