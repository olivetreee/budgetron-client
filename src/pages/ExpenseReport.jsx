import { useMemo } from 'react';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { SankeyGraph } from '../components/SankeyGraph';
import { useCategories } from '../providers/CategoriesProvider';
import { useTransactions } from '../providers/TransactionsProvider';

export const ExpenseReport = () => {
    const { state: transactionData } = useTransactions();
    const { items: allTransactions, grouping } = transactionData;
    const { category: transactionsByCatgories } = grouping || {};
    const [{
        categoriesByType: { expense: expenseCategories = [], income: incomeCategories = [], all: allCategories },
        loading: categoriesLoading,
    }] = useCategories();

    if (transactionData.loading || categoriesLoading) {
        return <LoadingIndicator />;
    }

    /*
    {
        income: {
            cat1: [{}, {}, {}],
            cat2: [{}, {}, {}],
        },
        expenses: {
            cat3: [{}, {}, {}],
            cat4: [{}, {}, {}],
        }
    }
    */

    let totalIncome = 0;
    const incomeTransactions = incomeCategories.reduce((acc, category) => {
        let result = acc;
        if (transactionsByCatgories[category]) {
            result = {
                ...acc,
                [category]: transactionsByCatgories[category].map(id => {
                    const transaction = allTransactions[id];
                    // Not a super pure function since we're updating totalIncome as a side effect,
                    // but it also seems dumb to loop through twice just to calculate total...
                    totalIncome += transaction.amount;
                    return transaction;
                })
            }
        }
        return result
        },
    {});
    // const totalIncome = Object.values(incomeTransactions).reduce((acc, transaction) => acc+= transaction.amount, 0);
    const incomeTransactionData = {
        incomeTransactions,
        totalIncome: Math.round(totalIncome)
    };

    let totalExpense = 0;
    const expenseTransactions = expenseCategories.reduce((acc, category) => {
        let result = acc;
        if (transactionsByCatgories[category]) {
            result = {
                ...acc,
                [category]: transactionsByCatgories[category].map(id => {
                    const transaction = allTransactions[id];
                    // Not a super pure function since we're updating totalIncome as a side effect,
                    // but it also seems dumb to loop through twice just to calculate total...
                    totalExpense += transaction.amount;
                    return transaction;
                })
            }
        }
        return result
        },
    {});
    const expenseTransactionData = {
        expenseTransactions,
        totalExpense: Math.round(totalExpense)
    };

    console.log('@@@incomeTransactionData', incomeTransactionData);
    console.log('@@@expenseTransactionData', expenseTransactionData);

    const sankeyData = [];
    Object.entries(incomeTransactions).forEach(([category, transactions]) => {
        sankeyData.push({
            from: category,
            to: "Total Income",
            value: transactions.reduce((acc, t) => Math.round(acc + t.amount), 0)
        });
    })

    Object.entries(expenseTransactions).forEach(([category, transactions]) => {
        sankeyData.push({
            from: "Total Income",
            to: category,
            weight: transactions.reduce((acc, t) => {
                const expense = Math.round(acc + t.amount);
                const copayments = t.copayments?.total || 0;
                return expense - copayments;
            }, 0)
        });
    })

    return <SankeyGraph data={ sankeyData }/>
};

export default ExpenseReport;