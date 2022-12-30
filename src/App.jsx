import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { MainDashboard } from "./pages/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';
import { CategoriesProvider } from './components/CategoriesProvider';
import { FixVendors } from "./pages/FixVendors";
import { AuthProvider, ProtectedRoute } from "./components/AuthProvider";
import { Login } from "./pages/Login";
import { NavBar } from "./components/NavBar";

import './App.scss';

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
