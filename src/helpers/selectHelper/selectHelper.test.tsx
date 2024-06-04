import { generateSelectOptions } from "./selectHelper";
import { ITruck } from "../../interfaces";
import { OptionType } from "../../components";
import { TruckStatusEnum } from "../../interfaces/ITruck";

describe("generateSelectOptions", () => {
  it("generates correct OptionType array", () => {
    const mockData: ITruck[] = [
      {
        id: 1,
        code: "First Code",
        name: "Fist Name",
        status: TruckStatusEnum.LOADING,
        description: "First description",
      },
      {
        id: 2,
        code: "Second Code",
        name: "Second Name",
        status: TruckStatusEnum.OUT_OF_SERVICE,
        description: "Second description ",
      },
    ];

    const valueField: keyof ITruck = "status";
    const labelGetter = (item: ITruck) =>
      item.status?.toString() ?? "Default Value";

    const result: OptionType[] = generateSelectOptions(
      mockData,
      valueField,
      labelGetter,
    );

    const expectedResult = [
      { value: TruckStatusEnum.LOADING, label: TruckStatusEnum.LOADING },
      {
        value: TruckStatusEnum.OUT_OF_SERVICE,
        label: TruckStatusEnum.OUT_OF_SERVICE,
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});
