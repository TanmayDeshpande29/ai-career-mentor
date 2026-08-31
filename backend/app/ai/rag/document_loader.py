from pathlib import Path

from langchain_core.documents import Document
from pypdf import PdfReader
from docx import Document as DocxDocument


class ResumeDocumentLoader:

    @staticmethod
    def load(file_path: str) -> list[Document]:
        """
        Load a PDF or DOCX resume into LangChain Documents.
        """

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Resume file not found: {file_path}"
            )

        extension = path.suffix.lower()

        if extension == ".pdf":
            return ResumeDocumentLoader._load_pdf(path)

        if extension == ".docx":
            return ResumeDocumentLoader._load_docx(path)

        raise ValueError(
            f"Unsupported resume format: {extension}"
        )

    @staticmethod
    def _load_pdf(path: Path) -> list[Document]:
        reader = PdfReader(str(path))

        documents = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""

            text = text.strip()

            if not text:
                continue

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "source": path.name,
                        "file_type": "pdf",
                        "page": page_number,
                    },
                )
            )

        return documents

    @staticmethod
    def _load_docx(path: Path) -> list[Document]:
        document = DocxDocument(str(path))

        paragraphs = [
            paragraph.text.strip()
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        text = "\n".join(paragraphs)

        if not text:
            return []

        return [
            Document(
                page_content=text,
                metadata={
                    "source": path.name,
                    "file_type": "docx",
                    "page": 1,
                },
            )
        ]