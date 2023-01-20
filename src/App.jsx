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
// import { NavBar } from "./components/NavBar";
import { CategoryTransactions } from "./pages/CategoryTransactions";
import { ToasterProvider } from "./components/ToasterProvider";
import { Hamburger } from "./components/Hamburger";
import { Categories } from "./pages/Categories";
import { PAGE_DATA } from "./constants";

import './App.scss';

const router = createHashRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: PAGE_DATA.dashboard.path,
    element: (
      <ProtectedRoute>
        <Hamburger />
        <MainDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: PAGE_DATA.transactions.path,
    element: (
      <ProtectedRoute>
        <Hamburger />
        <CategoryTransactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/vendors",
    element: (
      <ProtectedRoute>
        <Hamburger />
        <div>Placeholder for Vendors page</div>
      </ProtectedRoute>
    ),
  },
  {
    path: PAGE_DATA.fixVendors.path,
    element: (
      <ProtectedRoute>
        <Hamburger />
        <FixVendors />
      </ProtectedRoute>
    ),
  },
  {
    path: PAGE_DATA.categories.path,
    element: (
      <ProtectedRoute>
        <Hamburger />
        <Categories />
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
