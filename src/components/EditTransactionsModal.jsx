import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { CategoriesDropdown } from '../components/CategoriesDropdown';
import { useToaster } from './ToasterProvider';
import { useTransactions } from '../providers/TransactionsProvider';


export const EditTransactionModal = ({ transaction, onSuccess, onCancel, isOpen }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [splitNewTransaction, setSplitNewTransaction] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToaster();
  const [,{ editTransaction, createTransaction }] = useTransactions();

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const makePatchBody = () => ({
    monthYear: editedTransaction.monthYear,
    emailId: editedTransaction.emailId,
    changes: [
      { path: 'category', newValue: editedTransaction.category },
      { path: 'author', newValue: editedTransaction.author },
      { path: 'amount', newValue: editedTransaction.amount },
    ],
  });

  const onSave = async () => {
    const patchData = makePatchBody();
    setIsLoading(true);
    try {
      if (splitNewTransaction) {
        await createTransaction(splitNewTransaction);
      }
      await editTransaction(patchData);
      onSuccess();
    } catch (err) {
      toaster({ body: err.message, isAutohide: false, variant: "warning" });
      console.error("Error when PATCHING");
      console.error(err);
    }
    setIsLoading(false);
  }

  return (
    <Modal className="edit-transactions-modal" show={isOpen} onHide={onCancel}>
    <Modal.Header>
      <Modal.Title>Edit Transaction</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Vendor</Form.Label>
        <p>{editedTransaction.vendor}</p>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          onChange={ev => setEditedTransaction({ ...editedTransaction, amount: parseFloat(ev.target.value)})}
          value={editedTransaction.amount} />
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
      {
        splitNewTransaction && (
          <section>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                onChange={ev => setSplitNewTransaction({ ...splitNewTransaction, amount: parseFloat(ev.target.value)})}
                value={splitNewTransaction.amount} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <CategoriesDropdown
                currentValue={splitNewTransaction.category}
                onChange={newValue => setSplitNewTransaction({ ...splitNewTransaction, category: newValue })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control onChange={ev => setSplitNewTransaction({ ...splitNewTransaction, author: ev.target.value})}
                value={splitNewTransaction.author} />
            </Form.Group>
          </section>
        )
      }
    </Modal.Body>
    <Modal.Footer>
      <Button disabled={isLoading} variant="secondary" onClick={() => {
          setEditedTransaction(transaction);
          setSplitNewTransaction();
          onCancel();
        }}>
        Close
      </Button>
      {
        !splitNewTransaction && (
          <Button disabled={isLoading} variant="info" onClick={() => {
              setSplitNewTransaction(transaction);
            }}>
            Split
          </Button>
        )
      }
      <Button disabled={isLoading} variant="success" onClick={onSave}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  )
};
