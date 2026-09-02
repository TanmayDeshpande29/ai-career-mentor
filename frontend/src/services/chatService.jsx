import api from "./api";

const auth = (accessToken) => ({ headers: { Authorization: `Bearer ${accessToken}` } });
export async function listConversations(accessToken) { return (await api.get("/chat/conversations", auth(accessToken))).data; }
export async function createConversation(title, accessToken) { return (await api.post("/chat/conversations", { title }, auth(accessToken))).data; }
export async function getConversation(id, accessToken) { return (await api.get(`/chat/conversations/${id}`, auth(accessToken))).data; }
export async function sendMessage(id, content, accessToken) { return (await api.post(`/chat/conversations/${id}/messages`, { content }, auth(accessToken))).data; }
export async function deleteConversation(id, accessToken) { await api.delete(`/chat/conversations/${id}`, auth(accessToken)); }