import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MarkdownTips: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-md overflow-hidden mb-4">
            <button
                className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium text-blue-800 hover:bg-blue-100 transition-colors"
                onClick={toggleExpanded}
            >
                <span>Markdown formatting guide</span>
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {isExpanded && (
                <div className="px-4 py-3 border-t border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-sm text-blue-800 mb-2">Basic Text Formatting</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">**bold**</td>
                                    <td className="py-1"><strong>bold</strong></td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">*italic*</td>
                                    <td className="py-1"><em>italic</em></td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">~~strikethrough~~</td>
                                    <td className="py-1"><del>strikethrough</del></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-blue-800 mb-2">Lists</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">1. Item 1</td>
                                    <td className="py-1">Ordered list</td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">- Item</td>
                                    <td className="py-1">Unordered list</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-blue-800 mb-2">Code</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">`code`</td>
                                    <td className="py-1"><code>inline code</code></td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">```<br/>code block<br/>```</td>
                                    <td className="py-1">Code block</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-blue-800 mb-2">Links & Images</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">[link](url)</td>
                                    <td className="py-1">Hyperlink</td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">![alt](url)</td>
                                    <td className="py-1">Image</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkdownTips;