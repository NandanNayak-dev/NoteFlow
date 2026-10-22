import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const buttonClass = (isActive) =>
    `p-2 rounded-lg transition-colors duration-150 cursor-pointer ${
      isActive
        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-inner'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl mb-4 shadow-sm dark:shadow-none transition-colors duration-150">
      {/* Text Styles */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={buttonClass(editor.isActive('taskList'))}
        title="Checklist / Task List"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* Blocks */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 ml-auto" />

      {/* History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg cursor-pointer"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg cursor-pointer"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
}
