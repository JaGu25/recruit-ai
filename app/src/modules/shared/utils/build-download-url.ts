import { API_BASE_URL } from "@/app/config/api";

export const buildDownloadUrl = (downloadUrl?: string): string | undefined => {
  if (!downloadUrl) return undefined;
  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return downloadUrl;
  }

  const base = API_BASE_URL.replace(/\/$/, "");
  const relativePath = downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`;
  return `${base}${relativePath}`;
};
