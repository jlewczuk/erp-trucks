export enum TruckStatusEnum {
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
  LOADING = "LOADING",
  TO_JOB = "TO_JOB",
  AT_JOB = "AT_JOB",
  RETURNING = "RETURNING",
}

export interface ITruck {
  id?: number;
  code: string;
  name: string;
  status: TruckStatusEnum | null;
  description?: string;
}
