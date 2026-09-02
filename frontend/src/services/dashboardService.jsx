import api from "./api";

export async function getDashboardSummary(accessToken) {
  const response = await api.get("/dashboard/summary", { headers: { Authorization: `Bearer ${accessToken}` } });
  return response.data;
}