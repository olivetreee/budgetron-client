import { Table } from "react-bootstrap";
import dateUtils from "date-and-time";
import { printMoney } from "../utils";
import "./NextMonth.scss";

const TODAY = new Date();

function getNextChargeDate() {
  let monthsToAdd = 0;

  switch(this.schedule) {
    case "Every 2 Months":
      if ((TODAY.getMonth() - this.firstDateOfCharge.getMonth()) % 2) {
        // If monthDiff%2 is 1, it means we're not in a charge month, so pring next month.
        // If not, print this month.
        monthsToAdd = 1;
      }
      break;
    case "Every 3 Months":
      if (( TODAY.getMonth() - this.firstDateOfCharge.getMonth()) % 3) {
        // If monthDiff%2 is 1, it means we're not in a charge month, so pring next month.
        // If not, print this month.
        monthsToAdd = 1;
      }
      break;
    case "Monthly":
    default:
      monthsToAdd = 1;
  }
  return `${dateUtils.format(dateUtils.addMonths(TODAY, monthsToAdd), "MMM")} ${this.firstDateOfCharge.getDate()}`
}

const RECURRING_EXPENSES = [
  new (function() {
    this.category = "Utility";
    this.type = "Energy";
    this.vendor = "Seattle City Lights";
    this.schedule = "Monthly";
    this.firstDateOfCharge = new Date("1/4/2023");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 200;
  })(),
  new (function() {
    this.category = "Utility";
    this.type = "Gas";
    this.vendor = "Puget Sound Energy";
    this.schedule = "Monthly";
    this.firstDateOfCharge = new Date("1/4/2023");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 30;
  })(),
  new (function() {
    this.category = "Utility";
    this.type = "Wastewater";
    this.vendor = "City of Shoreline - Wastewater Utility";
    this.schedule = "Every 2 Months";
    this.firstDateOfCharge = new Date("12/20/2022");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 140;
  })(),
  new (function() {
    this.category = "Utility";
    this.type = "Capacity Charge";
    this.vendor = "King County Capacity Charge";
    this.schedule = "Every 3 Months";
    this.firstDateOfCharge = new Date("2/5/2023");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 130;
  })(),
  new (function() {
    this.category = "Utility";
    this.type = "Water";
    this.vendor = "North City Water District";
    this.schedule = "Every 2 Months";
    this.firstDateOfCharge = new Date("1/11/2023");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 110;
  })(),
  new (function() {
    this.category = "Utility";
    this.type = "Garbage";
    this.vendor = "Recology";
    this.schedule = "Every 3 Months";
    this.firstDateOfCharge = new Date("12/31/2022");
    this.nextCharge = getNextChargeDate.call(this);
    this.hasChargeThisMonth = this.nextCharge.includes(dateUtils.format(TODAY, "MMM"));
    this.averageAmount = 135;
  })(),
]

export const NextMonth = () => (
  <div className="next-month">
    <section>
      <h2>Utilities Schedule</h2>
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
          {/* <tr>
            <td>Energy</td>
            <td>Seattle City Lights</td>
            <td>Energy</td>
            <td>Energy</td>
          </tr>
          <tr>
            <td>Gas</td>
            <td>Puget Sound Energy</td>
            <td>Gas</td>
            <td>Gas</td>
          </tr>
          <tr>
            <td>Water</td>
            <td>North City Water District</td>
            <td>Water</td>
            <td>Water</td>
          </tr>
          <tr>
            <td>Wastewater</td>
            <td>Capacity Charge</td>
            <td>Wastewater</td>
            <td>Wastewater</td>
          </tr>
          <tr>
            <td>Capacity Charge</td>
            <td>Capacity Charge</td>
            <td>Capacity Charge</td>
            <td>Capacity Charge</td>
          </tr>
          <tr>
            <td>Trash</td>
            <td>Trash</td>
            <td>Trash</td>
            <td>Trash</td>
          </tr> */}
        </tbody>
      </Table>
    </section>
  </div>
)
