import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import dateUtils from 'date-and-time';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { printMoney } from '../utils';

import "./VendorTransactionsTile.scss";
import { LoadingIndicator } from './LoadingIndicator';
import { EditTransactionModal } from './EditTransactionsModal';
import { TransactionCopaymentsModal } from './TransactionCopaymentsModal';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const CopaymentPopover = ({ transaction }) => (
  <OverlayTrigger
    trigger="click"
    placement="right"
    overlay={
      <Popover className="popover">
        <Popover.Header className="header" as="h3">Copayments</Popover.Header>
        <Popover.Body className="body">
          <p>Initial: {printMoney(transaction.amount)}</p>
          {
            transaction.copayments.items.map(copayment => (
              <p>{copayment.payer}: -{printMoney(copayment.amount)}</p>
            ))
          }
        </Popover.Body>
      </Popover>
    }
  >
    <i className="fa-solid fa-comments-dollar" />
  </OverlayTrigger>
)

const calculateamountAfterCopayments = transaction => transaction.amount - (transaction.copayments?.total || 0);

export const VendorTransactionsTile = ({ vendorName, transactions, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCopayModalOpen, setIsCopayModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState({});

  const onEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const onEditSuccess = () => {
    setIsEditModalOpen(false);
  };

  const onEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const onAddCopayClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsCopayModalOpen(true);
  };

  const onCopaySuccess = () => {
    setIsCopayModalOpen(false);
  };

  const onCopayCancel = () => {
    setIsCopayModalOpen(false);
  };

  return (
    <div className="vendor-transactions mb-5">
      <h2 className="mb-0 pt-3 pb-3">{ vendorName }</h2>
      <Table className="transactions-table">
        <tbody>
          {
            transactions.map(transaction => (
              <tr className="pl-3" key={transaction.emailId}>
                <td className="time">{dateUtils.format(new Date(transaction.timestamp), "ddd, DD MMM")}</td>
                <td className="money">
                  {printMoney(calculateamountAfterCopayments(transaction))}&nbsp;
                  {
                    transaction.copayments?.total ? <CopaymentPopover transaction={transaction} /> : null
                  }
                </td>
                <td className="author">{transaction.author[0]}</td>
                <td>
                  {
                    isLoading
                    ? <LoadingIndicator />
                    : (
                      <>
                        <div className="d-sm-none action-buttons">
                          <DropdownButton
                            variant="secondary"
                            as={ButtonGroup}
                            title={<i className="fa-solid fa-ellipsis-vertical"/>}
                            id="bg-nested-dropdown"
                          >
                            <Dropdown.Item eventKey="1" onClick={async () => onEditClick(transaction)}>
                              <i className="fa-solid fa-pen-to-square"/>Edit
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={async () => onAddCopayClick(transaction)}>
                              <i className="fa-solid fa-comments-dollar"/>Copayments
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="3"
                              onClick={async () => {
                                setIsLoading(true);
                                await onDelete(transaction);
                                setIsLoading(false);
                              }}
                            >
                              <i className="fa-solid fa-trash-can" />Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </div>
                        <div className="d-none d-sm-block action-buttons">
                          <Button
                            variant="secondary"
                            onClick={async () => onAddCopayClick(transaction)}>
                              <i className="fa-solid fa-comments-dollar" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={async () => onEditClick(transaction)}>
                              <i className="fa-solid fa-pen-to-square"></i>
                          </Button>
                          <Button
                            variant="danger"
                            onClick={async () => {
                              setIsLoading(true);
                              await onDelete(transaction);
                              setIsLoading(false);
                            }}>
                              <i className="fa-solid fa-trash-can"></i>
                          </Button>
                        </div>
                      </>
                    )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <EditTransactionModal
        isOpen={isEditModalOpen}
        transaction={transactionToEdit}
        onSuccess={onEditSuccess}
        onCancel={onEditCancel}
        />
      <TransactionCopaymentsModal
        isOpen={isCopayModalOpen}
        transaction={transactionToEdit}
        onSuccess={onCopaySuccess}
        onCancel={onCopayCancel}
        />
    </div>
  );
};
