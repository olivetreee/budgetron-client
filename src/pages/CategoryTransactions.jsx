import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dateUtils from 'date-and-time';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useTransactions } from '../components/TransactionsProvider';
import { VendorTransactionsTile } from '../components/VendorTransactionsTile';
import { CATEGORY_ICON } from '../constants';
import { printMoney } from '../utils';
import { CategoriesDropdown } from '../components/CategoriesDropdown';

import "./CategoryTransactions.scss";

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

const EditTransactionModal = ({ transaction, onSave, onCancel, isOpen }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const makePatchBody = () => ({
    monthYear: editedTransaction.monthYear,
    emailId: editedTransaction.emailId,
    changes: [
      { path: 'category', newValue: editedTransaction.category },
      { path: 'author', newValue: editedTransaction.author },
    ],
  });

  return (
    <Modal className="edit-transactions-modal" show={isOpen} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Transaction</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Vendor</Form.Label>
        <p>{editedTransaction.vendor}</p>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <p>{printMoney(editedTransaction.amount)}</p>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <CategoriesDropdown
          currentValue={editedTransaction.category}
          onChange={newValue => setEditedTransaction({ ...editedTransaction, category: newValue })} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control onChange={ev => setEditedTransaction({ ...editedTransaction, author: ev.target.value})}
        value={editedTransaction.author} />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => {
          setEditedTransaction(transaction);
          onCancel();
        }}>
        Close
      </Button>
      <Button variant="primary" onClick={() => onSave(makePatchBody())}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export const CategoryTransactions = ({ date = new Date() }) => {
  const location = useLocation();
  const [{ items, grouping }, { editTransaction }] = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category").replace("_", " ");

  const categoryTransactionIds = grouping.category[category];

  const onEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  }

  const onEditSave = async (patchData) => {
    try {
      await editTransaction(patchData);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error when PATCHING");
      console.error(err);
    }
  }

  const onEditCancel = () => {
    setIsModalOpen(false);
  }

  if (!categoryTransactionIds || !categoryTransactionIds.length) {
    return (
      <div className="category-transactions empty">
        <h1>
          <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
          { category }
          <br />
          <span>{dateUtils.format(date, "MMM YYYY")}</span>
        </h1>
        <h2>No transactions found</h2>
      </div>
    )
  }
  const groupedTransactions = groupByVendorOrderByAmount(
    categoryTransactionIds.map(id => items[id])
  );

  return (
    <div className="category-transactions">
      <h1>
        <i className={`fa fa-light ${CATEGORY_ICON[category]}`} />
        { category }
        <br />
        <span>{dateUtils.format(date, "MMM YYYY")}</span>
      </h1>
      {
        Object.entries(groupedTransactions).map(([vendorName, transactions]) => (
          <VendorTransactionsTile vendorName={vendorName} transactions={transactions} onEdit={onEditClick} key={vendorName}/>
        ))
      }
      <EditTransactionModal
        isOpen={isModalOpen}
        transaction={transactionToEdit}
        onSave={onEditSave}
        onCancel={onEditCancel}
        />
    </div>
  );
};