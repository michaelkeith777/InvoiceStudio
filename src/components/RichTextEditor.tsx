import React, { useRef, useCallback, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content...",
  readOnly = false,
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || '';
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Define handleContentChange first
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  }, [handleContentChange]);

  const insertList = useCallback((ordered: boolean) => {
    const listType = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    execCommand(listType);
  }, [execCommand]);

  const toggleFormat = useCallback((format: string) => {
    execCommand(format);
  }, [execCommand]);

  const insertHeading = useCallback((level: number) => {
    execCommand('formatBlock', `h${level}`);
  }, [execCommand]);

  return (
    <div className={`rich-text-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {/* Headings */}
        <select
          onChange={(e) => {
            if (e.target.value === 'p') {
              execCommand('formatBlock', 'div');
            } else {
              insertHeading(parseInt(e.target.value));
            }
            e.target.value = 'p';
          }}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white"
          defaultValue="p"
        >
          <option value="p">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => toggleFormat('bold')}
          className="px-2 py-1 text-xs font-bold border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('italic')}
          className="px-2 py-1 text-xs italic border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('underline')}
          className="px-2 py-1 text-xs underline border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Underline"
        >
          U
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => insertList(false)}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => insertList(true)}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Align Left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Center"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Align Right"
        >
          →
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Block formats */}
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
          title="Quote"
        >
          " "
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="p-4 min-h-[200px] outline-none focus:ring-0"
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        .rich-text-editor [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: normal;
          pointer-events: none;
        }
        .rich-text-editor [contenteditable] h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor [contenteditable] h2 {
          font-size: 1.3em;
          font-weight: bold;
          margin: 0.4em 0;
        }
        .rich-text-editor [contenteditable] h3 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 0.3em 0;
        }
        .rich-text-editor [contenteditable] ul {
          list-style-type: disc;
          margin-left: 1.5em;
          margin: 0.5em 0 0.5em 1.5em;
        }
        .rich-text-editor [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 1.5em;
          margin: 0.5em 0 0.5em 1.5em;
        }
        .rich-text-editor [contenteditable] li {
          margin: 0.2em 0;
        }
        .rich-text-editor [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1em 0;
          padding-left: 1em;
          color: #6b7280;
          font-style: italic;
        }
        .rich-text-editor [contenteditable] p {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;