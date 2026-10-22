export type DocumentType = "typst" | "markdown";

interface Metadata {
  title?: string;
  date?: Date;
  embed?: boolean;
}

interface Item {
  id: string;
  meta: Metadata;
  type: DocumentType;
}
