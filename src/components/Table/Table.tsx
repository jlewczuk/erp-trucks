import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { useSelection, useTrucksContext } from "../../hooks";
import { ITruck } from "../../interfaces";
import { Pagination } from "./Pagination";
import { Spinner } from "../Spinner";
import {
  getInitialTrucks,
  getTrucks,
} from "../../helpers/apiRequests/apiRequests";

const StyledTableWrapper = styled.div`
  border: var(--border);
  box-shadow: var(--box-shadow-primary);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const StyledTable = styled.table`
  table-layout: fixed;
  min-width: 60vw;
  border-collapse: collapse;
  width: 100%;
`;

const StyledTableBody = styled.tbody`
  position: relative;
`;

const NoTrucksMessage = styled.p`
  color: var(--text-color);
  font-size: var(--font-size-md);
  margin-top: 20px;
  padding: 10px;
  border: var(--border);
  border-radius: 5px;
  background-color: var(--background-color-secondary);
  box-shadow: var(--box-shadow-primary);
`;

interface TableProps {
  itemsPerPage: number;
  columnWidths: string[];
}

export enum OrderEnum {
  ASC = "asc",
  DESC = "desc",
}

export const Table = ({ itemsPerPage, columnWidths }: TableProps) => {
  const { selectedItems } = useSelection();
  const {
    trucks,
    setTrucks,
    truckUpdateTrigger,
    setTruckUpdateTrigger,
    sortField,
    sortOrder,
    setTotalPages,
  } = useTrucksContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(true);

  const headers = ["id", "code", "name", "status", "description"];

  useEffect(() => {
    getInitialTrucks(itemsPerPage).then((trucks) => {
      setTrucks(trucks.slice(0, itemsPerPage));
      setTotalPages(Math.ceil(trucks.length / itemsPerPage));
      isInitialRender.current = false;
    });
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      setIsLoading(true);
      getTrucks({
        page: String(currentPage),
        limit: String(itemsPerPage),
        sort: sortField as string,
        order: sortOrder as OrderEnum,
      }).then((newTrucks: ITruck[]) => {
        setTrucks(newTrucks);
        !truckUpdateTrigger.isTriggered && setIsLoading(false);
        setTruckUpdateTrigger({ isTriggered: false });
      });
    }
  }, [currentPage, truckUpdateTrigger.isTriggered, sortField, sortOrder]);

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isInitialRender.current && <Spinner position="fixed" />}
      {trucks && trucks.length === 0 ? (
        <NoTrucksMessage>No trucks have been added yet.</NoTrucksMessage>
      ) : (
        <StyledTableWrapper>
          {isLoading && <Spinner position="absolute" />}
          {trucks && trucks.length && (
            <>
              <StyledTable>
                <TableHeader
                  headers={headers}
                  columnWidths={columnWidths}
                  rows={trucks}
                />
                <StyledTableBody>
                  {trucks!.map((row: ITruck, index: number) => (
                    <TableRow
                      key={`row-${index}`}
                      headers={headers}
                      rowData={row}
                      isSelected={(selectedItems || []).includes(
                        String(row.id),
                      )}
                      columnWidths={columnWidths}
                    />
                  ))}
                  {trucks!.length < itemsPerPage &&
                    Array.from({ length: itemsPerPage - trucks!.length }).map(
                      (_, index) => (
                        <TableRow
                          key={`empty-row-${index}`}
                          headers={headers}
                          isSelected={false}
                          columnWidths={columnWidths}
                        />
                      ),
                    )}
                </StyledTableBody>
              </StyledTable>
              <Pagination
                itemsPerPage={itemsPerPage}
                currPage={currentPage}
                paginate={handlePageChange}
              />
            </>
          )}
        </StyledTableWrapper>
      )}
    </>
  );
};
