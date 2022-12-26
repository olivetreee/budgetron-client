import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { MainDashboard } from "./components/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';
import { CategoriesProvider } from './components/CategoriesProvider';
import { FixVendors } from "./components/FixVendors";
import { AuthProvider, ProtectedRoute } from "./components/AuthProvider";
import { Login } from "./components/Login";

import './App.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <div>Placeholder for Transactions?category=something page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vendors",
    element: (
      <ProtectedRoute>
        <div>Placeholder for Vendors page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/fix-vendors",
    element: (
      <ProtectedRoute>
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
