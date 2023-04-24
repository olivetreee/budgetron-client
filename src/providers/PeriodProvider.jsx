import { createContext, useState, useContext } from "react";
import dateUtils from 'date-and-time';

export const PeriodContext = createContext();

export const usePeriod = () => useContext(PeriodContext);

export const PeriodProvider = ({ children }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
  return (
    <PeriodContext.Provider value={[selectedPeriod, setSelectedPeriod]}>
      {children}
    </PeriodContext.Provider>
  );
};
