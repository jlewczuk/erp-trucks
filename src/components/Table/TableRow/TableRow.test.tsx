import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentType } from "react";
import { TableRow } from "./TableRow";
import { ITruck } from "../../../interfaces";
import "@testing-library/jest-dom";
import { TruckStatusEnum } from "../../../interfaces/ITruck";
import { TABLE_COLUMN_WIDTHS } from "../../../constants";

const mockHandleDeleteTrucks = jest.fn();
const mockResetSelection = jest.fn();

jest.mock("../../../hooks", () => ({
  useHandleDeleteTrucks: () => ({ handleDeleteTrucks: mockHandleDeleteTrucks }),
  useSelection: () => ({
    selectedItems: [],
    resetSelection: mockResetSelection,
  }),
}));

jest.mock("../../../hoc", () => ({
  withPopup: (WrappedComponent: ComponentType<any>) => (props: any) => (
    <WrappedComponent {...props} />
  ),
}));

jest.mock("../../ActionIcon", () => ({
  ActionIcon: jest.fn(({ onClick, title }) => (
    <button onClick={onClick} title={title}>
      Action Icon
    </button>
  )),
}));

describe("<TableRow />", () => {
  const rowData: ITruck = {
    id: 1,
    code: "First Code",
    name: "Fist Name",
    status: TruckStatusEnum.LOADING,
    description: "First description",
  };

  const headers = ["id", "code", "name", "status", "description"];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <TableRow
        rowData={rowData}
        isSelected={false}
        headers={headers}
        columnWidths={TABLE_COLUMN_WIDTHS}
      />,
    );

    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("First Code")).toBeInTheDocument();
    expect(getByText("Fist Name")).toBeInTheDocument();
    expect(getByText(TruckStatusEnum.LOADING)).toBeInTheDocument();
    expect(getByText("First description")).toBeInTheDocument();
  });

  it("triggers edit action on click edit icon (FaEdit)", async () => {
    const { findByTitle } = render(
      <TableRow
        rowData={rowData}
        isSelected={false}
        headers={headers}
        columnWidths={TABLE_COLUMN_WIDTHS}
      />,
    );
    const editButton = await findByTitle("Edit Truck");
    await userEvent.click(editButton);
    expect(mockResetSelection).toBeCalled();
  });

  it("triggers delete truck on click delete icon (FaTrash)", async () => {
    const { findByTitle } = render(
      <TableRow
        rowData={rowData}
        isSelected={false}
        headers={headers}
        columnWidths={TABLE_COLUMN_WIDTHS}
      />,
    );

    const deleteButton = await findByTitle("Delete Truck");
    await userEvent.click(deleteButton);
    expect(mockHandleDeleteTrucks).toBeCalled();
  });
});
