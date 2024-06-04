import { Spinner } from "./Spinner";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Spinner component", () => {
  test("it renders", () => {
    render(<Spinner />);
    expect(screen.getByTestId("spinner-overlay")).toBeInTheDocument();
  });

  test("it applies the right position", () => {
    render(<Spinner position="absolute" />);
    const spinnerOverlay = screen.getByTestId("spinner-overlay");
    expect(spinnerOverlay).toHaveStyle("position: absolute");
  });

  test("it matches snapshot", () => {
    const { asFragment } = render(<Spinner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
