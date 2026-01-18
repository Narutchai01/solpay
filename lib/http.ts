import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export class HttpHelper {
  private readonly instance: AxiosInstance;

  constructor(
    baseUrl: string = "",
    defaultHeaders: Record<string, string> = {},
  ) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 20_000,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
      },
    });
  }

  private buildFullUrl(url: string): string {
    return `${this.instance.defaults.baseURL || ""}${url}`;
  }

  private formatErrorDetails(errorData: unknown): string {
    if (!errorData) return "";
    if (typeof errorData === "string") {
      return errorData;
    }
    return JSON.stringify(errorData);
  }

  private handleAxiosError(err: AxiosError, url: string): never {
    const status = err.response?.status || 0;
    const errorData = err.response?.data;
    const statusText = err.response?.statusText || "Unknown";
    const fullUrl = this.buildFullUrl(url);
    const details = this.formatErrorDetails(errorData);
    const detailsSuffix = details ? ` | ${details}` : "";

    throw new HttpError(
      `HTTP ${status} ${statusText} @ ${fullUrl}${detailsSuffix}`,
      status,
      errorData,
    );
  }

  private async request<Resp, Req = unknown>(
    url: string,
    options: AxiosRequestConfig<Req> = {},
  ): Promise<Resp> {
    // Handle FormData - let axios set the Content-Type automatically
    if (options.data instanceof FormData) {
      delete options.headers?.["Content-Type"];
    }

    try {
      const response: AxiosResponse<Resp> = await this.instance.request<Resp>({
        url,
        ...options,
      });

      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        this.handleAxiosError(err, url);
      }

      const fullUrl = this.buildFullUrl(url);

      if (err instanceof Error && err.name === "CanceledError") {
        throw new Error(`Request timeout @ ${fullUrl}`);
      }

      if (err instanceof Error) {
        throw new Error(`Failed to fetch ${fullUrl}: ${err.message}`);
      }

      throw new Error(`Failed to fetch ${fullUrl}: Unknown error`);
    }
  }

  get<Resp>(url: string, headers?: Record<string, string>) {
    return this.request<Resp>(url, { method: "GET", headers });
  }

  post<Resp, Req = unknown>(
    url: string,
    body?: Req,
    headers?: Record<string, string>,
  ) {
    return this.request<Resp, Req>(url, {
      method: "POST",
      data: body,
      headers,
    });
  }

  put<Resp, Req = unknown>(
    url: string,
    body?: Req,
    headers?: Record<string, string>,
  ) {
    return this.request<Resp, Req>(url, { method: "PUT", data: body, headers });
  }

  patch<Resp, Req = unknown>(
    url: string,
    body?: Req,
    headers?: Record<string, string>,
  ) {
    return this.request<Resp, Req>(url, {
      method: "PATCH",
      data: body,
      headers,
    });
  }

  delete<Resp>(url: string, headers?: Record<string, string>) {
    return this.request<Resp>(url, { method: "DELETE", headers });
  }
}

export default HttpHelper;
