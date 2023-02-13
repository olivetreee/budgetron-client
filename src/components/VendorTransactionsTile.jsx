import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import dateUtils from 'date-and-time';
import Button from 'react-bootstrap/Button';
import { printMoney } from '../utils';

import "./VendorTransactionsTile.scss";
import { LoadingIndicator } from './LoadingIndicator';

export const VendorTransactionsTile = ({ vendorName, transactions, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="vendor-transactions mb-5">
      <h2 className="mb-0 pt-3 pb-3">{ vendorName }</h2>
      <Table className="transactions-table">
        <tbody>
          {
            transactions.map(transaction => (
              <tr className="pl-3" key={transaction.emailId}>
                <td className="time">{dateUtils.format(new Date(transaction.timestamp), "ddd, DD MMM")}</td>
                <td className="money">{printMoney(transaction.amount)}</td>
                <td className="author">{transaction.author[0]}</td>
                <td className="action-buttons">
                  {
                    isLoading
                    ? <LoadingIndicator />
                    : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={async () => onEdit(transaction)}>
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
                      </>
                    )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>

      </Table>
    </div>
  );
};
