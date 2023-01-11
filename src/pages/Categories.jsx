import { useEffect } from "react";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useCategories } from "../components/CategoriesProvider";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { printMoney } from "../utils";

import "./Categories.scss";

const printDifference = (oldValue, newValue) => {
  const diff = oldValue - newValue;
  let iconClass = '';
  if (diff > 0) iconClass = "fa-arrow-up";
  if (diff < 0) iconClass = "fa-arrow-down";

  return (
    <>
      {
        iconClass && (
          <>
            <i className={`fa-solid ${iconClass}`} />
            <br />
          </>
        )
      }
      {printMoney(Math.abs(diff), false)}
    </>
  )
}

export const Categories = () => {
  const [
    categoryItems,
    { expense: expenseCategories, intake: intakeCategories },
    isLoading
  ] = useCategories();
  const [newLimits, setNewLimits] = useState(categoryItems?.items);

  useEffect(() => {
    setNewLimits(categoryItems?.items);
  }, [categoryItems?.items]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const intakeBalance = intakeCategories.reduce((acc, category) => acc + newLimits?.[category]?.limit, 0);
  const expenseBalance = expenseCategories.reduce((acc, category) => acc + newLimits?.[category]?.limit, 0);
  const totalBalance = intakeBalance - expenseBalance;

  // TODO: WTF is going on w/ those undefined objects?!?!
  return (
    <div className="categories">
      <section className="balance tile no-title">
        <h2>Balance: <span className={ totalBalance < 0 ? "negative" : "positive" }>{printMoney(totalBalance, false)}</span></h2>
      </section>
      <section className="tile pb-0">
        <h2>Intake ({ printMoney(intakeBalance, false) })</h2>
        <Table>
          <tbody>
            {
              intakeCategories.map(category => (
                <tr key={category}>
                  <td className="category">{category}</td>
                  <td className="category-limit">
                    <Form.Control
                      disabled={ !newLimits?.[category]?.isActive }
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...newLimits[category],
                          limit: parseInt(ev.target.value)

                        }
                      })}
                      value={newLimits?.[category]?.limit} />
                  </td>
                  <td className="active">
                    <Form.Check>
                      {newLimits?.[category]?.isActive}
                    </Form.Check>
                    </td>
                  <td className="difference">{printDifference(categoryItems?.items?.[category]?.limit, newLimits?.[category]?.limit)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </section>
      <section className="tile pb-0">
        <h2>Expense ({ printMoney(expenseBalance, false) })</h2>
        <Table>
          <tbody>
            {
              expenseCategories.map(category => (
                <tr key={category}>
                  <td className="category">{category}</td>
                  <td className="category-limit">
                    <Form.Control
                      disabled={ !newLimits?.[category]?.isActive }
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...newLimits[category],
                          limit: parseInt(ev.target.value)

                        }
                      })}
                      value={newLimits?.[category]?.limit} />
                  </td>
                  <td className="active">
                    <Form.Check>
                      {newLimits?.[category]?.isActive}
                    </Form.Check>
                    </td>
                  <td className="difference">{printDifference(categoryItems?.items?.[category]?.limit, newLimits?.[category]?.limit)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </section>
      <section className="d-grid gap-2">
        <Button>Save</Button>
      </section>
    </div>
  )
}