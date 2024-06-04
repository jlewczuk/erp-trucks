import { ReactNode } from "react";
import styled from "styled-components";

const StyledCell = styled.td`
  padding: 10px;
  text-align: center;
  border: none;
`;

const OverflowText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface TableCellProps {
  title?: string;
  children?: ReactNode;
}

export const TableCell = ({ title, children }: TableCellProps) => {
  return (
    <StyledCell>
      <OverflowText title={title}>{children}</OverflowText>
    </StyledCell>
  );
};
