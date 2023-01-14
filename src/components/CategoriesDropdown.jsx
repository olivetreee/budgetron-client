import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useCategories } from "./CategoriesProvider";

export const CategoriesDropdown = ({ currentValue, onChange }) => {
  const [{ categoriesByType: { all: categoriesList } }] = useCategories();
  return (
    <DropdownButton variant="light" onSelect={onChange} title={currentValue}>
      {categoriesList.map(category => (
        <Dropdown.Item key={category} eventKey={category}>{category}</Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
