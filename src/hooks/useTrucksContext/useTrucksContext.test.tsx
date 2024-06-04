import { act, ReactNode } from "react";
import { render, renderHook } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { useTrucksContext } from "./useTrucksContext";
import { TrucksProvider } from "../../contexts";

test("returns a context value when rendered within TrucksProvider", () => {
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <TrucksProvider>{children}</TrucksProvider>
  );

  const { result } = renderHook(() => useTrucksContext(), { wrapper });

  expect(result.current.trucks).toBe(null);
  expect(typeof result.current.setTrucks).toBe("function");
});

test("throws an error when not wrapped in an TrucksProvider", () => {
  let error: Error | unknown;

  function ErrorFallback({ error }: { error: Error }) {
    return <div role="alert">{error.message}</div>;
  }

  const ErrorThrower = () => {
    useTrucksContext();
    return null;
  };

  act(() => {
    render(
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(err) => {
          error = err;
        }}
      >
        <ErrorThrower />
      </ErrorBoundary>,
    );
  });

  expect(error).toBeDefined();

  if (error instanceof Error) {
    expect(error.message).toEqual(
      "useTrucksContext must be used within an TrucksContext provider",
    );
  }
});
