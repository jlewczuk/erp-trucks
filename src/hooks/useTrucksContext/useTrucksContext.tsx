import { TrucksContext } from "../../contexts";
import { useContext } from "react";

export const useTrucksContext = () => {
  const context = useContext(TrucksContext);
  if (!context) {
    throw new Error(
      "useTrucksContext must be used within an TrucksContext provider",
    );
  }
  return context;
};
