import { render } from "@testing-library/react";
import { TableHeader } from "./TableHeader";
import "@testing-library/jest-dom";
import { ITruck, TruckStatusEnum } from "../../../interfaces/ITruck";
import { TABLE_COLUMN_WIDTHS } from "../../../constants";
import { useTrucksContext } from "../../../hooks";
import { ComponentType } from "react";

jest.mock("../../../hooks", () => ({
  useTrucksContext: jest.fn(),
}));

jest.mock("../../Checkbox", () => ({
  Checkbox: jest.fn(({ id }) => <input type="checkbox" id={id} />),
}));

jest.mock("../../../hoc", () => ({
  withPopup: (WrappedComponent: ComponentType<any>) => (props: any) => (
    <WrappedComponent {...props} />
  ),
}));

describe("<TableHeader />", () => {
  const headers = ["id", "code", "name", "status", "description"];
  const columnWidths = TABLE_COLUMN_WIDTHS;
  const mockAccounts: ITruck[] = [
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

  beforeEach(() => {
    (useTrucksContext as jest.Mock).mockReturnValue({
      accounts: mockAccounts,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the headers correctly", () => {
    const { getByText } = render(
      <table>
        <TableHeader
          headers={headers}
          columnWidths={columnWidths}
          rows={mockAccounts}
        />
      </table>,
    );

    headers.forEach((header) => {
      expect(getByText(header)).toBeInTheDocument();
    });
  });

  it("renders the select all accounts checkbox", () => {
    const { getByRole } = render(
      <table>
        <TableHeader
          headers={headers}
          columnWidths={columnWidths}
          rows={mockAccounts}
        />
      </table>,
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("id", "selectAllTrucks");
  });

  it("applies the correct column widths", () => {
    const { container } = render(
      <div style={{ width: "500px" }}>
        <table>
          <TableHeader
            headers={headers}
            columnWidths={columnWidths}
            rows={mockAccounts}
          />
        </table>
      </div>,
    );

    const thElements = container.querySelectorAll("th");
    expect(thElements).toHaveLength(headers.length + 2);

    thElements.forEach((th, index) => {
      const computedStyle = window.getComputedStyle(th);
      if (index === 0) {
        expect(computedStyle.width).toBe(columnWidths[0]);
      } else if (index <= headers.length) {
        expect(computedStyle.width).toBe(columnWidths[index]);
      }
    });
  });
});
