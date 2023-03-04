import { useLocation } from 'react-router-dom'
import dateUtils from 'date-and-time';

import { useTransactions } from '../providers/TransactionsProvider';
import { VendorTransactionsTile } from '../components/VendorTransactionsTile';
import { CATEGORY_ICON } from '../constants';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { printMoney } from '../utils';

import "./CategoryTransactions.scss";

const groupByVendorOrderByAmount = (transactions) => transactions.reduce((acc, transaction) => {
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

export const CategoryTransactions = ({ date = new Date() }) => {
  const location = useLocation();
  const [{ loading, items, grouping }, { deleteTransaction }] = useTransactions();

  if (loading) {
    return (
      <div className="category-transactions">
        <LoadingIndicator />
      </div>
    )
  }

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category").replace("_", " ");

  const categoryTransactionIds = grouping.category[category];

  const onDeleteClick = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete this ${printMoney(transaction.amount)} transaction at ${transaction.vendor}?`)){
      await deleteTransaction(transaction);
    }
  }

  if (!categoryTransactionIds || !categoryTransactionIds.length) {
    return (
      <div className="category-transactions empty">
        <h1>
          <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
          { category }
          <br />
          <span>{dateUtils.format(date, "MMM YYYY")}</span>
        </h1>
        <h2>No transactions found</h2>
      </div>
    )
  }
  const groupedTransactions = groupByVendorOrderByAmount(
    categoryTransactionIds.map(id => items[id])
  );

  return (
    <div className="category-transactions">
      <h1>
        <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
        { category }
        <br />
        <span>{dateUtils.format(date, "MMM YYYY")}</span>
      </h1>
      {
        Object.entries(groupedTransactions).map(([vendorName, transactions]) => (
          <VendorTransactionsTile vendorName={vendorName} transactions={transactions} onDelete={onDeleteClick} key={vendorName}/>
        ))
      }
    </div>
  );
};
