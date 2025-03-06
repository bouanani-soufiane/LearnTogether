import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'; // Add this import
import { $getRoot, EditorState } from 'lexical'; // Add this import
import ToolbarPlugin from './plugins/ToolbarPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import './styles.css';

type EditorProps = {
    initialContent?: string;
    onChange?: (html: string) => void;
    readOnly?: boolean;
    placeholder?: string;
    minHeight?: string;
};

export default function LexicalEditor({
                                          initialContent = '',
                                          onChange,
                                          readOnly = false,
                                          placeholder = 'Enter your content here...',
                                          minHeight = '200px',
                                      }: EditorProps) {
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

    const editorConfig = {
        namespace: 'CodeQAEditor',
        // The editor theme
        theme: {
            ltr: 'ltr',
            rtl: 'rtl',
            placeholder: 'editor-placeholder',
            paragraph: 'editor-paragraph',
            heading: {
                h1: 'editor-heading-h1',
                h2: 'editor-heading-h2',
                h3: 'editor-heading-h3',
                h4: 'editor-heading-h4',
                h5: 'editor-heading-h5',
            },
            list: {
                nested: {
                    listitem: 'editor-nested-listitem',
                },
                ol: 'editor-list-ol',
                ul: 'editor-list-ul',
                listitem: 'editor-listitem',
            },
            quote: 'editor-quote',
            link: 'editor-link',
            text: {
                bold: 'editor-text-bold',
                italic: 'editor-text-italic',
                underline: 'editor-text-underline',
                code: 'editor-text-code',
                strikethrough: 'editor-text-strikethrough',
            },
            code: 'editor-code',
        },
        // Handling of errors during update
        onError(error: Error) {
            throw error;
        },
        // Any custom nodes go here
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode,
        ],
        editable: !readOnly,
    };

    // Create the ref that we'll use to attach the floating toolbar to the editor
    useEffect(() => {
        const div = document.createElement('div');
        setFloatingAnchorElem(div);
        return () => {
            setFloatingAnchorElem(null);
        };
    }, []);

    // Function to handle editor changes
    const handleEditorChange = (editorState: EditorState) => {
        if (onChange) {
            editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                onChange(textContent);
            });
        }
    };

    return (
        <div
            className="lexical-editor-container border border-gray-300 rounded-md overflow-hidden"
            style={{ minHeight }}
        >
            <LexicalComposer initialConfig={editorConfig}>
                <ToolbarPlugin />
                <div className="editor-container">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                style={{ minHeight, padding: '1rem' }}
                            />
                        }
                        placeholder={
                            <div className="editor-placeholder">{placeholder}</div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    {!readOnly ? <AutoFocusPlugin /> : null}
                    <ListPlugin />
                    <LinkPlugin />
                    <CodeHighlightPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

                    {/* Add OnChangePlugin to detect and handle content changes */}
                    <OnChangePlugin onChange={handleEditorChange} />
                </div>
            </LexicalComposer>
        </div>
    );
}