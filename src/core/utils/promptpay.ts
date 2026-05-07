export type PromptPayType = "PHONE" | "NATID" | "EWALLET" | "BILLER" | "UNKNOWN";

export interface PromptPayInfo {
  id: string;
  type: PromptPayType;
}

/**
 * Parses EMVCo TLV (Tag-Length-Value) format.
 */
export const parseTLV = (data: string): Record<string, string> => {
  const result: Record<string, string> = {};
  let i = 0;
  while (i < data.length) {
    if (i + 4 > data.length) break;
    const tag = data.substring(i, i + 2);
    const lengthStr = data.substring(i + 2, i + 4);
    const length = parseInt(lengthStr, 10);
    if (isNaN(length)) break;
    const value = data.substring(i + 4, i + 4 + length);
    result[tag] = value;
    i += 4 + length;
  }
  return result;
};

/**
 * Extracts PromptPay Identifier from raw EMVCo string.
 */
export const extractPromptPayID = (rawData: string): PromptPayInfo | null => {
  if (!rawData) return null;

  // Check if it's already a clean ID (10 or 13 digits)
  if (/^\d{10}$/.test(rawData)) return { id: rawData, type: "PHONE" };
  if (/^\d{13}$/.test(rawData)) return { id: rawData, type: "NATID" };

  try {
    const tags = parseTLV(rawData);

    // Tag 29: Merchant Account Information (Individual PromptPay)
    // Tag 30: Merchant Account Information (Biller/Corporate PromptPay)
    const tag29 = tags["29"];
    const tag30 = tags["30"];

    if (tag29) {
      const subTags = parseTLV(tag29);
      // AID for PromptPay is usually A000000677010111
      if (subTags["00"]?.includes("A000000677010111")) {
        if (subTags["01"]) {
          let phone = subTags["01"];
          // Format 0066XXXXXXXXX to 0XXXXXXXXX
          if (phone.startsWith("0066")) {
            phone = "0" + phone.substring(4);
          }
          return { id: phone, type: "PHONE" };
        }
        if (subTags["02"]) {
          return { id: subTags["02"], type: "NATID" };
        }
        if (subTags["03"]) {
          return { id: subTags["03"], type: "EWALLET" };
        }
      }
    }

    if (tag30) {
      const subTags = parseTLV(tag30);
      if (subTags["01"]) {
        return { id: subTags["01"], type: "BILLER" };
      }
    }
  } catch (e) {
    console.error("Error parsing PromptPay QR:", e);
  }

  // Final fallback: try to find any 10 or 13 digit string if EMVCo parsing fails
  const phoneMatch = rawData.match(/0\d{9}/);
  if (phoneMatch) return { id: phoneMatch[0], type: "PHONE" };

  const idMatch = rawData.match(/\d{13}/);
  if (idMatch) return { id: idMatch[0], type: "NATID" };

  return null;
};

/**
 * Formats the ID for display (adds hyphens).
 */
export const formatPromptPayID = (id: string, type?: PromptPayType): string => {
  if (!id) return "";
  const cleanId = id.replace(/\D/g, "");

  if (type === "PHONE" || (cleanId.length === 10 && cleanId.startsWith("0"))) {
    return cleanId.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  if (type === "NATID" || cleanId.length === 13) {
    return cleanId.replace(
      /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
      "$1-$2-$3-$4-$5"
    );
  }

  return id;
};

/**
 * Masks the ID for privacy.
 */
export const maskPromptPayID = (id: string, type?: PromptPayType): string => {
  if (!id) return "";
  const formatted = formatPromptPayID(id, type);

  if (type === "PHONE" || id.length === 10) {
    const parts = formatted.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-xxx-${parts[2]}`;
    }
  }

  if (type === "NATID" || id.length === 13) {
    // Mask middle parts: x-xxxx-xxxxx-xx-x -> x-xxxx-xxxx-xx-x
    const parts = formatted.split("-");
    if (parts.length === 5) {
      return `${parts[0]}-xxxx-xxxxx-${parts[3]}-${parts[4]}`;
    }
  }

  return formatted;
};
