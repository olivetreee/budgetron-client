import { LoadingIndicator } from "./LoadingIndicator";
import { useTransactions } from "./TransactionsProvider";
import { VendorTile } from "./VendorTile";

export const FixVendors = () => {
  const [transactionData] = useTransactions();
  console.log('@@@transactionData', transactionData);
  if (transactionData.loading) {
    return <LoadingIndicator />;
  };

  const missingCategoryTransactionIds = transactionData.grouping.category["MISSING CATEGORY"];
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