import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CategoriesDropdown } from './CategoriesDropdown';

import "./VendorTile.scss";
import { LoadingIndicator } from './LoadingIndicator';

export const VendorTile = ({ vendor }) => {
  const [vendorName, setVendorName] = useState(vendor.name);
  const [vendorHumanName, setVendorHumanName] = useState(vendor.name);
  const [category, setCategory] = useState(vendor.category);
  const [loading, setLoading] = useState(false);

  const onSave = () => {
    console.log("@@@SAVING!", vendorName, category);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000)
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
              <Col sm={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                    <CategoriesDropdown currentValue={category} onChange={setCategory}/>
                </Form.Group>
              </Col>
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