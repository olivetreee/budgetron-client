import { useState, useEffect, useMemo } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';

import { useToaster } from './ToasterProvider';
import { useTransactions } from './TransactionsProvider';
import { printMoney } from '../utils';

import "./TransactionCopaymentsModal.scss";


export const TransactionCopaymentsModal = ({
  isOpen,
  transaction,
  onSuccess,
  onCancel,
}) => {
  const [copayments, setCopayments] = useState(transaction?.copayments || []);
  const [copayIdxToEdit, setCopayIdxToEdit] = useState();
  const [editedCopayment, setEditedCopayment] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const toaster = useToaster();
  const [,{ editTransaction }] = useTransactions();

  useEffect(() => {
    setCopayments(transaction?.copayments || []);
  }, [transaction]);

  const sumOfCopays = useMemo(() =>
    copayments.reduce((acc, copay) => acc + copay.amount, 0),
    [copayments]
  );

  const makePatchBody = () => ({
    monthYear: transaction.monthYear,
    emailId: transaction.emailId,
    changes: [
      { path: 'copayments', newValue: copayments },
    ],
  });

  const onSave = async () => {
    const patchData = makePatchBody();
    setIsLoading(true);
    try {
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
    <Modal className="edit-copayments-modal" show={isOpen} onHide={onCancel}>
      <Modal.Header>
        <Modal.Title>Edit Copayments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          copayments?.map((copay, idx) => (
            <Row className="copayment-item">
              <Col sm={9}>
                <Form.Group className="mb-3">
                  <Form.Label>Payer</Form.Label>
                  <Form.Control
                    disabled={idx !== copayIdxToEdit}
                    onChange={ev => setEditedCopayment({ ...editedCopayment, payer: ev.target.value})}
                    value={idx === copayIdxToEdit ? editedCopayment.payer : copay.payer} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    disabled={idx !== copayIdxToEdit}
                    type="number"
                    step="0.01"
                    onChange={ev => setEditedCopayment({ ...editedCopayment, amount: parseFloat(ev.target.value)})}
                    value={idx === copayIdxToEdit ? editedCopayment.amount : copay.amount} />
                </Form.Group>
              </Col>
              <Col sm={3} className="action-buttons">
                {
                  copayIdxToEdit === idx
                  ? (
                    <Button
                      variant="success"
                      onClick={async () => {
                        setCopayIdxToEdit();
                        setEditedCopayment();
                        const newCopayments = [...copayments];
                        newCopayments[idx] = editedCopayment;
                        if (!editedCopayment.amount) {
                          setEditedCopayment({ ...editedCopayment, amount: 0 });
                          newCopayments[idx].amount = 0;
                        }
                        setCopayments(newCopayments);
                      }}>
                        <i className="fa-solid fa-circle-check"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        setCopayIdxToEdit(idx);
                        setEditedCopayment(copay);
                      }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  )
                }
                <Button
                  variant="danger"
                  onClick={async () => {
                    setCopayIdxToEdit();
                    setEditedCopayment();
                    const newCopayments = [...copayments];
                    newCopayments.splice(idx, 1);
                    setCopayments(newCopayments);
                  }}>
                    <i className="fa-solid fa-trash-can"></i>
                </Button>
              </Col>
              <div className="divider" />
            </Row>
          ))
        }
        <Button
          className="add-button"
          onClick={() => {
            const newCopay = { payer: '', amount: 0 };
            setEditedCopayment(newCopay);
            setCopayments(copayments.concat(newCopay));
            setCopayIdxToEdit(copayments.length);
          }} >
          Add
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <p>
          New Total: {printMoney(transaction.amount - sumOfCopays)}
        </p>
        <div className="footer-buttons">
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={() => {
              setCopayments(transaction.copayments || []);
              onCancel();
            }}>
            Close
          </Button>
          <Button
            disabled={isLoading || transaction.amount - sumOfCopays < 0}
            variant="success"
            onClick={onSave}
          >
            Save Changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
