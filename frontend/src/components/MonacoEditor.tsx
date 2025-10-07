import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  height?: string;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

const MonacoEditor = ({
  value,
  onChange,
  language,
  theme = "vs-dark",
  height = "100%",
  onMount,
}: MonacoEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Monaco Editor theme to match VS Code Dark+ theme
    monaco.editor.defineTheme("codementor-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        // Comments
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "comment.line", foreground: "6A9955", fontStyle: "italic" },
        { token: "comment.block", foreground: "6A9955", fontStyle: "italic" },
        
        // Keywords
        { token: "keyword", foreground: "C586C0" },
        { token: "keyword.control", foreground: "C586C0" },
        { token: "keyword.operator", foreground: "D4D4D4" },
        
        // Strings
        { token: "string", foreground: "CE9178" },
        { token: "string.quoted", foreground: "CE9178" },
        
        // Numbers
        { token: "number", foreground: "B5CEA8" },
        { token: "number.float", foreground: "B5CEA8" },
        { token: "number.hex", foreground: "B5CEA8" },
        
        // Functions and Methods
        { token: "function", foreground: "DCDCAA" },
        { token: "support.function", foreground: "DCDCAA" },
        { token: "entity.name.function", foreground: "DCDCAA" },
        { token: "meta.function-call", foreground: "DCDCAA" },
        
        // Classes and Types
        { token: "class", foreground: "4EC9B0" },
        { token: "entity.name.class", foreground: "4EC9B0" },
        { token: "entity.name.type", foreground: "4EC9B0" },
        { token: "support.type", foreground: "4EC9B0" },
        { token: "support.class", foreground: "4EC9B0" },
        { token: "type", foreground: "4EC9B0" },
        
        // Variables
        { token: "variable", foreground: "9CDCFE" },
        { token: "variable.parameter", foreground: "9CDCFE" },
        { token: "variable.other", foreground: "9CDCFE" },
        
        // Constants
        { token: "constant", foreground: "4FC1FF" },
        { token: "constant.language", foreground: "569CD6" },
        { token: "constant.numeric", foreground: "B5CEA8" },
        
        // Operators
        { token: "operator", foreground: "D4D4D4" },
        
        // Punctuation
        { token: "delimiter", foreground: "D4D4D4" },
        { token: "delimiter.bracket", foreground: "FFD700" },
        { token: "delimiter.parenthesis", foreground: "FFD700" },
        
        // Special
        { token: "tag", foreground: "569CD6" },
        { token: "attribute.name", foreground: "9CDCFE" },
        { token: "attribute.value", foreground: "CE9178" },
        
        // Python specific
        { token: "support.type.python", foreground: "4EC9B0" },
        { token: "constant.language.python", foreground: "569CD6" },
        
        // JavaScript specific
        { token: "support.constant.js", foreground: "569CD6" },
        { token: "storage.type.js", foreground: "569CD6" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#C6C6C6",
        "editorCursor.foreground": "#AEAFAD",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#3A3D41",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
        "editor.lineHighlightBackground": "#282828",
        "editor.lineHighlightBorder": "#282828",
        "editorWhitespace.foreground": "#3B3A32",
        "editorBracketMatch.background": "#0064001a",
        "editorBracketMatch.border": "#888888",
        "editor.wordHighlightBackground": "#575757b8",
        "editor.wordHighlightStrongBackground": "#004972b8",
        "editor.findMatchBackground": "#515C6A",
        "editor.findMatchHighlightBackground": "#EA5C0055",
        "editor.hoverHighlightBackground": "#264f7840",
        "editorHoverWidget.background": "#252526",
        "editorHoverWidget.border": "#454545",
      },
    });

    // Create the editor instance
    const editor = monaco.editor.create(containerRef.current, {
      value: value,
      language: language,
      theme: "codementor-dark",
      automaticLayout: true,
      fontSize: 14,
      lineHeight: 21,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
      fontLigatures: true,
      fontWeight: "400",
      letterSpacing: 0.5,
      lineNumbers: "on",
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      padding: {
        top: 16,
        bottom: 16,
      },
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        bracketPairsHorizontal: "active",
        indentation: true,
        highlightActiveIndentation: true,
      },
      suggest: {
        showSnippets: true,
        snippetsPreventQuickSuggestions: false,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      wordWrap: "off",
      wrappingIndent: "indent",
      renderWhitespace: "selection",
      renderControlCharacters: false,
      matchBrackets: "always",
      showFoldingControls: "always",
      foldingStrategy: "indentation",
      formatOnType: true,
      formatOnPaste: true,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoSurround: "languageDefined",
      colorDecorators: true,
    });

    editorRef.current = editor;

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    // Call onMount callback if provided
    if (onMount) {
      onMount(editor);
    }

    // Cleanup
    return () => {
      editor.dispose();
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return <div ref={containerRef} style={{ height, width: "100%" }} />;
};

export default MonacoEditor;
