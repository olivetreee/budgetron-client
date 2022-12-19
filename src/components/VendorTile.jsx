import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CategoriesDropdown } from './CategoriesDropdown';

import "./VendorTile.scss";
import { LoadingIndicator } from './LoadingIndicator';
import { BASE_API_URL } from '../constants';

const StatusIcon = ({ status }) => (
  <>
    {
      !status
      && (
        <Col xs={1} />
      )
    }
    {
      status === "success"
      && (
        <Col xs={1} className="success-icon d-flex align-items-center">
          <i className="fa-solid fa-square-check" />
        </Col>
      )
    }
    {
      status === "error"
      && (
        <Col xs={1} className="error-icon d-flex align-items-center">
          <i className="fa-solid fa-square-xmark"></i>
        </Col>
      )
    }
  </>
);

export const VendorTile = ({ vendor }) => {
  const [vendorName, setVendorName] = useState(vendor.name);
  const [vendorHumanName, setVendorHumanName] = useState(vendor.name);
  const [category, setCategory] = useState(vendor.category);
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("");

  const onSave = async () => {
    setLoading(true);
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({
        vendor: vendorName,
        category,
        humanReadableName: vendorHumanName
      })
    }

    try {
      const response = await fetch(`${BASE_API_URL}/vendor-categories`, fetchOptions);
      // const response = { status: 204, json: () => ({yo: "yo"}) };
      if (response.status === 204) {
        setFetchStatus("success");
      } else {
        const responseBody = await response.json();
        console.debug(responseBody);
        throw new Error(`Non-200 status: ${response.status}`);

      }
    } catch (err) {
      setFetchStatus("error");
    }
    setLoading(false);
    setTimeout(() => setFetchStatus(""), 3000);
  }

  const onDismiss = () => {
    console.log("@@@DISMISSING!", vendorName, category);
  }

  return (
    <div className="vendor-tile">
      <Container className="form">
        <Row className="d-flex justify-content-center">
          <Col xs={10} lg={9}>
            <Row className="d-flex justify-content-center">
              <Col sm={12} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control onChange={ev => setVendorName(ev.target.value)} value={vendorName} />
                </Form.Group>
              </Col>
              <Col sm={12} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control onChange={ev => setVendorHumanName(ev.target.value)} value={vendorHumanName} />
                </Form.Group>
              </Col>
              <Col xs={11} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                    <CategoriesDropdown currentValue={category} onChange={setCategory}/>
                </Form.Group>
              </Col>
              <StatusIcon status={fetchStatus} />
            </Row>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          {
            loading
            ? (
                <Col xs={12} className="text-center">
                  <LoadingIndicator />
                </Col>
              )
            : (
              <>
                <Col xs={2} className="save-button">
                  <Button
                    variant="primary"
                    disabled={loading}
                    onClick={onSave}
                  >
                      {loading ? <LoadingIndicator /> : "Save"}
                  </Button>
                </Col>
                <Col xs={2} className="dismiss-button">
                  <Button
                    variant="danger"
                    disabled={loading}
                    onClick={onDismiss}
                  >
                    {loading ? <LoadingIndicator /> : "Dismiss"}
                  </Button>
                </Col>
              </>
            )
          }
        </Row>
      </Container>
    </div>
  )
}