import { useMemo, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from 'react-bootstrap/Badge';
import { Link, useLocation } from "react-router-dom";
import dateUtils from "date-and-time";
import { PAGE_DATA } from "../constants";
import { useTransactions } from "./TransactionsProvider";
import { usePeriod } from "./PeriodProvider";

import "./Hamburger.scss";

const PeriodPicker = () => {
  const [selectedPeriod, setSelectedPeriod] = usePeriod()
  const periods = useMemo(() => {
    const initialMonthDate = new Date("1/1/2022");
    const now = new Date();
    let currentPeriodMonth = initialMonthDate;
    const listOfPeriods = [];
    while (currentPeriodMonth <= now) {
      listOfPeriods.push(dateUtils.format(currentPeriodMonth, "M/YYYY"));
      currentPeriodMonth = dateUtils.addMonths(currentPeriodMonth, 1);
    }
    return listOfPeriods;
  }, [])
  return (
    <DropdownButton variant="light" onSelect={setSelectedPeriod} title={selectedPeriod}>
      {periods.map(period => (
        <Dropdown.Item key={period} eventKey={period}>{period}</Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

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
          <PeriodPicker />
      </aside>
    </nav>
  )
}
