import { Hamburger } from "./Hamburger";

import "./Header.scss";

export const Header = ({ title }) => (
  <header className="top-header">
    <Hamburger />
    <h1 className="page-title">{title}</h1>
  </header>
);
