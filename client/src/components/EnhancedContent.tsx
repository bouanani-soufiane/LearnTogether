"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";

interface EnhancedContentProps {
    htmlContent: string;
    contentType?: "auto" | "code" | "text";
    language?: string;
}
import './enhanced-content-styles.css';


const EnhancedContent: React.FC<EnhancedContentProps> = ({
                                                             htmlContent,
                                                             contentType = "auto",
                                                             language
                                                         }) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [debugInfo, setDebugInfo] = useState<any>({});

    // Simple check for code-like content
    const hasCodePatterns = (content: string): boolean => {
        content = content.trim();

        // Common code patterns
        return (
            /package\s+[\w.]+;/.test(content) ||   // Java package declarations
            /import\s+/.test(content) ||           // Import statements
            /@\w+/.test(content) ||                // Annotations
            /class\s+\w+/.test(content) ||         // Class declarations
            /function\s+\w+\s*\(/.test(content) || // Function declarations
            /def\s+\w+\s*\(/.test(content)         // Python function declarations
        );
    };

    // Try to detect language from content
    const detectLanguage = (content: string): string => {
        content = content.trim();

        if (content.includes("package") && content.includes("import") && content.includes(";")) {
            return "java";
        }

        if (content.includes("function") && content.includes("{")) {
            return "javascript";
        }

        if (content.includes("def ") && content.includes(":")) {
            return "python";
        }

        if (content.includes("SELECT") && content.includes("FROM")) {
            return "sql";
        }

        // Default
        return "java"; // Most content seems to be Java in your examples
    };

    // Process the content to detect JSON
    const parseContent = (rawContent: string): { content: string; isCode: boolean; lang: string } => {
        try {
            // Try parsing as JSON
            const parsed = JSON.parse(rawContent);
            if (parsed && typeof parsed === 'object' && parsed.content) {
                // It's a JSON object with content field
                const parsedContent = parsed.content;
                const isCodeLike = hasCodePatterns(parsedContent);
                const detectedLang = isCodeLike ? detectLanguage(parsedContent) : "";

                return {
                    content: parsedContent,
                    isCode: isCodeLike,
                    lang: detectedLang
                };
            }
        } catch (e) {
            // Not JSON, continue with regular content
        }

        // Regular content
        const isCodeLike = hasCodePatterns(rawContent);
        const detectedLang = isCodeLike ? detectLanguage(rawContent) : "";

        return {
            content: rawContent,
            isCode: isCodeLike,
            lang: detectedLang
        };
    };

    useEffect(() => {
        if (contentRef.current) {
            // Parse and process the content
            const { content, isCode, lang } = parseContent(htmlContent);

            // Determine how to render based on contentType prop
            let finalHtml = "";
            let finalLang = language || lang;

            if (contentType === "code" || (contentType === "auto" && isCode)) {
                // Render as code
                finalHtml = `<pre><code class="language-${finalLang}">${content}</code></pre>`;
            } else if (contentType === "text" || (contentType === "auto" && !isCode)) {
                // Keep as regular text (but preserve newlines)
                finalHtml = content.replace(/\n/g, "<br>");
            }

            // Store debug info
            setDebugInfo({
                original: htmlContent.substring(0, 100) + "...",
                parsed: content.substring(0, 100) + "...",
                isCode,
                detectedLanguage: lang,
                finalLanguage: finalLang,
                contentType
            });

            // Set the content
            contentRef.current.innerHTML = finalHtml;

            console.log(`Rendering content as ${isCode ? "code" : "text"}, language: ${finalLang}`);
            console.log(`Content starts with: ${content.substring(0, 50)}...`);

            // Process code blocks
            try {
                const preElements = contentRef.current.querySelectorAll("pre");
                console.log(`Found ${preElements.length} pre elements`);

                preElements.forEach((preElement: Element) => {
                    let codeElement = preElement.querySelector("code");

                    if (!codeElement) {
                        codeElement = document.createElement("code");
                        codeElement.innerHTML = preElement.innerHTML;
                        preElement.innerHTML = "";
                        preElement.appendChild(codeElement);
                    }

                    // Ensure language class is set
                    if (finalLang && !codeElement.classList.contains(`language-${finalLang}`)) {
                        codeElement.className = `language-${finalLang}`;
                    }

                    // Add language label
                    if (finalLang) {
                        const langLabel = document.createElement("div");
                        langLabel.className = "code-language";
                        langLabel.textContent = finalLang;
                        preElement.appendChild(langLabel);
                    }

                    // Add copy button
                    const copyButton = document.createElement("button");
                    copyButton.className = "code-copy-button";
                    copyButton.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
                    preElement.appendChild(copyButton);

                    copyButton.addEventListener("click", () => {
                        const code = codeElement?.textContent || "";
                        navigator.clipboard.writeText(code).then(() => {
                            const span = copyButton.querySelector("span");
                            if (span) {
                                span.textContent = "Copied!";
                                setTimeout(() => {
                                    if (span) span.textContent = "Copy";
                                }, 2000);
                            }
                        });
                    });
                });

                // Apply syntax highlighting
                Prism.highlightAllUnder(contentRef.current);
            } catch (error) {
                console.error("Error processing code blocks:", error);
            }
        }
    }, [htmlContent, contentType, language]);

    return (
        <>
            <div className="prose max-w-none">
                <div ref={contentRef} />
            </div>
        </>
    );
};

export default EnhancedContent;