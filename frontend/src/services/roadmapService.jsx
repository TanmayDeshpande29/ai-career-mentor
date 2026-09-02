import api from "./api";

const auth = (accessToken) => ({ headers: { Authorization: `Bearer ${accessToken}` } });
export async function getRoadmap(accessToken) { return (await api.get("/roadmap/me", auth(accessToken))).data; }
export async function saveRoadmap(data, accessToken) { return (await api.post("/roadmap", data, auth(accessToken))).data; }
export async function updateRoadmap(data, accessToken) { return (await api.put("/roadmap/me", data, auth(accessToken))).data; }
export async function deleteRoadmap(accessToken) { await api.delete("/roadmap/me", auth(accessToken)); }