import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import { withPopup } from "../../../hoc";
import { useHandleDeleteTrucks, useSelection } from "../../../hooks";
import { ActionIcon } from "../../ActionIcon";
import { Checkbox } from "../../Checkbox";
import { TableCell } from "../TableCell";
import { AddTruckForm } from "../../AddTruckForm";
import { ITruck } from "../../../interfaces";

interface StyledRowProps {
  rowData?: ITruck;
  headers: string[];
  isSelected: boolean;
  columnWidths: string[];
}

const StyledRow = styled.tr<StyledRowProps>`
  background-color: ${(props): string =>
    props.isSelected
      ? "var(--table-row-color-selected)"
      : "var(--color-white)"};

  &:nth-child(even) {
    background-color: ${(props): string =>
      props.isSelected
        ? "var(--table-row-color-selected)"
        : "var(--table-row-color-even-child)"};
  }
`;

const EmptyRow = styled.tr`
  height: 44px;
`;

const StyledTrashIcon = styled(FaTrash)`
  fill: var(--color-warning);

  &:hover {
    fill: var(--color-warning-hover);
  }
`;

const StyledEditIcon = styled(FaEdit)`
  fill: var(--app-color-primary);

  &:hover {
    fill: var(--app-color-primary-hover);
  }
`;

const EditTruckIcon = withPopup(ActionIcon, AddTruckForm);

export const TableRow = ({
  rowData,
  headers,
  isSelected,
  columnWidths,
}: StyledRowProps) => {
  const { handleDeleteTrucks } = useHandleDeleteTrucks();
  const { resetSelection } = useSelection();

  const isEmptyRow = rowData === undefined || Object.keys(rowData).length === 0;

  useEffect(() => {
    return () => {
      resetSelection();
    };
  }, [resetSelection]);

  return (
    <>
      {isEmptyRow ? (
        <EmptyRow />
      ) : (
        <StyledRow
          headers={headers}
          rowData={rowData}
          isSelected={isSelected}
          columnWidths={columnWidths}
        >
          <TableCell>
            <Checkbox
              id={String("id" in rowData && rowData.id)}
              rowData={rowData}
            ></Checkbox>
          </TableCell>
          {headers.map((header: string) => (
            <TableCell
              key={String(header)}
              title={String(rowData[header as keyof ITruck])}
            >
              {String(rowData[header as keyof ITruck])}
            </TableCell>
          ))}
          <TableCell>
            <EditTruckIcon
              icon={StyledEditIcon}
              title="Edit Truck"
              editFormConfig={{
                isEditMode: true,
                truckDataToBeEdited: rowData,
              }}
            />
            <ActionIcon
              icon={StyledTrashIcon}
              title="Delete Truck"
              onClick={handleDeleteTrucks([rowData])}
            />
          </TableCell>
        </StyledRow>
      )}
    </>
  );
};
