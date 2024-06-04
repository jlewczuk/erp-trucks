import { fireEvent, render, screen } from "@testing-library/react";
import { AddTruckForm } from "./AddTruckForm";
import { TrucksContext } from "../../contexts";
import { useSelection, useToast } from "../../hooks";
import "@testing-library/jest-dom";
import { OrderEnum } from "../Table/Table";
import { ComponentType } from "react";

jest.mock("../../hooks");

jest.mock("../../hoc", () => ({
  withPopup: (WrappedComponent: ComponentType<any>) => (props: any) => (
    <WrappedComponent {...props} />
  ),
}));

describe("AddTruckForm", () => {
  const mockSetTruckUpdateTrigger = jest.fn();
  const mockResetSelection = jest.fn();
  const mockShowToast = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useSelection as jest.Mock).mockReturnValue({
      resetSelection: mockResetSelection,
    });
    (useToast as jest.Mock).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  const renderComponent = (editFormConfig?: any) =>
    render(
      <TrucksContext.Provider
        value={{
          trucks: [],
          setTrucks: () => {},
          truckUpdateTrigger: { isTriggered: false },
          setTruckUpdateTrigger: mockSetTruckUpdateTrigger,
          sortField: null,
          setSortField: () => {},
          sortOrder: OrderEnum.ASC,
          setSortOrder: () => {},
          totalPages: 0,
          setTotalPages: () => {},
        }}
      >
        <AddTruckForm onClose={mockClose} editFormConfig={editFormConfig} />
      </TrucksContext.Provider>,
    );

  test("renders form fields correctly", () => {
    renderComponent();
    const codeInput = screen.getByLabelText("Code:");
    const nameInput = screen.getByLabelText("Name:");
    const statusSelect = screen.getByLabelText("Status:");
    const descInput = screen.getByLabelText("Description:");

    expect(codeInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
  });

  test("change event correctly updates input values", () => {
    renderComponent();
    const codeInput = screen.getByLabelText("Code:");

    expect(codeInput).toHaveValue("");

    fireEvent.change(codeInput, { target: { value: "123" } });

    expect(codeInput).toHaveValue("123");
  });
});
