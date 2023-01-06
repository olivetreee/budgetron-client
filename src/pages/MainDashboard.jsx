import { CategoryTile } from "../components/CategoryTile";
import { useTransactions } from "../components/TransactionsProvider";
import { useCategories } from "../components/CategoriesProvider";
import { LoadingIndicator } from "../components/LoadingIndicator";

import "./MainDashboard.scss";

const aggregateExpansesPerCategory = (itemIdsInCategory = [], allItems) =>
  itemIdsInCategory.reduce(
    (acc, itemId) => {
      const rawAmount = allItems[itemId].amount;
      // Make it back-compat with older data that was saved as a string
      const amount = typeof rawAmount === "string" && rawAmount.includes("$")
        ? parseFloat(rawAmount.replace("$",""))
        : rawAmount;
      return acc + amount
    },
    0
  );

export const MainDashboard = () => {
  const [transactionData] = useTransactions();
  const [categoryLimits, { expense: categoriesList }] = useCategories({ type: "expense" });
  if (transactionData.loading || !categoryLimits) {
    return (
      <div className="main-dashboard">
        <LoadingIndicator />
      </div>
    )
  }

  if (!transactionData.size) {
    return (
      <div className="main-dashboard">
        No transactions found.
      </div>
    )
  }
  const categoryLimitItems = categoryLimits.items;
  const spentPerCategory = categoriesList.reduce((acc, category) => ({
    ...acc,
    [category]: aggregateExpansesPerCategory(transactionData.grouping.category[category], transactionData.items)
  }), {})

  categoriesList.sort((a, b) => {
    const percentageA = (spentPerCategory[a]/categoryLimitItems[a].limit) * 100;
    const percentageB = (spentPerCategory[b]/categoryLimitItems[b].limit) * 100;
    if (percentageA < percentageB) {
      return 1;
    }
    if (percentageA > percentageB) {
      return -1;
    }
    return 0;
  });

  return (
    <div className="main-dashboard">
      {categoriesList.map(category => (
        <CategoryTile
          key={category}
          category={category}
          limit={categoryLimitItems[category].limit}
          amountSpent={spentPerCategory[category]}
        />
      ))}
    </div>
  );
}
