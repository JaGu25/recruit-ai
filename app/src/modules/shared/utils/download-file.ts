import { api } from "@/app/config/api";

const extractFilename = (contentDisposition?: string): string | undefined => {
  if (!contentDisposition) return undefined;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return asciiMatch?.[1];
};

export const fetchFileWithAuth = async (url: string) => {
  const response = await api.get<Blob>(url, { responseType: "blob" });
  const disposition = response.headers["content-disposition"] as string | undefined;
  const type = response.headers["content-type"] as string | undefined;
  const filename = extractFilename(disposition);
  const contentType = type ?? "application/octet-stream";
  return {
    blob: response.data,
    filename,
    contentType,
  };
};

export const downloadFileWithAuth = async (url: string, suggestedName?: string) => {
  const { blob, filename } = await fetchFileWithAuth(url);
  const resolvedName = suggestedName || filename || "download";

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = resolvedName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
