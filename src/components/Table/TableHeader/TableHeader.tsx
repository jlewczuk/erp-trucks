import { ThHTMLAttributes } from "react";
import styled from "styled-components";
import { Checkbox } from "../../Checkbox";
import { ITruck } from "../../../interfaces";
import { useTrucksContext } from "../../../hooks";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { OrderEnum } from "../Table";

const StyledHeader = styled.th<StyledHeaderProps>`
  width: ${(props) => props.width};
  background-color: var(--app-color-primary);
  padding: 10px;
  text-align: center;
`;

const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: var(--color-white);
`;

const StyledSortIcon = styled.span`
  display: flex;
  align-items: center;
  margin-left: 5px;

  svg {
    font-size: 0.8em;
    fill: var(--color-white);
  }
`;

interface StyledHeaderProps
  extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  width?: string;
}

interface TableHeaderProps<T> {
  headers: string[];
  columnWidths: string[];
  rows: T[];
  width?: string;
}

export const TableHeader = <T,>({
  headers,
  columnWidths,
}: TableHeaderProps<T>) => {
  const { trucks, sortField, setSortField, sortOrder, setSortOrder } =
    useTrucksContext();

  const handleOnClick = (header: string) => {
    setSortField(header);
    setSortOrder((prevOrder) =>
      prevOrder === OrderEnum.ASC ? OrderEnum.DESC : OrderEnum.ASC,
    );
  };

  return (
    <thead>
      <tr>
        <StyledHeader width={columnWidths[0]}>
          <Checkbox id="selectAllTrucks" allData={trucks as ITruck[]} />
        </StyledHeader>
        {headers.map((header: string, index: number) => (
          <StyledHeader key={`header-${index}`} width={columnWidths[index + 1]}>
            <StyledHeaderContent>
              {header}
              <StyledSortIcon onClick={() => handleOnClick(header)}>
                {sortField === header && sortOrder === OrderEnum.ASC && (
                  <FaSortUp />
                )}
                {sortField === header && sortOrder === OrderEnum.DESC && (
                  <FaSortDown />
                )}
                {sortField !== header && <FaSort />}
              </StyledSortIcon>
            </StyledHeaderContent>
          </StyledHeader>
        ))}
        <StyledHeader width={columnWidths[columnWidths.length - 1]} />
      </tr>
    </thead>
  );
};
