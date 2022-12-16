import { CATEGORY_ICON } from "../constants";
import './CategoryTile.css';
import 'react-circular-progressbar/dist/styles.css';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

export const CategoryTile = ({
  category,
  limit,
  amountSpent
}) => {
  const percentageConsumed = Math.ceil((amountSpent/limit) * 100);
  let status = "good";
  if (percentageConsumed > 50) status = "warning";
  if (percentageConsumed > 75) status = "danger";

  return (
    <div className={`category-tile ${category.split(" ").join("")} ${status}`}>
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
