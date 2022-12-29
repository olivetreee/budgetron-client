import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { MainDashboard } from "./components/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';
import { CategoriesProvider } from './components/CategoriesProvider';
import { FixVendors } from "./components/FixVendors";
import { AuthProvider, ProtectedRoute } from "./components/AuthProvider";
import { Login } from "./components/Login";
import { Nav } from "react-bootstrap";

import './App.scss';

const NavBar = () => (
  <Nav className="navbar justify-content-around" variant="pills" defaultActiveKey="/#/dashboard">
    <Nav.Item>
      <Nav.Link href="/#/dashboard">Dashboard</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link href="/#/fix-vendors">Fix Vendors</Nav.Link>
    </Nav.Item>
  </Nav>
)


const router = createHashRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <NavBar />
        <MainDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <NavBar />
        <div>Placeholder for Transactions?category=something page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vendors",
    element: (
      <ProtectedRoute>
        <NavBar />
        <div>Placeholder for Vendors page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/fix-vendors",
    element: (
      <ProtectedRoute>
        <NavBar />
        <FixVendors />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CategoriesProvider>
          <TransactionsProvider>
            <RouterProvider router={router} />
          </TransactionsProvider>
        </CategoriesProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
