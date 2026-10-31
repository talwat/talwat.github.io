export type DocumentType = "typst" | "markdown";

interface DocumentMeta {
  title?: string;
  description?: string;
  date?: Date;
  embed?: boolean;
}

interface DocumentEntry {
  id: string;
  meta: DocumentMeta;
  type: DocumentType;
}
