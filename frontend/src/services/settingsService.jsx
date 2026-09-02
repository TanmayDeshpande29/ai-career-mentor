import api from "./api";

const auth = (accessToken) => ({ headers: { Authorization: `Bearer ${accessToken}` } });
export async function updateAccount(data, accessToken) { return (await api.put("/settings/profile", data, auth(accessToken))).data; }
export async function changePassword(data, accessToken) { return (await api.put("/settings/password", data, auth(accessToken))).data; }
export async function getPreferences(accessToken) { return (await api.get("/settings/preferences", auth(accessToken))).data; }
export async function updatePreferences(data, accessToken) { return (await api.put("/settings/preferences", data, auth(accessToken))).data; }