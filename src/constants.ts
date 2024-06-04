import { TruckStatusEnum } from "./interfaces/ITruck";

export const BASE_URL: string =
  "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com";

export const TABLE_COLUMN_WIDTHS: string[] = [
  "4%",
  "5%",
  "15%",
  "15%",
  "15%",
  "30%",
  "6%",
];

export const TRUCK_STATUS = Object.values(TruckStatusEnum);
