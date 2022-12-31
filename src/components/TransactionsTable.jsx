import Table from 'react-bootstrap/Table';
import dateUtils from 'date-and-time';
import { printMoney } from '../utils';

export const TransactionsTable = ({ transactions }) => (
  <Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>#</th>
        <th>Vendor</th>
        <th>Amount</th>
        <th>When</th>
        <th>Who</th>
      </tr>
    </thead>
    <tbody>
      {
        transactions.map((transaction, idx) => (
        <tr key={transaction.emailId}>
          <td>{idx+1}</td>
          <td>{transaction.vendor}</td>
          <td>{printMoney(transaction.amount)}</td>
          <td>{dateUtils.format(new Date(transaction.timestamp), "DD MMM")}</td>
          <td>{transaction.author}</td>
        </tr>
        ))
      }
    </tbody>
  </Table>
)
