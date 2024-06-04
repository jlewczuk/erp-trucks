import { ReactNode, useState } from "react";
import { TrucksContext } from "./TrucksContext";
import { ITruck } from "../../interfaces";
import { OrderEnum } from "../../components/Table/Table";
import { TruckFormActionEnum } from "../../enums";

type TrucksProviderProps = {
  children: ReactNode;
};

interface TruckUpdateTriggerType {
  isTriggered: boolean;
  action?: TruckFormActionEnum | undefined;
}

export const TrucksProvider = ({ children }: TrucksProviderProps) => {
  const [trucks, setTrucks] = useState<ITruck[] | null>(null);
  const [truckUpdateTrigger, setTruckUpdateTrigger] =
    useState<TruckUpdateTriggerType>({ isTriggered: false });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<OrderEnum | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <TrucksContext.Provider
      value={{
        trucks,
        setTrucks,
        truckUpdateTrigger,
        setTruckUpdateTrigger,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        totalPages,
        setTotalPages,
      }}
    >
      {children}
    </TrucksContext.Provider>
  );
};
