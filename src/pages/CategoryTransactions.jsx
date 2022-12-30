import { useLocation } from 'react-router-dom'
import { useTransactions } from '../components/TransactionsProvider';

const groupByVendor = (transactions) => transactions.reduce((acc, transaction) => {
  const vendorTransactions = acc[transaction.vendor] || [];
  vendorTransactions.push(transaction);
  return {
    ...acc,
    [transaction.vendor]: vendorTransactions
  };
}, {})

export const CategoryTransactions = () => {
  const location = useLocation();
  const [{ items, grouping }] = useTransactions();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const categoryTransactionIds = grouping.category[category];
  const groupedTransactions = groupByVendor(
    categoryTransactionIds.map(id => items[id])
  );

  return <pre>{JSON.stringify(groupedTransactions, null, 2)}</pre>;
};