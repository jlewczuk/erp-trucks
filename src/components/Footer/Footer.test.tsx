import { render } from "@testing-library/react";
import { Footer } from "./Footer";
import { getCurrentYear } from "../../helpers";
import "@testing-library/jest-dom";

jest.mock("../../helpers", () => ({
  getCurrentYear: jest.fn(),
}));

describe("Footer", () => {
  it("displays the correct year and site name", () => {
    const mockYear = 2024;

    (getCurrentYear as jest.Mock).mockReturnValueOnce(mockYear);

    const { getByText } = render(<Footer />);

    expect(
      getByText(`© ${mockYear} FleetMove Solutions. All rights reserved.`),
    ).toBeInTheDocument();
  });
});
