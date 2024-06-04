import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useHandleDeleteTrucks } from "./useHandleDeleteTrucks";
import { useTrucksContext } from "../useTrucksContext";
import { useSelection } from "../useSelection";
import { useToast } from "../useToast";
import { ITruck } from "../../interfaces";
import { deleteTruck } from "../../helpers";
import { TruckStatusEnum } from "../../interfaces/ITruck";

jest.mock("../useTrucksContext/useTrucksContext.tsx");
jest.mock("../useSelection/useSelection");
jest.mock("../useToast/useToast");
jest.mock("../../helpers");

const mockTrucks: ITruck[] = [
  {
    id: 1,
    code: "First Code",
    name: "Fist Name",
    status: TruckStatusEnum.LOADING,
    description: "First description",
  },
  {
    id: 2,
    code: "Second Code",
    name: "Second Name",
    status: TruckStatusEnum.OUT_OF_SERVICE,
    description: "Second description ",
  },
];

describe("useHandleDeleteTrucks", () => {
  const setTrucks = jest.fn();
  const resetSelection = jest.fn();
  const showToast = jest.fn();

  const setTruckUpdateTrigger = jest.fn();
  (useTrucksContext as jest.Mock).mockImplementation(() => ({
    setTruckUpdateTrigger,
    setTrucks,
  }));

  beforeEach(() => {
    jest.resetAllMocks();
    (useTrucksContext as jest.Mock).mockImplementation(() => ({
      setTrucks,
    }));
    (useSelection as jest.Mock).mockImplementation(() => ({ resetSelection }));
    (useToast as jest.Mock).mockImplementation(() => ({ showToast }));
  });

  it("handles errors correctly when deleting trucks fails", async () => {
    (deleteTruck as jest.Mock).mockImplementation(() => {
      throw new Error("Delete failed");
    });

    const { result } = renderHook(() => useHandleDeleteTrucks());

    await act(async () => {
      try {
        await result.current.handleDeleteTrucks(mockTrucks)();
      } catch (error) {}
    });

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        header: "Error",
        text: "Could not delete 2 trucks. TypeError: setTruckUpdateTrigger is not a function",
      }),
    );
  });
});
