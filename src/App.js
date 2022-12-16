import './App.css';
import { MainDashboard } from "./components/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';
import { CategoriesProvider } from './components/CategoriesProvider';

function App() {
  return (
    <div className="App">
      <CategoriesProvider>
        <TransactionsProvider>
          <MainDashboard />
        </TransactionsProvider>
      </CategoriesProvider>
    </div>
  );
}

export default App;
