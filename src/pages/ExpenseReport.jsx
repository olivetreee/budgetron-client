import { LoadingIndicator } from '../components/LoadingIndicator';
import { SankeyGraph } from '../components/SankeyGraph';
import { useCategories } from '../providers/CategoriesProvider';
import { useTransactions } from '../providers/TransactionsProvider';

export const ExpenseReport = () => {
    const { state: transactionData } = useTransactions();
    const { items: allTransactions, grouping } = transactionData;
    const { category: transactionsByCatgories } = grouping || {};
    const [{
        categoriesByType: { expense: expenseCategories = [], income: incomeCategories = [] },
        loading: categoriesLoading,
    }] = useCategories();

    if (transactionData.loading || categoriesLoading) {
        return <LoadingIndicator />;
    }

    const incomeTransactions = incomeCategories.reduce((acc, category) => {
        let result = acc;
        if (transactionsByCatgories[category]) {
            result = {
                ...acc,
                [category]: transactionsByCatgories[category].map(id => allTransactions[id])
            }
        }
        return result
        },
    {});

    const expenseTransactions = expenseCategories.reduce((acc, category) => {
        let result = acc;
        if (transactionsByCatgories[category]) {
            result = {
                ...acc,
                [category]: transactionsByCatgories[category].map(id => allTransactions[id])
            }
        }
        return result
        },
    {});

    let totalIncome = 0;
    const sankeyData = [];
    Object.entries(incomeTransactions).forEach(([category, transactions]) => {
        const categoryAmount = transactions.reduce((acc, t) => Math.round(acc + t.amount), 0);
        totalIncome += categoryAmount;
        sankeyData.push({
            from: category,
            to: "Total Income",
            weight: categoryAmount
        });
    })

    let totalExpenses = 0;
    Object.entries(expenseTransactions).forEach(([category, transactions]) => {
        const categoryAmount = transactions.reduce((acc, t) => {
            const expense = Math.round(acc + t.amount);
            const copayments = t.copayments?.total || 0;
            return expense - copayments;
        }, 0);
        totalExpenses += categoryAmount;
        sankeyData.push({
            from: "Total Income",
            to: category,
            weight: categoryAmount
        });
    })

    const leftovers = totalIncome - totalExpenses;
    if (leftovers > 0) {
        sankeyData.push({
            from: "Total Income",
            to: null,
            weight: leftovers
        })
    }

    return <SankeyGraph data={ sankeyData }/>
};

export default ExpenseReport;
