import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $createParagraphNode,
    $getNodeByKey,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import {
    $createCodeNode,
    $isCodeNode,
    getCodeLanguages,
    getDefaultCodeLanguage,
} from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType,
} from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import { $createListItemNode, $createListNode, ListNode } from '@lexical/list';
import { useCallback, useEffect, useState } from 'react';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaCode,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaUndo,
    FaRedo,
} from 'react-icons/fa';

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState<string>('paragraph');

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsCode(selection.hasFormat('code'));

            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            if (elementDOM !== null) {
                if ($isHeadingNode(element)) {
                    const tag = element.getTag();
                    setBlockType(tag);
                } else if ($isCodeNode(element)) {
                    setBlockType('code');
                } else {
                    const type = element.getType();
                    if (type) {
                        setBlockType(type);
                    } else {
                        setBlockType('paragraph');
                    }
                }
            }
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, _newEditor) => {
                updateToolbar();
                return false;
            },
            1
        );
    }, [editor, updateToolbar]);

    useEffect(() => {
        return editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            1
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            1
        );
    }, [editor]);

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(headingSize));
                }
            });
        }
    };

    const formatBulletList = () => {
        if (blockType !== 'ul') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createListNode('bullet'));
                }
            });
        }
    };

    const formatNumberedList = () => {
        if (blockType !== 'ol') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createListNode('number'));
                }
            });
        }
    };

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createQuoteNode());
                }
            });
        }
    };

    const formatCode = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (selection.isCollapsed()) {
                        $setBlocksType(selection, () => $createCodeNode());
                    } else {
                        // Format the selection as inline code
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                    }
                }
            });
        }
    };

    return (
        <div className="toolbar flex items-center p-2 bg-gray-100 border-b border-gray-300">
            <button
                className={`p-1 mx-1 rounded ${canUndo ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-400'}`}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                disabled={!canUndo}
                title="Undo"
            >
                <FaUndo size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${canRedo ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-400'}`}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                disabled={!canRedo}
                title="Redo"
            >
                <FaRedo size={16} />
            </button>
            <Divider />
            <button
                className={`p-1 mx-1 rounded ${isBold ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                title="Bold"
            >
                <FaBold size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${isItalic ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                title="Italic"
            >
                <FaItalic size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${isUnderline ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                title="Underline"
            >
                <FaUnderline size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${blockType === 'code' ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={formatCode}
                title="Code Block"
            >
                <FaCode size={16} />
            </button>
            <Divider />
            <button
                className={`p-1 mx-1 rounded ${blockType === 'ul' ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={formatBulletList}
                title="Bullet List"
            >
                <FaListUl size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${blockType === 'ol' ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={formatNumberedList}
                title="Numbered List"
            >
                <FaListOl size={16} />
            </button>
            <button
                className={`p-1 mx-1 rounded ${blockType === 'quote' ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={formatQuote}
                title="Quote"
            >
                <FaQuoteLeft size={16} />
            </button>
            <Divider />
            <select
                className="p-1 bg-white border border-gray-300 rounded text-sm"
                value={blockType}
                onChange={(e) => {
                    const newBlockType = e.target.value;
                    switch (newBlockType) {
                        case 'paragraph':
                            formatParagraph();
                            break;
                        case 'h1':
                        case 'h2':
                        case 'h3':
                            formatHeading(newBlockType as HeadingTagType);
                            break;
                        case 'ul':
                            formatBulletList();
                            break;
                        case 'ol':
                            formatNumberedList();
                            break;
                        case 'quote':
                            formatQuote();
                            break;
                        case 'code':
                            formatCode();
                            break;
                        default:
                            formatParagraph();
                    }
                }}
            >
                <option value="paragraph">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
            </select>
        </div>
    );
}