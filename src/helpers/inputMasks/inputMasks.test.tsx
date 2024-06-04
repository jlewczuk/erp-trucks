import { alphanumericMask, numericMask } from "./inputMasks";

describe("Masks", () => {
  test("alphanumericMask allows alphanumeric characters", () => {
    expect(alphanumericMask("testValue123")).toBeTruthy();
    expect(alphanumericMask("test value")).toBeFalsy();
  });
  test("numericMask allows numeric characters", () => {
    expect(numericMask("123")).toBeTruthy();
    expect(numericMask("test value")).toBeFalsy();
  });
});
