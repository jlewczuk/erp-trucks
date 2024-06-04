import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { TRUCK_STATUS } from "../../constants";
import { TrucksContext } from "../../contexts";
import { MaskEnum, ToastTypeEnum, TruckFormActionEnum } from "../../enums";
import { useSelection, useToast } from "../../hooks";
import { Button } from "../Button";
import { Input } from "../Input";
import { OptionType, Select } from "../Select";
import { ButtonContainer } from "../styledComponents";
import { ITruck } from "../../interfaces";
import { TruckStatusEnum } from "../../interfaces/ITruck";
import { Spinner } from "../Spinner";
import { postTruck, putTruck } from "../../helpers";

interface AddTruckFormProps {
  onClose: () => void;
  editFormConfig?: EditFormConfig;
}

interface EditFormConfig {
  isEditMode: boolean;
  truckDataToBeEdited: ITruck;
}

export const AddTruckForm = ({
  onClose,
  editFormConfig,
}: AddTruckFormProps) => {
  const { setTruckUpdateTrigger } = useContext(TrucksContext) as TrucksContext;
  const { resetSelection } = useSelection<ITruck>();
  const { showToast } = useToast();
  const { isEditMode = false, truckDataToBeEdited } = editFormConfig || {};

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [truckData, setTruckData] = useState<ITruck>(
    isEditMode
      ? (truckDataToBeEdited as ITruck)
      : {
          code: "",
          name: "",
          status: null,
          description: "",
        },
  );

  const [initialStatus, setInitialStatus] = useState<TruckStatusEnum | null>(
    truckData.status,
  );

  useEffect(() => {
    if (editFormConfig && editFormConfig.truckDataToBeEdited) {
      setInitialStatus(editFormConfig.truckDataToBeEdited.status);
    }
  }, [editFormConfig, truckData]);

  const mapStatusToOptionType = (status: TruckStatusEnum | ""): OptionType => ({
    label: status,
    value: status,
  });

  const nextStatus: {
    [key in TruckStatusEnum | ""]: (TruckStatusEnum | "")[];
  } = {
    "": [TruckStatusEnum.OUT_OF_SERVICE, TruckStatusEnum.LOADING],
    OUT_OF_SERVICE: TRUCK_STATUS,
    LOADING: [TruckStatusEnum.TO_JOB, TruckStatusEnum.OUT_OF_SERVICE],
    TO_JOB: [TruckStatusEnum.AT_JOB, TruckStatusEnum.OUT_OF_SERVICE],
    AT_JOB: [TruckStatusEnum.RETURNING, TruckStatusEnum.OUT_OF_SERVICE],
    RETURNING: [TruckStatusEnum.LOADING, TruckStatusEnum.OUT_OF_SERVICE],
  };

  const getTruckStatusOptions = (
    truckStatus: TruckStatusEnum | "",
    isEditMode: boolean,
  ): OptionType[] => {
    if (isEditMode && truckStatus !== TruckStatusEnum.OUT_OF_SERVICE) {
      const filteredStatuses = TRUCK_STATUS.filter((status) =>
        nextStatus[truckStatus].includes(status),
      ).map(mapStatusToOptionType);

      const currentStatusOption = mapStatusToOptionType(truckStatus);

      return [
        currentStatusOption,
        ...filteredStatuses.filter((option) => option.value !== truckStatus),
      ];
    } else {
      return TRUCK_STATUS.map(mapStatusToOptionType);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ): void => {
    setTruckData({
      ...truckData,
      [event.target.name]: event.target.value,
    });
  };

  const isDisabled = (truck: ITruck) => {
    return Boolean(!truck.code || !truck.name || !truck.status);
  };

  const showToastMessage = (
    isSuccess: boolean,
    truckData: ITruck,
    error: unknown | null = null,
  ): void => {
    const text = isSuccess
      ? `${isEditMode ? "Saved" : "Added"} truck with \n ID: ${truckData.id}, \n Name: ${truckData.name}, \n Status: ${truckData.status}`
      : `Truck could not be ${isEditMode ? "saved" : "added"}.\n ${error instanceof Error ? error.message : ""}`;

    showToast({
      header: isSuccess ? "Success!" : "Something went wrong...",
      text,
      type: isSuccess ? ToastTypeEnum.SUCCESS : ToastTypeEnum.ERROR,
    });
  };

  const manageTruck = async (
    isEditMode: boolean,
    truckData: ITruck,
  ): Promise<ITruck> => {
    let response;
    if (isEditMode) {
      response = await putTruck(
        truckData.id as number,
        JSON.stringify(truckData),
      );
    } else {
      response = await postTruck(JSON.stringify(truckData));
    }
    setTruckUpdateTrigger({
      isTriggered: true,
      action: isEditMode ? TruckFormActionEnum.EDIT : TruckFormActionEnum.ADD,
    });
    return Array.isArray(response) ? response[0] : response;
  };

  const handleSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const result: ITruck = await manageTruck(isEditMode, truckData);
      showToastMessage(true, result);
      resetSelection();
      onClose();
    } catch (error: unknown) {
      showToastMessage(false, truckData, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner position="fixed" />}
      <form onSubmit={handleSubmit}>
        <Input
          label="Code:"
          type="text"
          name="code"
          value={truckData.code}
          onChange={handleChange}
          mask={MaskEnum.Alphanumeric}
          required
          disabled={isLoading}
        />
        <Input
          label="Name:"
          type="text"
          name="name"
          value={truckData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <Select
          label="Status:"
          options={getTruckStatusOptions(
            initialStatus !== null ? initialStatus : "",
            isEditMode,
          )}
          name="status"
          value={truckData.status as string}
          onChange={(e) =>
            setTruckData({
              ...truckData,
              status: e.target.value as TruckStatusEnum,
            })
          }
          required
          disabled={isLoading}
        />
        <Input
          label="Description:"
          type="text"
          name="description"
          value={truckData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
        <ButtonContainer>
          <Button
            type="submit"
            text={isEditMode ? "Save truck" : "Add truck"}
            disabled={isDisabled(truckData) || isLoading}
          />
        </ButtonContainer>
      </form>
    </>
  );
};
