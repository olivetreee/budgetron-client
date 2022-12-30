import Table from 'react-bootstrap/Table';
import { printDate, printMoney } from '../utils';

import "./VendorTransactionsTile.scss";

export const VendorTransactionsTile = ({ vendor, transactions }) => (
  <div className="vendor-transactions mb-5">
    <h2 className="mb-0 pt-3 pb-3">{ vendor }</h2>
    <Table className="transactions-table">
      <tbody>
        {
          transactions.map(transaction => (
            <tr className="pl-3">
              <td className="time">{printDate(transaction.timestamp)}</td>
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
