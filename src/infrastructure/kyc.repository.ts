import { HttpHelper } from "@/lib/http";
import { Platform } from "react-native";
import { BaseModel } from "../domain/model";
import { ConfirmKYCRequest, ConfirmKYCResponse } from "../domain/model/kyc";

export interface IKYCRepository {
  ConfirmKYC(
    data: ConfirmKYCRequest,
    token: string,
  ): Promise<ConfirmKYCResponse>;
}

export class KYCRepositoryImpl implements IKYCRepository {
  constructor(private readonly httpHelper: HttpHelper) {}

  /**
   * Normalises a camera URI for React Native's native fetch bridge.
   *
   * On Android physical devices the camera can return a bare path
   * (/data/user/0/…) that the XHR layer can't resolve. We ensure every
   * file is prefixed with the correct scheme.
   */
  private prepareFile(file: { uri: string; name: string; type: string }): {
    uri: string;
    name: string;
    type: string;
  } {
    let { uri } = file;

    if (Platform.OS === "android") {
      if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
        uri = `file://${uri}`;
      }
    }

    return {
      uri,
      name: file.name || `upload_${Date.now()}.jpg`,
      type: file.type || "image/jpeg",
    };
  }

  async ConfirmKYC(
    data: ConfirmKYCRequest,
    token: string,
  ): Promise<ConfirmKYCResponse> {
    const formData = new FormData();

    // ── Text fields ────────────────────────────────────────────────────────────
    formData.append("id_card", data.id_card);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("birth_date", data.birth_date);
    formData.append("expire_date", data.expire_date);

    // ── Image fields ───────────────────────────────────────────────────────────
    // React Native expects a plain object { uri, name, type } – NOT a Blob.
    if (data.front_card_image?.uri) {
      formData.append(
        "front_card_image",
        this.prepareFile(data.front_card_image) as any,
      );
    }

    if (data.back_card_image?.uri) {
      formData.append(
        "back_card_image",
        this.prepareFile(data.back_card_image) as any,
      );
    }

    if (data.face_image?.uri) {
      formData.append("face_image", this.prepareFile(data.face_image) as any);
    }

    // ── Upload via native fetch ────────────────────────────────────────────────
    //
    // Axios uses an XHR polyfill that cannot reliably stream binary FormData
    // payloads on physical Android devices, causing an HTTP 0 (network error)
    // before the request ever reaches the server.
    //
    // React Native's built-in `fetch` talks directly to Android's OkHttp
    // networking layer, which handles multipart uploads correctly. We use it
    // here as a targeted bypass – all other API calls still go through Axios.
    //
    // IMPORTANT: Do NOT set Content-Type manually. The native layer generates
    // the correct "multipart/form-data; boundary=…" header automatically.
    const url = `${this.httpHelper.baseUrl}/api/v1/users`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const json: BaseModel<ConfirmKYCResponse> = await response.json();

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${json?.error ?? JSON.stringify(json)}`,
      );
    }

    return json.data;
  }
}
