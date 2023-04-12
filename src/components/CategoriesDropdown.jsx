import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useCategories } from "../providers/CategoriesProvider";

export const CategoriesDropdown = ({ currentValue, onChange }) => {
  const [{ categoriesByType: { expense, intake } }] = useCategories();
  return (
    <>
      <style type="text/css">
        {`
          .dropdown-menu {
            overflow: scroll;
            height: 30rem;
          }
        `}
      </style>
      <DropdownButton variant="light" onSelect={onChange} title={currentValue}>
        <Dropdown.Header>Expense</Dropdown.Header>
        {expense.map(category => (
          <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Header>Intake</Dropdown.Header>
        {intake.map(category => (
          <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>
        ))}
      </DropdownButton>
    </>
  );
};
