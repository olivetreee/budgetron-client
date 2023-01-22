import { createContext, useState, useContext } from "react";
import dateUtils from 'date-and-time';

export const PeriodContext = createContext();

export const usePeriod = () => useContext(PeriodContext);

export const PeriodProvider = ({ children }) => {
  const currentPeriod = dateUtils.format(new Date(), "M/YYYY");
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  return (
    <PeriodContext.Provider value={[selectedPeriod, setSelectedPeriod]}>
      {children}
    </PeriodContext.Provider>
  );
};
