import Table from 'react-bootstrap/Table';
import dateUtils from 'date-and-time';

import { printMoney } from '../utils';
import "./VendorTransactionsTile.scss";

export const VendorTransactionsTile = ({ vendorName, transactions }) => (
  <div className="vendor-transactions mb-5">
    <h2 className="mb-0 pt-3 pb-3">{ vendorName }</h2>
    <Table className="transactions-table">
      <tbody>
        {
          transactions.map(transaction => (
            <tr className="pl-3" key={transaction.emailId}>
              <td className="time">{dateUtils.format(new Date(transaction.timestamp), "ddd, DD MMM")}</td>
              <td className="money">{printMoney(transaction.amount)}</td>
              <td className="author">{transaction.author[0]}</td>
              <td className="edit">Edit</td>
            </tr>
          ))
        }
      </tbody>

    </Table>
  </div>
)
