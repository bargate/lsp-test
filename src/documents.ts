type DocumentUri = string;
type DocumentBody = string;

export interface TextDocumentIdentifier {
  uri: DocumentUri;
}

export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
  version: number;
};

export const documents = new Map<DocumentUri, DocumentBody>();
