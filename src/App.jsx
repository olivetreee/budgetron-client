import { Suspense, lazy } from 'react';
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
import { LoadingIndicator } from './components/LoadingIndicator';

const MainWrapper = ({ title, canNavigateBack, children }) => (
  <ProtectedRoute>
    <Header title={title} canNavigateBack={canNavigateBack}/>
    <div className="body-wrapper">
      { children}
    </div>
  </ProtectedRoute>
)

// This page renders a component from AnyChart, which has added ~800kb to the gzipped file.
// Since I don't expect to open this frequently, I'm lazy loading it
const ExpenseReport = lazy(() => import('./pages/ExpenseReport'));

const router = createHashRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: PAGE_DATA.dashboard.path,
    element: (
      <MainWrapper title={PAGE_DATA.dashboard.name} >
        <MainDashboard />
      </MainWrapper>
    ),
  },
  {
    path: PAGE_DATA.transactions.path,
    element: (
      <MainWrapper title={PAGE_DATA.transactions.name} canNavigateBack={true} >
        <CategoryTransactions />
      </MainWrapper>
    ),
  },
  {
    path: PAGE_DATA.fixVendors.path,
    element: (
      <MainWrapper title={PAGE_DATA.fixVendors.name}>
        <FixVendors />
      </MainWrapper>
    ),
  },
  {
    path: PAGE_DATA.categories.path,
    element: (
      <MainWrapper title={PAGE_DATA.categories.name}>
        <Categories />
      </MainWrapper>
    ),
  },
  {
    path: PAGE_DATA.tagReport.path,
    element: (
      <MainWrapper title={PAGE_DATA.tagReport.name}>
        <TagReport />
      </MainWrapper>
    ),
  },
  {
    path: "this-month",
    element: (
      <MainWrapper title="This Month">
        <ThisMonth />
      </MainWrapper>
    ),
  },
  {
    path: PAGE_DATA.expenseReport.path,
    element: (
      <MainWrapper title={PAGE_DATA.expenseReport.name}>
        <Suspense fallback={<LoadingIndicator />}>
          <ExpenseReport />
        </Suspense>
      </MainWrapper>
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
