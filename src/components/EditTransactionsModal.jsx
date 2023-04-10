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
  const addTagsToTransaction = [];
  selectedTags.forEach(tag => {
    if (tag.__isNew__) {
      tagsToCreate.push(tag.label);
      return;
    }
    addTagsToTransaction.push(tag.value);
  });

  const removeTagsFromTransaction = [];
  currentTransactionTags.forEach(tag => {
    if (!selectedTags.some(t => t.value === tag)) {
      removeTagsFromTransaction.push(tag);
    }
  });

  return {
    tagsToCreate,
    removeTagsFromTransaction,
    addTagsToTransaction
  };
}

const makePatchBody = (transaction, editedTransaction, tagsToAdd, tagsToRemove) => {
  // This should init to all current tags + newly added tags. Duplicates are removed when
  // the Set is created.
  const newTransactionTags = new Set((transaction.tags || []).concat(tagsToAdd));
  tagsToRemove.forEach(tagId => newTransactionTags.delete(tagId));
  const newTransactionTagsArray = Array.from(newTransactionTags);

  const changes = [];
  if (transaction.category !== editedTransaction.category) {
    changes.push({ path: 'category', newValue: editedTransaction.category });
  }
  if (transaction.author !== editedTransaction.author) {
    changes.push({ path: 'author', newValue: editedTransaction.author },);
  }
  if (transaction.amount !== editedTransaction.amount) {
    changes.push({ path: 'amount', newValue: editedTransaction.amount });
  }

  const hasTagChanges = transaction.tags?.length !== newTransactionTagsArray.length
    || newTransactionTagsArray.some(editedTag => !transaction.tags?.includes(editedTag));
    if (hasTagChanges) {
    const tagsToLink = tagsToAdd.filter(tagId => !transaction.tags?.includes(tagId));
    changes.push({
      path: 'tags',
      newValue: newTransactionTagsArray,
      tags: {
        link: tagsToLink,
        unlink: tagsToRemove
      }
    });
  }

  return {
    monthYear: transaction.monthYear,
    emailId: transaction.emailId,
    changes,
  }
};


export const EditTransactionModal = ({ transaction, onSuccess, onCancel, isOpen }) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [splitNewTransaction, setSplitNewTransaction] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tagsRef = useRef(null);
  const toaster = useToaster();
  const { actions: { editTransaction, createTransaction, mutate: mutateTransactions }} = useTransactions();
  const [,{ mutate: mutateTags, createTag }] = useTags();

  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const onSave = async () => {
    setIsLoading(true);
    const selectedTags = tagsRef.current?.state.selectValue;
    const currentTransactionTags = editedTransaction.tags;
    const {
      tagsToCreate,
      removeTagsFromTransaction,
      addTagsToTransaction
    } = classifyTagsForRequest(selectedTags, currentTransactionTags);
    let newTags = [];

    if (tagsToCreate.length) {
      newTags = await Promise.all(tagsToCreate.map(tag => createTag(tag, transaction)));
      newTags.forEach(tag => addTagsToTransaction.push(tag.id));
    }

    // TODO: This can be optimized so that it only contains changes for what has
    // actually been edited
    const patchData = makePatchBody(transaction, editedTransaction, addTagsToTransaction, removeTagsFromTransaction);
    try {
      if (splitNewTransaction) {
        await createTransaction(splitNewTransaction);
      }
      await editTransaction(patchData);
      // TODO: we're just calling mutate here to grab latest from API.
      // That's just so we can grab the transaction IDs that were linked to each tag.
      // It's probably better to update local state instead...
      // At the very least, don't call this if no tags update.
      if (patchData.changes.some(change => change.path === "tags")) {
        mutateTags();
        mutateTransactions();
      }
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
