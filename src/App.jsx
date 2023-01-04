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
import { CategoryTransactions } from "./pages/CategoryTransactions";
import { ToasterProvider } from "./components/ToasterProvider";

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
        <CategoryTransactions />
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
        <ToasterProvider>
          <CategoriesProvider>
            <TransactionsProvider>
              <RouterProvider router={router} />
            </TransactionsProvider>
          </CategoriesProvider>
        </ToasterProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
