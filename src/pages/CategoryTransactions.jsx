import { useLocation } from 'react-router-dom'
import Table from 'react-bootstrap/Table';

import { useTransactions } from '../components/TransactionsProvider';
import { CATEGORY_ICON } from '../constants';
import { printDate, printMoney } from '../utils';

const groupByVendor = (transactions) => transactions.reduce((acc, transaction) => {
  const vendorTransactions = (acc[transaction.vendor] || [])
    .concat(transaction)
    .sort((a,b) => {
      const amountA = typeof a.amount === "string" ? parseFloat(a.amount.replace("$", "")) : a.amount
      const amountB = typeof b.amount === "string" ? parseFloat(b.amount.replace("$", "")) : b.amount
      if (amountA < amountB) {
        return 1;
      }
      if (amountA > amountB) {
        return -1;
      }
      return 0;
    });
  return {
    ...acc,
    [transaction.vendor]: vendorTransactions
  };
}, {})

const VendorTransactionsTile = ({ vendor, transactions }) => (
  <div className="vendor-transactions">
    <h2>{ vendor }</h2>
    <Table variant="dark" className="transactions-table">
      <tbody>
        {
          transactions.map(transaction => (
            <tr>
              <td>{printDate(transaction.timestamp)}</td>
              <td>{printMoney(transaction.amount)}</td>
              <td>{transaction.author[0]}</td>
              <td>Edit</td>
            </tr>
          ))
        }
      </tbody>

    </Table>
  </div>
)

export const CategoryTransactions = () => {
  const location = useLocation();
  const [{ items, grouping }] = useTransactions();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category").replace("_", " ");

  const categoryTransactionIds = grouping.category[category];
  const groupedTransactions = groupByVendor(
    categoryTransactionIds.map(id => items[id])
  );
  const orderedTransactions = Object.entries

  return (
    <>
      <h1>
        <span className="category-name">
          <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
          { category }
        </span>
        <br />
        Transactions
      </h1>
      {
        Object.entries(groupedTransactions).map(([vendor, transactions]) => (
          <VendorTransactionsTile vendor={vendor} transactions={transactions} />
        ))
      }
    </>

  );
};