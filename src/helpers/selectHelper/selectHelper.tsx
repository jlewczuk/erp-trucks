import { OptionType } from "../../components";
import { ITruck } from "../../interfaces";

export const generateSelectOptions = (
  data: ITruck[],
  valueField: keyof ITruck,
  labelGetter: (item: ITruck) => string,
): OptionType[] => {
  return data.map((item: ITruck): OptionType => {
    return { value: item[valueField]!.toString(), label: labelGetter(item) };
  });
};
