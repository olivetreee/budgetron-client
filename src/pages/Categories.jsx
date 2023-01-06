import { Button } from "react-bootstrap";
import { useCategories } from "../components/CategoriesProvider";

import "./Categories.scss";

export const Categories = () => {
  const [
    categoryLimits,
    { expense: expenseCategories, intake: intakeCategories }
  ] = useCategories();

  return (
    <div className="categories">
      <section className="balance tile no-title">
        <h2>Balance: <span className="negative">$1234</span></h2>
      </section>
      <section className="intake tile">
        <h2>Intake</h2>
        {
          intakeCategories.map(category => (
            <p>{category}</p>
          ))
        }
      </section>
      <section className="expense tile">
      <h2>Expense</h2>
        {
          expenseCategories.map(category => (
            <p>{category}</p>
          ))
        }
      </section>
      <Button>Save</Button>
    </div>
  )
}