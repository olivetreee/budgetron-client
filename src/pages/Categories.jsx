import { useMemo } from "react";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useCategories } from "../components/CategoriesProvider";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useToaster } from "../components/ToasterProvider";
import { printMoney } from "../utils";

import "./Categories.scss";

const printDifference = (oldValue, newValue) => {
  const diff = oldValue - (newValue || oldValue);
  let iconClass = '';
  if (diff > 0) iconClass = "fa-arrow-down";
  if (diff < 0) iconClass = "fa-arrow-up";

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
  const toaster = useToaster();
  const [
    {
      categoryLimits,
      categoriesByType: { expense: expenseCategories, intake: intakeCategories },
      loading
    },
    { batchEditCategories }
  ] = useCategories();
  const [newLimits, setNewLimits] = useState({});

  const limitsToRender = useMemo(() => ({
    ...categoryLimits,
    ...newLimits
  }), [categoryLimits, newLimits])

  if (loading) {
    return (
      <div className="text-center">
        <LoadingIndicator />
      </div>
    );
  }

  const intakeBalance = intakeCategories.reduce((acc, category) => acc + limitsToRender[category]?.limit, 0);
  const expenseBalance = expenseCategories.reduce((acc, category) => categoryLimits[category].isActive
    ? acc + limitsToRender[category]?.limit
    : acc,
  0);
  const totalBalance = intakeBalance - expenseBalance;

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
                      disabled={ !limitsToRender[category].isActive }
                      value={limitsToRender[category]?.limit}
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...limitsToRender[category],
                          limit: parseInt(ev.target.value) || 0
                        }
                      })}
                    />
                  </td>
                  <td className="active">
                    <Form.Check
                      checked={limitsToRender[category].isActive}
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...limitsToRender[category],
                          isActive: ev.target.checked
                        }
                      })}
                      />
                    </td>
                  <td className="difference">{printDifference(categoryLimits[category]?.limit, newLimits[category]?.limit)}</td>
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
                      disabled={ !limitsToRender[category].isActive }
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...limitsToRender[category],
                          limit: parseInt(ev.target.value) || 0

                        }
                      })}
                      value={limitsToRender[category]?.limit} />
                  </td>
                  <td className="active">
                    <Form.Check
                      checked={limitsToRender[category].isActive}
                      onChange={ev => setNewLimits({
                        ...newLimits,
                        [category]: {
                          ...limitsToRender[category],
                          isActive: ev.target.checked
                        }
                      })}
                      />
                    </td>
                  <td className="difference">{printDifference(categoryLimits[category]?.limit, newLimits[category]?.limit)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </section>
      <section className="d-grid gap-2">
        <Button
          disabled={!Object.keys(newLimits).length}
          onClick={async () => {
            const changes = Object.values(newLimits);
            await batchEditCategories({ changes });
            setNewLimits({});
            toaster({ variant: "success" });
          }}
        >
          Save
        </Button>
      </section>
    </div>
  )
}