import { ToastTypeEnum, TruckFormActionEnum } from "../../enums";
import { deleteTruck } from "../../helpers";
import { useSelection } from "../useSelection";
import { useToast } from "../useToast";
import { ITruck } from "../../interfaces";
import { useTrucksContext } from "../useTrucksContext";

export const useHandleDeleteTrucks = () => {
  const { setTruckUpdateTrigger } = useTrucksContext();
  const { resetSelection } = useSelection<ITruck>();
  const { showToast } = useToast();

  const getSuccessToastText = (num: number): string => {
    return num > 1
      ? `Successfully deleted ${num} trucks.`
      : "Successfully deleted a truck.";
  };

  const getErrorToastText = (num: number, error: Error): string => {
    return num > 1
      ? `Could not delete ${num} trucks. ${error}`
      : `Could not delete a truck. ${error}`;
  };

  const handleDeleteTrucks = (trucks: ITruck[]) => async (): Promise<void> => {
    try {
      setTruckUpdateTrigger({
        isTriggered: true,
        action: TruckFormActionEnum.DELETE,
      });
      await Promise.all(
        trucks!.map((truck: ITruck) => deleteTruck(truck.id as number)),
      );
      resetSelection();

      showToast({
        header: "Success!",
        text: getSuccessToastText(trucks.length),
        type: ToastTypeEnum.SUCCESS,
      });
    } catch (error) {
      showToast({
        header: "Error",
        text: getErrorToastText(trucks.length, error as Error),
        type: ToastTypeEnum.ERROR,
      });
    }
  };
  return { handleDeleteTrucks };
};
