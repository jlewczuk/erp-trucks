import styled from "styled-components";
import { Button } from "../../Button";
import { useTrucksContext } from "../../../hooks";
import { useEffect, useState } from "react";
import { TruckFormActionEnum } from "../../../enums";

const PaginationNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
`;

const PaginationUl = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
`;

const PaginationLi = styled.li`
  margin: 0 0.5em;
`;

const PaginationButton = styled(Button)<{ isActive?: boolean }>`
  padding: 0.5em 1em;
  margin: 0;

  border: none;
  border-radius: 4px;
  cursor: pointer;

  background-color: ${({ isActive }) =>
    isActive ? "var(--app-color-primary)" : "transparent"};

  color: ${({ isActive, disabled }) =>
    disabled
      ? "var(--background-color-disabled)"
      : isActive
        ? "var(--color-white)"
        : "var(--app-color-primary)"};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? null : "var(--app-color-primary-hover)"};

    color: ${(props) =>
      props.disabled ? "var(--color-white)" : "var(--color-white)"};

    cursor: ${(props) =>
      props.disabled ? "var(--cursor-not-allowed)" : "var(--cursor-pointer)"};
  }
`;

interface PaginationProps {
  itemsPerPage: number;
  currPage: number;
  paginate: (pageNumber: number) => void;
}

export const Pagination = ({
  itemsPerPage,
  currPage,
  paginate,
}: PaginationProps) => {
  const {
    trucks,
    totalPages,
    setTotalPages,
    truckUpdateTrigger,
    setTruckUpdateTrigger,
  } = useTrucksContext();
  const [currentPage, setCurrentPage] = useState(currPage);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const isOnLastPage: boolean = currentPage === Math.max(...pageNumbers);

  useEffect(() => {
    const updatePageNumbers = () => {
      let newPageNumbers: number[] = [];
      let newTotalPages = totalPages;

      if (trucks!.length === 0) {
        setTotalPages(1);
        newPageNumbers = [1];
      } else if (
        trucks!.length === itemsPerPage &&
        truckUpdateTrigger.action === TruckFormActionEnum.ADD
      ) {
        newTotalPages = totalPages + 1;
        setTotalPages(newTotalPages);
        newPageNumbers = getTotalPagesArray(newTotalPages, currentPage);
      } else if (
        trucks!.length === 1 &&
        truckUpdateTrigger.action === TruckFormActionEnum.DELETE
      ) {
        newTotalPages = totalPages - 1;
        setTotalPages(newTotalPages);
        setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : 1);
        paginate(currentPage - 1);
      } else {
        newPageNumbers = getTotalPagesArray(totalPages as number, currentPage);
      }

      setPageNumbers(newPageNumbers);
      setTruckUpdateTrigger({ isTriggered: false });
    };

    const getTotalPagesArray = (totalPages: number, currentPage: number) => {
      const pages =
        totalPages > 1 ? [currentPage - 1, currentPage, currentPage + 1] : [1];
      return pages.filter((page) => page >= 1 && page <= totalPages);
    };

    updatePageNumbers();
  }, [
    isOnLastPage,
    truckUpdateTrigger.isTriggered,
    trucks!.length,
    totalPages,
    currentPage,
  ]);

  return (
    <PaginationNav>
      <PaginationUl>
        <PaginationLi>
          <PaginationButton
            text="<"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              paginate(currentPage - 1);
            }}
          />
        </PaginationLi>
        {pageNumbers.map((number) => (
          <PaginationLi key={number}>
            <PaginationButton
              text={String(number)}
              onClick={() => {
                setCurrentPage(number);
                paginate(number);
              }}
              isActive={number === currentPage}
            />
          </PaginationLi>
        ))}
        <PaginationLi>
          <PaginationButton
            text=">"
            disabled={currentPage >= totalPages}
            onClick={() => {
              paginate(currentPage + 1);
              setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationLi>
      </PaginationUl>
    </PaginationNav>
  );
};
