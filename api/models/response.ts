export interface CustomResponse<T> {
  status: boolean;
  message: string | any;
  data: T | null;
  error: any | null;
}
