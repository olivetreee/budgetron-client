import { CategoryTile } from "./CategoryTile";
import { mockTransactionData, mockLimitPerCategory } from "../constants/mockData.js";
import "./MainDashboard.css";

const aggregateExpansesPerCategory = (itemIdsInCategory, allItems) =>
  itemIdsInCategory.reduce(
    (acc, itemId) => acc + allItems[itemId].amount,
    0
  );

export const MainDashboard = () => {
  // TODO: this should be in a provider
  const transactionData = mockTransactionData;
  const limitPerCategory = mockLimitPerCategory;
  const categoriesList = Object.keys(transactionData.grouping.category)
    .filter(category => category !== "MISSING CATEGORY");
  const spentPerCategory = categoriesList.reduce((acc, category) => ({
    ...acc,
    [category]: aggregateExpansesPerCategory(transactionData.grouping.category[category], transactionData.items)
  }), {})

  categoriesList.sort((a, b) => {
    const percentageA = (spentPerCategory[a]/limitPerCategory[a]) * 100;
    const percentageB = (spentPerCategory[b]/limitPerCategory[b]) * 100;
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
          category={category}
          limit={limitPerCategory[category]}
          amountSpent={spentPerCategory[category]}
        />
      ))}
    </div>
  );
}
