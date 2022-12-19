import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CategoriesDropdown } from './CategoriesDropdown';

import "./VendorTile.scss";

export const VendorTile = ({ vendor }) => {
  const [vendorName, setvendorName] = useState(vendor.name);
  const [category, setCategory] = useState(vendor.category);

  const onSave = () => {
    console.log("@@@SAVING!", vendorName, category);
  }

  return (
    <div className="vendor-tile">
      <Container>
        <Row className="d-flex justify-content-center m-3 p-3 form">
          <Col xs={10} md={9}>
            <Row>
              <Col sm={12} md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control onChange={ev => setvendorName(ev.target.value)} value={vendorName} />
                </Form.Group>
              </Col>
              <Col sm={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                    <CategoriesDropdown currentValue={category} onChange={setCategory}/>
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col xs={2} md={9} className="save-button">
            <Button variant="primary" onClick={onSave}>Save</Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}