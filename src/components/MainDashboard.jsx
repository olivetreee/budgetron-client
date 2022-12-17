import { CategoryTile } from "./CategoryTile";
import { useTransactions } from "./TransactionsProvider";
import "./MainDashboard.css";
import { useCategories } from "./CategoriesProvider";

const aggregateExpansesPerCategory = (itemIdsInCategory = [], allItems) =>
  itemIdsInCategory.reduce(
    (acc, itemId) => {
      const rawAmount = allItems[itemId].amount;
      // Make it back-compat with older data that was saved as a string
      const amount = typeof rawAmount === "string" && rawAmount.includes("$")
        ? parseFloat(rawAmount.replace("$",""))
        : rawAmount;
      console.log('@@@amount', amount);
      return acc + amount
    },
    0
  );

export const MainDashboard = () => {
  const [transactionData] = useTransactions();
  const [categoriesData] = useCategories();
  if (!transactionData || !categoriesData) {
    return null;
  }
  const limitPerCategory = categoriesData.items;
  const categoriesList = Object.keys(limitPerCategory);
    // .filter(category => category !== "MISSING CATEGORY");
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
