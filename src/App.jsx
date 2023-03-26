import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { MainDashboard } from "./pages/MainDashboard";
import { Login } from "./pages/Login";
import { CategoryTransactions } from "./pages/CategoryTransactions";
import { Categories } from "./pages/Categories";
import { ThisMonth } from "./pages/ThisMonth";
import { FixVendors } from "./pages/FixVendors";
import { TagReport } from "./pages/TagReport";

import { TransactionsProvider } from './providers/TransactionsProvider';
import { CategoriesProvider } from './providers/CategoriesProvider';
import { PeriodProvider } from "./providers/PeriodProvider";
import { TagsProvider } from "./providers/TagsProvider";

import { AuthProvider, ProtectedRoute } from "./components/AuthProvider";
import { Header } from "./components/Header";
import { ToasterProvider } from "./components/ToasterProvider";

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
    path: PAGE_DATA.tagReport.path,
    element: (
      <ProtectedRoute>
        <Header title={PAGE_DATA.tagReport.name}/>
        <div className="body-wrapper">
          <TagReport />
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
              <TagsProvider>
                <TransactionsProvider>
                  <RouterProvider router={router} />
                </TransactionsProvider>
              </TagsProvider>
            </CategoriesProvider>
          </ToasterProvider>
        </PeriodProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
