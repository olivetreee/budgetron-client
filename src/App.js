import './App.css';
import { MainDashboard } from "./components/MainDashboard";
import { TransactionsProvider } from './components/TransactionsProvider';

function App() {
  return (
    <div className="App">
      <TransactionsProvider>
        <MainDashboard />
      </TransactionsProvider>
    </div>
  );
}

export default App;
