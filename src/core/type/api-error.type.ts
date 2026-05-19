// types/api-error.type.ts
export interface BackendErrorResponse {
  code: number;
  message: string; // เราอยากได้อันนี้: "Account already exists"
  error: string;
}
