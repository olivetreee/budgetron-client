import { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { CategoriesDropdown } from '../components/CategoriesDropdown';
import { useToaster } from './ToasterProvider';
import { useTransactions } from '../providers/TransactionsProvider';
import { TagsDropdown } from './TagsDropdown';
import { useTags } from '../providers/TagsProvider';

const classifyTagsForRequest = (selectedTags, currentTransactionTags = []) => {
  const tagsToCreate = [];
  const addToTransaction = [];
  selectedTags.forEach(tag => {
    if (tag.__isNew__) {
      tagsToCreate.push(tag.label);
      return;
    }
    addToTransaction.push(tag.value);
  });

  const removeFromTransaction = [];
  currentTransactionTags.forEach(tag => {
    if (!selectedTags.some(t => t.value === tag)) {
      removeFromTransaction.push(tag);
    }
  });

  return {
    tagsToCreate,
    removeFromTransaction,
    addToTransaction
  };
}

const makePatchBody = (transaction, tagsToAdd, tagsToRemove) => {
  // This should init to all current tags + newly added tags. Duplicates are removed when
  // the Set is created.
  const newTransactionTags = new Set((transaction.tags || []).concat(tagsToAdd));
  tagsToRemove.forEach(tagId => newTransactionTags.delete(tagId));
  return {
    monthYear: transaction.monthYear,
    emailId: transaction.emailId,
    changes: [
      { path: 'category', newValue: transaction.category },
      { path: 'author', newValue: transaction.author },
      { path: 'amount', newValue: transaction.amount },
      { path: 'tags', newValue: Array.from(newTransactionTags) },
    ],
  }
};


export const EditTransactionModal = ({ transaction, onSuccess, onCancel, isOpen }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [splitNewTransaction, setSplitNewTransaction] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tagsRef = useRef(null);
  const toaster = useToaster();
  const [,{ editTransaction, createTransaction }] = useTransactions();
  const [,{ createTag, editTag }] = useTags();

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const onSave = async () => {
    setIsLoading(true);
    const selectedTags = tagsRef.current?.state.selectValue;
    const currentTransactionTags = editedTransaction.tags;
    const {
      tagsToCreate,
      removeFromTransaction,
      addToTransaction
    } = classifyTagsForRequest(selectedTags, currentTransactionTags);
    let newTags = [];
    if (tagsToCreate.length) {
      newTags = await Promise.all(tagsToCreate.map(tag => createTag(tag, transaction)));
      newTags.forEach(tag => addToTransaction.push(tag.id));
    }

    const patchData = makePatchBody(editedTransaction, addToTransaction, removeFromTransaction);
    console.log('@@@patchData', patchData);
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
      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <TagsDropdown tagsRef={tagsRef} initialTags={transaction.tags} />
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
