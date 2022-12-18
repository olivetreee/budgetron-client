import Dropdown from 'react-bootstrap/Dropdown';

export const VendorTile = ({ vendor }) => (
  <div className="vendor-tile">
    {console.log(vendor)}
    <p>{vendor.name}</p>
    {/* TODO: use the following list to update the transactions that has this merchant */}
    <p>{vendor.transactions.join(", ")}</p>
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)