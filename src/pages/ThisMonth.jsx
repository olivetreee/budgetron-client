import { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import dateUtils from "date-and-time";
import { printMoney } from "../utils";
import "./ThisMonth.scss";
import { usePeriod } from "../providers/PeriodProvider";

function getNextChargeDate(referenceDate) {
  let monthsToAdd = 0;

  switch(this.schedule) {
    case "Every 2 Months":
      if ((referenceDate.getMonth() - this.firstDateOfCharge.getMonth()) % 2) {
        // If monthDiff%2 is 1, it means we're not in a charge month, so print next month.
        // If not, print this month.
        monthsToAdd = 1;
      }
      break;
    case "Every 3 Months":
      if (( referenceDate.getMonth() - this.firstDateOfCharge.getMonth()) % 3) {
        // If monthDiff%2 is 1, it means we're not in a charge month, so print next month.
        // If not, print this month.
        monthsToAdd = 1;
      }
      break;
    case "Monthly":
    default:
      monthsToAdd = 0;
  }
  return `${dateUtils.format(dateUtils.addMonths(referenceDate, monthsToAdd), "MMM")} ${this.firstDateOfCharge.getDate()}`
}

export const ThisMonth = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [date] = usePeriod();

  const RECURRING_EXPENSES = useMemo(() => (
    [
      new (function() {
        this.category = "Utility";
        this.type = "Energy";
        this.vendor = "Seattle City Lights";
        this.schedule = "Monthly";
        this.firstDateOfCharge = new Date("1/4/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 200;
      })(),
      new (function() {
        this.category = "Utility";
        this.type = "Gas";
        this.vendor = "Puget Sound Energy";
        this.schedule = "Monthly";
        this.firstDateOfCharge = new Date("1/4/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 30;
      })(),
      new (function() {
        this.category = "Utility";
        this.type = "Wastewater";
        this.vendor = "City of Shoreline - Wastewater Utility";
        this.schedule = "Every 2 Months";
        this.firstDateOfCharge = new Date("12/20/2022");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 140;
      })(),
      new (function() {
        this.category = "Utility";
        this.type = "Capacity Charge";
        this.vendor = "King County Capacity Charge";
        this.schedule = "Every 3 Months";
        this.firstDateOfCharge = new Date("2/5/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 130;
      })(),
      new (function() {
        this.category = "Utility";
        this.type = "Water";
        this.vendor = "North City Water District";
        this.schedule = "Every 2 Months";
        this.firstDateOfCharge = new Date("1/11/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 110;
      })(),
      new (function() {
        this.category = "Utility";
        this.type = "Garbage";
        this.vendor = "Recology";
        this.schedule = "Every 3 Months";
        this.firstDateOfCharge = new Date("12/31/2022");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 135;
      })(),
      new (function() {
        this.category = "House";
        this.type = "Cleaning";
        this.vendor = "Claudia";
        this.schedule = "Weekly";

        // 0 is Sunday
        const firstDayOfMonth = new Date(`${date.getMonth()+1}/1/${date.getFullYear()}`);
        const firstWeekdayOfMonth = firstDayOfMonth.getDay();
        const tuesdayValue = 2;
        const diff = tuesdayValue - firstWeekdayOfMonth;
        const daysToAdd = diff < 0 ? diff + 7 : diff;
        this.firstDateOfCharge = new Date(dateUtils.addDays(firstDayOfMonth, daysToAdd));

        this.hasChargeThisMonth = true;

        let lastTueOfMonth = this.firstDateOfCharge;
        let numberOfDaysThisMonth = 0;
        while (lastTueOfMonth.getMonth() === date.getMonth()) {
          lastTueOfMonth = new Date(dateUtils.addDays(lastTueOfMonth, 7));
          numberOfDaysThisMonth += 1;
        }

        this.nextCharge = `${numberOfDaysThisMonth} Tuesdays`;
        this.averageAmount = 145 * numberOfDaysThisMonth;
      })(),
      new (function() {
        this.category = "Car";
        this.type = "Loan";
        this.vendor = "-";
        this.schedule = "Monthly";
        this.firstDateOfCharge = new Date("1/6/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 555;
      })(),
      new (function() {
        this.category = "House";
        this.type = "Mortgage";
        this.vendor = "-";
        this.schedule = "Monthly";
        this.firstDateOfCharge = new Date("1/1/2023");
        this.nextCharge = getNextChargeDate.call(this, date);
        this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(date, "MMM"));
        this.averageAmount = 3200;
      })(),
    ]
  ), [date])

  useEffect(() => {
    const sumOfExpenses = RECURRING_EXPENSES.reduce((acc, current) => current.hasChargeThisMonth
      ? acc + current.averageAmount
      : acc,
    0);
    setTotalExpenses(sumOfExpenses);
  }, [RECURRING_EXPENSES])

  return (
    <div className="next-month">
      <h2>Scheduled Expenses</h2>
      <section>
        <Table>
          <thead>
            <tr>
              <td>Type</td>
              <td>Vendor</td>
              <td>Schedule</td>
              <td>Next Charge Around</td>
              <td>Approx. Ammount</td>
            </tr>
          </thead>
          <tbody>
            {
              RECURRING_EXPENSES.map(expense => (
                <tr key={expense.type} className={expense.hasChargeThisMonth ? "has-charge-this-month" : ""}>
                  <td>{expense.type}</td>
                  <td>{expense.vendor}</td>
                  <td>{expense.schedule}</td>
                  <td>{expense.nextCharge}</td>
                  <td>{printMoney(expense.averageAmount, false)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </section>
      <section className="total">
        <h2>Total for {dateUtils.format(date, "MMM")}: { printMoney(totalExpenses, false) }</h2>
      </section>
    </div>
  )
}