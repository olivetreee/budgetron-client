import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MainDashboard } from "./components/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';
import { CategoriesProvider } from './components/CategoriesProvider';
import { VendorTile } from "./components/VendorTile";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FixVendors } from "./components/FixVendors";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainDashboard />,
  },
  {
    path: "/transactions",
    element: <div>Placeholder for Transactions?category=something page</div>,
  },
  {
    path: "/vendors",
    element: <div>Placeholder for Vendors page</div>,
  },
  {
    path: "/fix-vendors",
    element: <FixVendors />,
  },
]);

function App() {
  return (
    <div className="App">
      <CategoriesProvider>
        <TransactionsProvider>
          <RouterProvider router={router} />
        </TransactionsProvider>
      </CategoriesProvider>
    </div>
  );
}

export default App;
