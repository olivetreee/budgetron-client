import { useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { TagsDropdown } from "../components/TagsDropdown"
import { BASE_API_URL } from "../constants";
import { useTags } from "../providers/TagsProvider";
import { useTransactions } from "../providers/TransactionsProvider";
import { printMoney, simpleFetcher } from "../utils";
import { VendorTransactionsTile } from '../components/VendorTransactionsTile';

const groupByVendorOrderByAmount = (transactions) => transactions.reduce((acc, transaction) => {
  const vendorTransactions = (acc[transaction.vendor] || [])
    .concat(transaction)
    .sort((a,b) => {
      const amountA = typeof a.amount === "string" ? parseFloat(a.amount.replace("$", "")) : a.amount
      const amountB = typeof b.amount === "string" ? parseFloat(b.amount.replace("$", "")) : b.amount
      if (amountA < amountB) {
        return 1;
      }
      if (amountA > amountB) {
        return -1;
      }
      return 0;
    });
  return {
    ...acc,
    [transaction.vendor]: vendorTransactions
  };
}, {})

export const TagReport = () => {
  const tagRef = useRef(null);
  const { state: { items: stateTransactions, idsByView }, actions: { setTransactions } } = useTransactions();
  const relevantTransactionIds = Array.from(idsByView.tagReport || []);

  const [{ tags }] = useTags();
  const [isLoading, setIsLoading] = useState(false);

  const totalSpent = relevantTransactionIds.reduce((acc, transactionId) => acc += stateTransactions[transactionId].amount, 0);
  const transactionsGroupedByVendor = groupByVendorOrderByAmount(
    relevantTransactionIds.map(id => stateTransactions[id])
  );

  const fetchTransactionsFromTag = async () => {
    const tagId = tagRef.current.state.selectValue[0]?.value;
    if (!tagId) {
      return;
    }
    const transactionIds = tags.get(tagId)?.transactions;
    // TODO: handle empty array (no transactions)
    const transactionResources = {};
    const transactionsToFetch = [];
    transactionIds.forEach(transactionId => {
      const emailId = transactionId.split("+").pop();
      const transactionFromState = stateTransactions[emailId];
      if (transactionFromState) {
        transactionResources[emailId] = transactionFromState;
      } else {
        transactionsToFetch.push(transactionId);
      }
    });
    setIsLoading(true);
    await Promise.all(transactionsToFetch.map(async transactionId => {
      const response = await simpleFetcher(`${BASE_API_URL}/transactions/${encodeURIComponent(transactionId)}`);
      const emailId = transactionId.split("+").pop();
      transactionResources[emailId] = response;
    }));
    const data = { items: transactionResources };
    setTransactions({ data, view: "tagReport" });
    setIsLoading(false);
  }

  return (
    <div className="tag-report">
      <section className="tag-select mb-3">
        <h2>Select a tag:</h2>
        <Row>
          <Col xs={9}>
            <TagsDropdown tagsRef={tagRef} isMulti={false}/>
          </Col>
          <Col xs={3}>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={fetchTransactionsFromTag}>
                Load
              </Button>
          </Col>
        </Row>
      </section>
      {
        isLoading
          ? <LoadingIndicator />
          : (
            <>
              <section className="balance tile no-title">
                <h2>Total Spent: <span>{ printMoney(totalSpent) }</span></h2>
              </section>
              <section>
                {
                  Object.entries(transactionsGroupedByVendor).map(([vendorName, transactions]) => (
                    <VendorTransactionsTile vendorName={vendorName} transactions={transactions} key={vendorName}/>
                  ))
                }
              </section>
            </>
          )
      }
    </div>
  )
}