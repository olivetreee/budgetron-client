import { useMemo, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from 'react-bootstrap/Badge';
import { Link, useLocation } from "react-router-dom";
import dateUtils from "date-and-time";
import { PAGE_DATA } from "../constants";
import { useTransactions } from "../providers/TransactionsProvider";
import { usePeriod } from "../providers/PeriodProvider";

import "./Hamburger.scss";

const PeriodPicker = () => {
  const [selectedPeriod, setSelectedPeriod] = usePeriod()
  const periods = useMemo(() => {
    const initialMonthDate = new Date("1/1/2022");
    let currentPeriodMonth = new Date();
    const listOfPeriods = [];
    while (currentPeriodMonth >= initialMonthDate) {
      listOfPeriods.push(dateUtils.format(currentPeriodMonth, "M/YYYY"));
      currentPeriodMonth = dateUtils.addMonths(currentPeriodMonth, -1);
    }
    return listOfPeriods;
  }, [])
  return (
    <>
      <h4>Period Picker:</h4>
      <DropdownButton variant="light" onSelect={setSelectedPeriod} title={dateUtils.transform(selectedPeriod, "M/YYYY", "MMM/YYYY")}>
        {periods.map(period => (
          <Dropdown.Item key={period} eventKey={period}>{dateUtils.transform(period, "M/YYYY", "MMM/YYYY")}</Dropdown.Item>
        ))}
      </DropdownButton>
    </>
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
          {/* <section className="close-button">
            <i class="fa-solid fa-xmark"></i>
          </section> */}
          <section className="links">
            <ul>
              {
                Object.values(PAGE_DATA).map(({ path, name, icon, hideFromNav }) => !hideFromNav && (
                  <li key={name} className={location.pathname === path ? "current" : "" } onClick={() => setShouldCollapse(true)}>
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
          </section>
          <section className="period-picker">
            <PeriodPicker />
          </section>
      </aside>
    </nav>
  )
}
