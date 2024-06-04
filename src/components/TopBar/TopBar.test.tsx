import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentType } from "react";
import { TopBar } from "./TopBar";
import * as hooks from "../../hooks";

jest.mock("../../hooks", () => ({
  useTrucksContext: jest
    .fn()
    .mockReturnValue({ trucks: [], setTrucks: jest.fn() }),
  useSelection: jest
    .fn()
    .mockReturnValue({ selectedItems: [], resetSelection: jest.fn() }),
  useHandleDeleteTrucks: jest
    .fn()
    .mockReturnValue({ handleDeleteTrucks: jest.fn() }),
  useHandleRoute: jest.fn(),
}));

jest.mock("../../hoc", () => ({
  withPopup: (WrappedComponent: ComponentType<any>) => (props: any) => (
    <WrappedComponent {...props} />
  ),
}));

describe("TopBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<TopBar />);
    screen.getByText("Add Truck");
  });

  it("calls handleDeleteTrucks when delete button is clicked", async () => {
    const handleDeleteTrucksMock = jest.fn();
    (hooks.useHandleDeleteTrucks as jest.Mock).mockReturnValue({
      handleDeleteTrucks: handleDeleteTrucksMock,
    });

    render(<TopBar />);

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(handleDeleteTrucksMock).toHaveBeenCalled();
  });
});
