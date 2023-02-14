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
import { Header } from "./components/Header";
import { CategoryTransactions } from "./pages/CategoryTransactions";
import { ToasterProvider } from "./components/ToasterProvider";
import { Categories } from "./pages/Categories";
import { ThisMonth } from "./pages/ThisMonth";
import { PAGE_DATA } from "./constants";
import { PeriodProvider } from "./components/PeriodProvider";

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
        <Header title={PAGE_DATA.dashboard.name}/>
        <div className="body-wrapper">
          <MainDashboard />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: PAGE_DATA.transactions.path,
    element: (
      <ProtectedRoute>
        <Header title={PAGE_DATA.transactions.name} canNavigateBack={true} />
        <div className="body-wrapper">
          <CategoryTransactions />
        </div>
      </ProtectedRoute>
    ),
  },
  // {
  //   path: PAGE_DATA.vendors.path,
  //   element: (
  //     <ProtectedRoute>
  //       <Header title={PAGE_DATA.vendors.name}/>
            // <div className="body-wrapper">
            //   <div>Placeholder for Vendors page</div>
            // </div>
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: PAGE_DATA.fixVendors.path,
    element: (
      <ProtectedRoute>
        <Header title={PAGE_DATA.fixVendors.name}/>
        <div className="body-wrapper">
          <FixVendors />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: PAGE_DATA.categories.path,
    element: (
      <ProtectedRoute>
        <Header title={PAGE_DATA.categories.name}/>
        <div className="body-wrapper">
          <Categories />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "this-month",
    element: (
      <ProtectedRoute>
        <Header title="This Month"/>
        <div className="body-wrapper">
          <ThisMonth />
        </div>
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <PeriodProvider>
          <ToasterProvider>
            <CategoriesProvider>
              <TransactionsProvider>
                <RouterProvider router={router} />
              </TransactionsProvider>
            </CategoriesProvider>
          </ToasterProvider>
        </PeriodProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
