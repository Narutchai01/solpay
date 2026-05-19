export interface BaseModel<T> {
  code: number;
  message: string;
  data: T;
  error?: string;
}
