import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PAGE_DATA } from "../constants";

import "./Hamburger.scss";

export const Hamburger = () => {
  const location = useLocation();
  const [shouldCollapse, setShouldCollapse] = useState(false);

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
              Object.values(PAGE_DATA).map(({ path, name }) => (
                <li key={name} className={location.pathname === path && "current" } onClick={() => setShouldCollapse(true)}>
                  <Link to={path}>{name}</Link>
                </li>
              ))
            }
          </ul>
      </aside>
    </nav>
  )
}
