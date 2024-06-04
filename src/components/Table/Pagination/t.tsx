import { act, fireEvent, render } from "@testing-library/react";
import { Pagination } from "./Pagination";
import { TrucksProvider } from "../../../contexts";

jest.mock("../../../contexts", () => ({
  useTrucksContext: () => mockUseTrucksContext,
}));
const mockUseTrucksContext = jest.fn();
const paginateMock = jest.fn();
describe("Pagination Tests", () => {
  it("Renders without crashing", async () => {
    const { findByTestId } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={1} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const paginationComponent = await findByTestId("pagination-component");
    expect(paginationComponent).toBeTruthy();
  });
  it("Switches to the next page when next button is pressed", async () => {
    const { findByText } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={1} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const nextButton = await findByText(">");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(paginateMock).toBeCalledWith(2);
  });
  it("Does not switch to the next page when it is the last page", async () => {
    const { findByText } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={10} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const nextButton = await findByText(">");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(paginateMock).not.toBeCalledWith(11);
  });
  it("Switches to the previous page when previous button is pressed", async () => {
    const { findByText } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={2} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const prevButton = await findByText("<");
    await act(async () => {
      fireEvent.click(prevButton);
    });
    expect(paginateMock).toBeCalledWith(1);
  });
  it("Does not switch to the previous page when it is the first page", async () => {
    const { findByText } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={1} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const prevButton = await findByText("<");
    await act(async () => {
      fireEvent.click(prevButton);
    });
    expect(paginateMock).not.toBeCalledWith(0);
  });
  it("Clicking on page number changes the page", async () => {
    const { findByText } = render(
      <TrucksProvider>
        <Pagination itemsPerPage={5} currPage={4} paginate={paginateMock} />
      </TrucksProvider>,
    );
    const button5 = await findByText("5");
    await act(async () => {
      fireEvent.click(button5);
    });
    expect(paginateMock).toBeCalledWith(5);
  });
});
