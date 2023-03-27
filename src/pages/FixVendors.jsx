import { LoadingIndicator } from "../components/LoadingIndicator";
import { useTransactions } from "../providers/TransactionsProvider";
import { VendorTile } from "../components/VendorTile";

export const FixVendors = () => {
  const { state: transactionData } = useTransactions({});
  if (transactionData.loading) {
    return <LoadingIndicator />;
  };

  if (!transactionData.size) {
    return "No transactions found";
  }

  const missingCategoryTransactionIds = transactionData.grouping.category["MISSING CATEGORY"];

  if (!missingCategoryTransactionIds || !missingCategoryTransactionIds.length) {
    return "🎉 All vendors have categories!";
  }
  const allTransactions = transactionData.items;
  const missingCategoryVendors = missingCategoryTransactionIds
    .reduce((acc, id) => {
      const transaction = allTransactions[id];
      const vendor = transaction.vendor;
      if (acc[vendor]) {
        acc[vendor].transactions.push(id);
        return acc;
      }
      return {
        ...acc,
        [vendor]: {
          name: vendor,
          category: transaction.category,
          transactions: [id]
        },
      }
    }, {});

  return Object.values(missingCategoryVendors).map(vendor => (
    <VendorTile key={vendor.name} vendor={vendor} />
  ));
}