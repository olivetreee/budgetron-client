import { useNavigate } from "react-router";
import Button from 'react-bootstrap/Button';

import { Hamburger } from "./Hamburger";

import "./Header.scss";

export const Header = ({ title, canNavigateBack }) => {
  const navigate = useNavigate();
  return (
    <header className="top-header">
      <Hamburger />
      <h1 className="page-title">
        {
          canNavigateBack && (
            <Button variant="link" onClick={() => navigate(-1)}>
              <i class="fa-solid fa-circle-chevron-left"></i>
            </Button>
          )
        }
        {title}
      </h1>
    </header>
  );
}