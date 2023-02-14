import { useMemo } from "react";
import { CategoryTile } from "../components/CategoryTile";
import { useTransactions } from "../components/TransactionsProvider";
import { useCategories } from "../components/CategoriesProvider";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { printMoney } from "../utils";

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
  const [{
    categoryLimits,
    categoriesByType: { expense: expenseCategories },
    loading: categoriesLoading,
  }] = useCategories();

  const balances = useMemo(() => {
    const expenses = Object.values(transactionData.items || {}).reduce((acc, item) => acc + item.amount, 0);
    const expenseLimit = (expenseCategories || []).reduce((acc, categoryType) => acc + categoryLimits[categoryType].limit, 0);
    return {
      expenseLimit,
      totalExpense: expenses,
      currentBalance: expenseLimit - expenses
    };
  }, [categoryLimits, expenseCategories, transactionData]);

  if (transactionData.loading || categoriesLoading) {
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
  const spentPerCategory = expenseCategories.reduce((acc, category) => ({
    ...acc,
    [category]: aggregateExpansesPerCategory(transactionData.grouping.category[category], transactionData.items)
  }), {})

  expenseCategories.sort((a, b) => {
    const percentageA = (spentPerCategory[a]/categoryLimits[a].limit) * 100;
    const percentageB = (spentPerCategory[b]/categoryLimits[b].limit) * 100;
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
      <section className="balances tile no-title">
        <h3 className="line">
          Expense Limit
          <span>{printMoney(balances.expenseLimit, false)}</span>
        </h3>
        <h3 className="line">
          Current Expenses
          <span>{printMoney(balances.totalExpense, false)}</span>
        </h3>
        <h3 className="line">
          Balance
          <span className={balances.currentBalance > 0 ? "positive" : "negative"}>{printMoney(balances.currentBalance, false)}</span>
        </h3>
      </section>
      <section className="category-breakdown">
        {expenseCategories.map(category => (
          <CategoryTile
            key={category}
            category={category}
            limit={categoryLimits[category].limit}
            amountSpent={spentPerCategory[category]}
          />
        ))}
      </section>
    </div>
  );
}
