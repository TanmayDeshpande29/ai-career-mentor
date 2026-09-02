import { useEffect, useState } from "react";
import { Download, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { deleteResume, downloadResume, getResume, previewResumeFile, saveEnhancedResume, saveResume, updateResume, uploadResume } from "@/services/resumeService";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "Not available";
}

function ResumePage() {
  const { accessToken } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    getResume(accessToken).then((items) => {
      setResumes(items);
      if (items[0]) selectResume(items[0]);
    }).catch(() => setError("Unable to load your resumes.")).finally(() => setLoading(false));
  }, [accessToken]);

  function selectResume(resume) {
    setSelected(resume);
    setTitle(resume?.title || "");
    setRawText(resume?.raw_text || "");
    setMessage("");
  }

  async function preview(id) {
    setError("");
    try {
      const blob = await previewResumeFile(id, accessToken);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch { setError("PDF preview is available only for uploaded PDF files."); }
  }

  async function saveEnhanced() {
    if (!selected || !rawText.trim()) return setError("There is no enhanced resume text to save.");
    setSaving(true); setError("");
    try {
      const data = await saveEnhancedResume(selected.id, rawText.trim(), accessToken);
      setResumes((current) => current.map((item) => item.id === data.id ? data : item));
      selectResume(data);
      setMessage("Enhanced resume saved.");
    } catch { setError("Unable to save the enhanced resume."); } finally { setSaving(false); }
  }

  async function upload(event) {
    event.preventDefault();
    if (!selectedFile) return setError("Choose a PDF or DOCX file first.");
    setSaving(true); setError("");
    try {
      const resume = await uploadResume(selectedFile, accessToken);
      setResumes((current) => [resume, ...current]);
      selectResume(resume);
      setSelectedFile(null);
      event.target.reset();
      setMessage("Resume uploaded successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to upload this resume.");
    } finally { setSaving(false); }
  }

  async function saveText(event) {
    event.preventDefault();
    if (!title.trim()) return setError("A resume title is required.");
    setSaving(true); setError("");
    try {
      const data = selected
        ? await updateResume(selected.id, { title: title.trim(), raw_text: rawText || null }, accessToken)
        : await saveResume({ title: title.trim(), raw_text: rawText || null }, accessToken);
      setResumes((current) => selected ? current.map((item) => item.id === data.id ? data : item) : [data, ...current]);
      selectResume(data);
      setMessage("Resume updated successfully.");
    } catch { setError("Unable to save your resume."); } finally { setSaving(false); }
  }

  async function archiveResume(id) {
    if (!window.confirm("Hide this resume from your library? The database record will be retained.")) return;
    try {
      await deleteResume(id, accessToken);
      const remaining = resumes.filter((item) => item.id !== id);
      setResumes(remaining);
      if (selected?.id === id) selectResume(remaining[0] || null);
      setMessage("Resume hidden from your library.");
    } catch { setError("Unable to hide this resume."); }
  }

  async function download(id, fileName) {
    try {
      const blob = await downloadResume(id, accessToken);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = fileName || "resume"; link.click();
      URL.revokeObjectURL(url);
    } catch { setError("The original file is not available for download."); }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading your resumes...</div>;

  return <div className="space-y-6">
    <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="Resume" title={selected ? "Edit your resume" : "Add your resume"} description="Upload a PDF or Word document, or paste resume text for future analysis." /></CardHeader><CardContent>
      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}{message && <p className="mb-3 text-sm text-emerald-300">{message}</p>}
      <form onSubmit={upload} className="mb-6 space-y-4 rounded-2xl border border-dashed border-violet-500/30 bg-violet-500/5 p-5"><input type="file" accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} disabled={saving} className="w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-500/20 file:px-4 file:py-2 file:text-violet-200" /><Button type="submit" disabled={saving || !selectedFile}><UploadCloud className="mr-2 h-4 w-4" />{saving ? "Uploading..." : "Upload PDF or DOCX"}</Button></form>
      <form onSubmit={saveText} className="space-y-4"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resume title" className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" /><textarea value={rawText} onChange={(event) => setRawText(event.target.value)} rows={12} placeholder="Paste resume text here. AI parsing will be added later." className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" /><div className="flex flex-wrap gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving..." : selected ? "Update resume" : "Save resume"}</Button><Button type="button" variant="outline" onClick={() => setRawText("")} disabled={!rawText}>Clear text</Button></div></form>
    </CardContent></Card>
    {selected && <><Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="AI-ready workspace" title="Resume actions" description="Enhancement and generated formats will be connected to the AI layer later." /></CardHeader><CardContent className="flex flex-wrap gap-3"><Button type="button" disabled><Sparkles className="mr-2 h-4 w-4" />Enhance with AI</Button><Button type="button" onClick={saveEnhanced} disabled={saving || !rawText.trim()}><Sparkles className="mr-2 h-4 w-4" />Save enhanced resume</Button><Button type="button" variant="outline" onClick={() => preview(selected.id)} disabled={selected.content_type !== "application/pdf"}>Preview PDF</Button><Button type="button" variant="outline" onClick={() => download(selected.id, selected.file_name)} disabled={!selected.file_name}><Download className="mr-2 h-4 w-4" />Download original</Button><Button type="button" variant="outline" disabled>Download PDF</Button><Button type="button" variant="outline" disabled>Download Word</Button></CardContent></Card>{previewUrl && <Card className="border-white/10 bg-slate-900/70"><CardHeader><SectionHeader eyebrow="PDF viewer" title={selected.file_name || selected.title} description="Previewing the selected resume file." /></CardHeader><CardContent><iframe title="Resume PDF preview" src={previewUrl} className="h-[70vh] w-full rounded-xl border border-white/10" /></CardContent></Card>}</>}
    <Button type="button" variant="outline" onClick={() => setShowLibrary(true)}>Show all resumes</Button>
    {showLibrary && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true"><Card className="max-h-[85vh] w-full max-w-5xl overflow-auto border-white/10 bg-slate-900"><CardHeader><div className="flex items-center justify-between"><SectionHeader eyebrow="Resume library" title="All your resumes" description="Deleted records remain in the database and are excluded from this table." /><Button type="button" variant="outline" onClick={() => setShowLibrary(false)}>Close</Button></div></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="p-3">Resume name</th><th className="p-3">Created</th><th className="p-3">Updated</th><th className="p-3">Enhanced</th><th className="p-3">Actions</th></tr></thead><tbody>{resumes.map((resume) => <tr key={resume.id} className="border-t border-white/10 text-slate-300"><td className="p-3 text-white">{resume.file_name || resume.title}</td><td className="p-3">{formatDate(resume.created_at)}</td><td className="p-3">{formatDate(resume.updated_at)}</td><td className="p-3">{resume.is_enhanced ? "Yes" : "No"}</td><td className="flex flex-wrap gap-2 p-3"><Button size="sm" onClick={() => { selectResume(resume); setShowLibrary(false); }}>Edit</Button><Button size="sm" variant="outline" onClick={() => preview(resume.id)} disabled={resume.content_type !== "application/pdf"}>Preview</Button><Button size="sm" variant="outline" onClick={() => download(resume.id, resume.file_name)} disabled={!resume.file_name}>Download</Button><Button size="sm" variant="outline" onClick={() => archiveResume(resume.id)}><Trash2 className="mr-1 h-4 w-4" />Delete</Button></td></tr>)}</tbody></table>{!resumes.length && <p className="p-4 text-slate-400">No active resumes.</p>}</div></CardContent></Card></div>}
  </div>;
}

export default ResumePage;