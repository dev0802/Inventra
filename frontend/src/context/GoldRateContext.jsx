import { createContext, useContext } from "react";

export const GoldRateContext = createContext(null);
export const useGoldRate = () => useContext(GoldRateContext);