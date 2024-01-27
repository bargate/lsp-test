import { TextDocumentIdentifier, documents } from "../../documents";
import log from "../../log";
import { RequestMessage } from "../../server";
import * as fs from "fs";

const words = fs.readFileSync("/usr/share/dict/words").toString().split("\n");
type CompletionItem = {
  label: string;
};

interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
};

interface Position {
/**
 * Line position in a document (zero-based).
 */
line: number;

/**
 * Character offset on a line in a document (zero-based). The meaning of this
 * offset is determined by the negotiated `PositionEncodingKind`.
 *
 * If the character value is greater than the line length it defaults back
 * to the line length.
 */
character: number;
}

export type TextDocumentPositionParams = {
  /**
   * The text document.
   */
  textDocument: TextDocumentIdentifier;

  /**
   * The position inside the text document.
   */
  position: Position;
};

export interface CompletionParams extends TextDocumentPositionParams {};

export const completion = (message: RequestMessage): CompletionList | null => {
  const params = message.params as CompletionParams;
  const content = documents.get(params.textDocument.uri);

  if(!content) {
    return null;
  }

  const currentLine = content.split("\n")[params.position.line];
  const lineUntilCursor = currentLine.slice(0, params.position.character);

  const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");

  const items = words.filter((word) => {
    return word.startsWith(currentPrefix);
  })
  .slice(0, 1000)
  .map((word) => {
    return { label: word };
  });

  log.write({
    completion: {
      currentLine,
      lineUntilCursor,
      currentWord: currentPrefix
    },
  });

  return {
    isIncomplete: true,
    items,
  }
}
