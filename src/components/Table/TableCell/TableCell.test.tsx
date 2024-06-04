import { render, screen } from "@testing-library/react";
import { TableCell } from "./TableCell";
import "@testing-library/jest-dom";

describe("TableCell component", () => {
  test("renders without crashing", () => {
    render(<TableCell>Test</TableCell>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders title in overflow text", () => {
    render(<TableCell title="TitleText">Test</TableCell>);
    const cell = screen.getByText("Test");
    expect(cell).toHaveAttribute("title", "TitleText"); // use 'cell' instead of 'cell.parentElement'
  });
});
