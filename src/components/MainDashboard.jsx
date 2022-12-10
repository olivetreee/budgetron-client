import { CategoryTile } from "./CategoryTile";
import mockData from "../constants/mockData.json";

const aggregateExpansesPerCategory = (itemIdsInCategory, allItems) =>
  itemIdsInCategory.reduce((acc, itemId) => {
    const currentItem = allItems[itemId];
    const amount = parseFloat(currentItem.amount.slice(1))
    return acc + amount;
  }, 0);



export const MainDashboard = () => {
  // TODO: this should be in a provider
  const data = mockData;
  const categoriesList = Object.keys(data.grouping.category);
  const spentPerCategory = categoriesList.reduce((acc, category) => ({
    ...acc,
    [category]: aggregateExpansesPerCategory(data.grouping.category[category], data.items)
  }), {})


  return (
    <div className="App">
      {categoriesList.map(category => (
        <CategoryTile
          category={category}
          limit={100}
          amountSpent={spentPerCategory[category]}
        />
      ))}
    </div>
  );
}
