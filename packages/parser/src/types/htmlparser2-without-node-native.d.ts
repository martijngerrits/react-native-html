declare module 'htmlparser2-without-node-native' {
  export interface ParserOptions {
    /**
     * Indicates whether special tags (<script> and <style>) should get special treatment
     * and if "empty" tags (eg. <br>) can have children.  If `false`, the content of special tags
     * will be text only. For feeds and other XML content (documents that don't consist of HTML),
     * set this to `true`. Default: `false`.
     */
    xmlMode?: boolean;
    /**
     * If set to true, entities within the document will be decoded. Defaults to `false`.
     */
    decodeEntities?: boolean;
    /**
     * If set to true, all tags will be lowercased. If xmlMode is disabled, this defaults to `true`.
     */
    lowerCaseTags?: boolean;
    /**
     * If set to `true`, all attribute names will be lowercased. This has noticeable impact on speed, so it defaults to `false`.
     */
    lowerCaseAttributeNames?: boolean;
    /**
     * If set to true, CDATA sections will be recognized as text even if the xmlMode option is not enabled.
     * NOTE: If xmlMode is set to `true` then CDATA sections will always be recognized as text.
     */
    recognizeCDATA?: boolean;
    /**
     * If set to `true`, self-closing tags will trigger the onclosetag event even if xmlMode is not set to `true`.
     * NOTE: If xmlMode is set to `true` then self-closing tags will always be recognized.
     */
    recognizeSelfClosing?: boolean;
    /**
     * Allows the default tokenizer to be overwritten.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Tokenizer?: any;
  }
  export class Parser {
    constructor(cbs: DomHandler, options?: ParserOptions);

    write(chunk: string): void;

    done(): void;
  }

  export interface DomHandlerOptions {
    /**
     * Indicates whether the whitespace in text nodes should be normalized
     * (= all whitespace should be replaced with single spaces). The default value is "false".
     */
    normalizeWhitespace?: boolean;
    /**
     * Indicates whether a startIndex property will be added to nodes.
     * When the parser is used in a non-streaming fashion, startIndex is an integer
     * indicating the position of the start of the node in the document.
     * The default value is "false".
     */
    withStartIndices?: boolean;
    /**
     * Indicates whether a endIndex property will be added to nodes.
     * When the parser is used in a non-streaming fashion, endIndex is an integer
     * indicating the position of the end of the node in the document.
     * The default value is "false".
     */
    withEndIndices?: boolean;
  }
  interface ParserInterface {
    startIndex: number | null;
    endIndex: number | null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Callback = (error: Error | null, dom: unknown[]) => void;
  type ElementCallback = (element: Element) => void;
  export class DomHandler {
    /**
     * Initiate a new DomHandler.
     *
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */
    constructor(
      callback?: Callback | null,
      options?: DomHandlerOptions | null,
      elementCB?: ElementCallback
    );
  }
}
