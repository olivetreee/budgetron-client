import { useMemo } from "react";
import { CategoryTile } from "../components/CategoryTile";
import { useTransactions } from "../providers/TransactionsProvider";
import { useCategories } from "../providers/CategoriesProvider";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { printMoney } from "../utils";

import "./MainDashboard.scss";

const aggregateTransactionsPerCategory = (itemIdsInCategory = [], allItems) =>
  itemIdsInCategory.reduce(
    (acc, itemId) => {
      const currentItem = allItems[itemId];
      const rawAmount = currentItem.amount;
      // Make it back-compat with older data that was saved as a string
      const amount = typeof rawAmount === "string" && rawAmount.includes("$")
        ? parseFloat(rawAmount.replace("$",""))
        : rawAmount;
      const copayments = currentItem.copayments?.total || 0;
      return acc + amount - copayments
    },
    0
  );

export const MainDashboard = () => {
  const { state: transactionData } = useTransactions();
  const {
    items: allTransactions,
    idsByView: {
      dashboard: relevantTransIds = {}
    }
   } = transactionData;
  const [{
    categoryLimits,
    categoriesByType: { expense: expenseCategories = [], income: incomeCategories = [], all: allCategories },
    loading: categoriesLoading,
  }] = useCategories();

  const balances = useMemo(() => {
    const expenses = Array.from(relevantTransIds || []).reduce((acc, transId) => {
      const item = allTransactions[transId];
      if (!expenseCategories.includes(item.category)) {
        return acc;
      }
      const copayments = item.copayments?.total || 0;
      return acc + item.amount - copayments;
    }, 0);
    const incomes = Array.from(relevantTransIds || []).reduce((acc, transId) => {
      const item = allTransactions[transId];
      if (!incomeCategories.includes(item.category)) {
        return acc;
      }
      const copayments = item.copayments?.total || 0;
      return acc + item.amount - copayments;
    }, 0);
    const expenseLimit = (expenseCategories || []).reduce((acc, categoryType) => categoryLimits[categoryType].isActive
      ? acc + categoryLimits[categoryType].limit
      : acc, 0);
    return {
      expenseLimit,
      totalExpense: expenses,
      totalIncome: incomes,
      currentBalance: expenseLimit - expenses
    };
  }, [categoryLimits, expenseCategories, incomeCategories, allTransactions, relevantTransIds]);

  // This would only be present if an expense has a category that:
  // * isn't one of the current categories
  // * is currnetly inactive
  const otherCategoriesTransactions = useMemo(() => {
    const categoriesSet = new Set(allCategories);
    return Array.from(relevantTransIds || []).reduce((acc, id) => {
      const data = allTransactions[id];
      const category = data.category;
      const isValidCategory = categoriesSet.has(category) || categoryLimits[category]?.isActive;
      return isValidCategory ? acc : [...acc, id];
    }, [])
  }, [allCategories, allTransactions, relevantTransIds, categoryLimits])

  if (transactionData.loading || categoriesLoading) {
    return (
      <div className="main-dashboard loading">
        <LoadingIndicator />
      </div>
    )
  }

  if (!relevantTransIds?.size) {
    return (
      <div className="main-dashboard">
        No transactions found.
      </div>
    )
  }
  const spentPerCategory = allCategories.reduce((acc, category) => ({
    ...acc,
    [category]: aggregateTransactionsPerCategory(transactionData.grouping.category[category], allTransactions)
  }), {})

  expenseCategories
    .sort((a, b) => {
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

  const categoriesToRender = expenseCategories.filter(category => categoryLimits[category].isActive);

  return (
    <div className="main-dashboard">
      <section className="balances tile no-title">
        <h3 className="line">
          <p>Income</p>
          <p>{printMoney(balances.totalIncome, false)}</p>
        </h3>
        <h3 className="line">
          <p>Expenses</p>
          <p>{printMoney(balances.totalExpense, false)} <span className="expense-limit">/ {printMoney(balances.expenseLimit, false)}</span></p>
        </h3>
        <h3 className="line">
          <p>Balance</p>
          <p className={balances.currentBalance > 0 ? "positive" : "negative"}>{printMoney(balances.currentBalance, false)}</p>
        </h3>
      </section>
      <section className="category-breakdown">
        {categoriesToRender.map(category => (
          <CategoryTile
            key={category}
            category={category}
            limit={categoryLimits[category].limit}
            amountSpent={spentPerCategory[category]}
          />
        ))}
      </section>
      <section className="income-categories">
        {incomeCategories.map(category => (
          <CategoryTile
            key={category}
            category={category}
            limit={categoryLimits[category].limit}
            amountSpent={spentPerCategory[category]}
            invertScale={true}
          />
        ))}
      </section>
      <section className="incorrect-categories">
      {
          // TODO: This might not render the correct ones in
          // CategoryTransactions
          otherCategoriesTransactions.map(id => (
            <CategoryTile
              key={id}
              category={allTransactions[id].category}
              limit={0}
              amountSpent={1} />
          ))
        }
      </section>
    </div>
  );
}
