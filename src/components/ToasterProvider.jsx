import { createContext, useState, useContext, useMemo, useEffect, useReducer } from "react";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import "./ToasterProvider.scss";

export const ToasterContext = createContext();

export const useToaster = () => useContext(ToasterContext);

const VARIANT_TITLE = {
  info: (
    <>
      <strong className="me-auto">
        <i className="xfa-solid fa-circle-info" />
        Info
      </strong>
    </>
  ),
  warning: (
    <>
      <strong className="me-auto">
        <i className="fa-solid fa-triangle-exclamation" />
        Warning
      </strong>
    </>
  ),
  danger: (
    <>
      <strong className="me-auto">
        <i className="fa-solid fa-xmark" />
        Error
      </strong>
    </>
  )
}

export const ToasterProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("");
  const [autohide, setAutohide] = useState(true);
  const [toastBody, setToastBody] = useState("");

  const toaster = ({ title, body, variant, isAutohide = true }) => {
    setToastBody(body);
    if (variant) {
      setToastVariant(variant);
    }
    setAutohide(isAutohide);
    setShowToast(true);
  };

  return (
    <ToasterContext.Provider value={toaster}>
      <ToastContainer className="p-3 toaster" position="top-center">
        <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide={autohide}>
          <Toast.Header>
            { VARIANT_TITLE[toastVariant] || VARIANT_TITLE.info }
          </Toast.Header>
          <Toast.Body>{toastBody}</Toast.Body>
        </Toast>
      </ToastContainer>
      { children }
    </ToasterContext.Provider>
  )
};
