import { CATEGORY_ICON } from "../constants";
import './CategoryTile.css';

export const CategoryTile = ({
  category,
  limit,
  amountSpent
}) => {
  return (
    <>
      <div className={`CategoryTile ${category.split(" ").join("")}`}>
        <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
        <div className="right-column">
          <div className="text">
            <h2>{category}</h2>
            <div>
              <p className="amount">
                {`$${amountSpent}`}
                <br/>
                <span>{`out of $${limit}`}</span>
              </p>
            </div>
          </div>
          <div className="progress-bar" />
        </div>
      </div>
    </>
  )
};