import api from "./api";

const auth = (accessToken) => ({ headers: { Authorization: `Bearer ${accessToken}` } });

export async function getResume(accessToken) { return (await api.get("/resume/me", auth(accessToken))).data; }
export async function uploadResume(file, accessToken) {
	const formData = new FormData();
	formData.append("file", file);
	return (await api.post("/resume/upload", formData, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "multipart/form-data",
		},
	})).data;
}
export async function saveResume(data, accessToken) { return (await api.post("/resume", data, auth(accessToken))).data; }
export async function updateResume(id, data, accessToken) { return (await api.put(`/resume/${id}`, data, auth(accessToken))).data; }
export async function saveEnhancedResume(id, rawText, accessToken) { return (await api.put(`/resume/${id}/enhanced`, { raw_text: rawText }, auth(accessToken))).data; }
export async function deleteResume(id, accessToken) { await api.delete(`/resume/${id}`, auth(accessToken)); }
export async function getResumePreview(id, accessToken) { return (await api.get(`/resume/${id}/preview`, auth(accessToken))).data; }
export async function previewResumeFile(id, accessToken) { return (await api.get(`/resume/${id}/preview-file`, { ...auth(accessToken), responseType: "blob" })).data; }
export async function downloadResume(id, accessToken) {
	return (await api.get(`/resume/${id}/download`, { ...auth(accessToken), responseType: "blob" })).data;
}