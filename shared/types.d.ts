export type DocumentType = "typst" | "markdown";

interface Metadata {
  title?: string;
  description?: string;
  date?: Date;
  embed?: boolean;
}

interface Item {
  id: string;
  meta: Metadata;
  type: DocumentType;
}
