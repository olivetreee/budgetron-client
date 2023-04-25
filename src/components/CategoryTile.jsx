// import { CATEGORY_ICON } from "../constants";
import './CategoryTile.scss';
import 'react-circular-progressbar/dist/styles.css';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Link } from "react-router-dom";

export const CategoryTile = ({
  category,
  limit,
  amountSpent,
  invertScale = false
}) => {
  const percentageConsumed = Math.ceil((amountSpent/limit) * 100);
  let status = "good";
  if (invertScale) {
    if (percentageConsumed > 100) status = "achieved";
    if (percentageConsumed < 75) status = "warning";
    if (percentageConsumed < 50) status = "danger";
  } else {
    if (percentageConsumed > 50) status = "warning";
    if (percentageConsumed > 75) status = "danger";
    if (percentageConsumed > 100) status = "surpassed";
  }

  const categoryCode = category.replace(" ", "_");
  return (
    <div className={`category-tile ${categoryCode} ${status}`}>
      <Link className="transactions-link" to={`/transactions?category=${categoryCode}`}>
        <i className="fa-solid fa-circle-info" />
      </Link>
      <CircularProgressbarWithChildren value={percentageConsumed}>
        <div className="circular-progress-bar-content">
          <p className="amount-spent">${Math.ceil(amountSpent)}</p>
          <p className="limit">${limit}</p>
        </div>
      </CircularProgressbarWithChildren>
      <p className="category">
        {/* <i className={`fa fa-light ${CATEGORY_ICON[category]}`} /> */}
        {category}
      </p>
    </div>
  )
};
