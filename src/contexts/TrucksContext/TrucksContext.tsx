import { createContext, Dispatch, SetStateAction } from "react";
import { ITruck } from "../../interfaces";
import { OrderEnum } from "../../components/Table/Table";
import { TruckFormActionEnum } from "../../enums";

export type TrucksContext = {
  trucks: ITruck[] | null;
  setTrucks: Dispatch<SetStateAction<ITruck[] | null>>;
  truckUpdateTrigger: {
    isTriggered: boolean;
    action?: TruckFormActionEnum | undefined;
  };
  setTruckUpdateTrigger: Dispatch<
    SetStateAction<{
      isTriggered: boolean;
      action?: TruckFormActionEnum | undefined;
    }>
  >;
  sortField: string | null;
  setSortField: Dispatch<SetStateAction<string | null>>;
  sortOrder: OrderEnum | null;
  setSortOrder: Dispatch<SetStateAction<OrderEnum | null>>;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
};

export const TrucksContext = createContext<TrucksContext | null>(null);
