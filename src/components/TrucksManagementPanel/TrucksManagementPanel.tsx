import styled from "styled-components";
import { Table } from "../Table";
import { TABLE_COLUMN_WIDTHS } from "../../constants.ts";

const ManagementPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TrucksManagementPanel = () => {
  return (
    <>
      <ManagementPanel>
        <Table itemsPerPage={10} columnWidths={TABLE_COLUMN_WIDTHS} />
      </ManagementPanel>
    </>
  );
};
