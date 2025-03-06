"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";

interface EnhancedContentProps {
    htmlContent: string;
}

const codeStyles = `
/* Custom styling for code blocks */
pre {
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

pre code {
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e0e0e0;
  background: transparent;
  padding: 0;
  border-radius: 0;
  white-space: pre;
  word-break: normal;
  word-spacing: normal;
  tab-size: 2;
}

.code-copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
  z-index: 5;
}

pre:hover .code-copy-button {
  opacity: 1;
}

.code-copy-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.code-language {
  position: absolute;
  top: 0;
  right: 3rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: #e0e0e0;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 0 0 0 4px;
  text-transform: uppercase;
  z-index: 5;
}

/* Improved inline code styling */
:not(pre) > code {
  background-color: #f1f5f9;
  color: #1e293b;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9em;
}

/* Token colors for syntax highlighting */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #6a9955;
}

.token.punctuation {
  color: #d4d4d4;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #b5cea8;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #ce9178;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #d4d4d4;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: #569cd6;
}

.token.function,
.token.class-name {
  color: #dcdcaa;
}

.token.regex,
.token.important,
.token.variable {
  color: #d16969;
}

.token.important,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}
`;

const EnhancedContent: React.FC<EnhancedContentProps> = ({ htmlContent }) => {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (contentRef.current) {
            let finalContent = htmlContent;

            // If the provided HTML doesn't include <pre> or <code>, wrap it.
            if (!htmlContent.includes("<pre") && !htmlContent.includes("<code")) {
                finalContent = `<pre><code>${htmlContent}</code></pre>`;
            }

            // Set the (possibly wrapped) HTML content.
            contentRef.current.innerHTML = finalContent;
            console.log("Setting HTML content:", finalContent);
            console.log("HTML content contains pre tags:", finalContent.includes("<pre"));
            console.log("HTML content contains code tags:", finalContent.includes("<code"));

            try {
                // Find all code blocks
                const preElements = contentRef.current.querySelectorAll("pre");
                console.log(`Found ${preElements.length} pre elements`);

                preElements.forEach((preElement: Element) => {
                    let codeElement = preElement.querySelector("code");

                    // If no <code> element is found, create one and wrap content.
                    if (!codeElement) {
                        console.log("Creating code element for pre without one");
                        codeElement = document.createElement("code");
                        const content = preElement.innerHTML;
                        preElement.innerHTML = "";
                        codeElement.innerHTML = content;
                        preElement.appendChild(codeElement);
                    }

                    // Attempt language detection
                    let language = "";
                    if (codeElement.className) {
                        const classNames = codeElement.className.split(" ");
                        const langClass = classNames.find((cls) => cls.startsWith("language-"));
                        if (langClass) {
                            language = langClass.replace("language-", "");
                        }
                    }

                    // Basic detection based on content patterns
                    if (!language) {
                        const content = codeElement.textContent || "";
                        if (content.includes("function") && (content.includes("{") || content.includes("=>"))) {
                            language = "javascript";
                        } else if (content.includes("class") && content.includes("public") && content.includes("{")) {
                            language = "java";
                        } else if (content.includes("def ") && content.includes(":")) {
                            language = "python";
                        } else if (content.includes("<html") || content.includes("<!DOCTYPE")) {
                            language = "html";
                        } else if (content.includes("@media") || content.includes("margin:") || content.includes("padding:")) {
                            language = "css";
                        } else if (content.includes("SELECT") && content.includes("FROM")) {
                            language = "sql";
                        } else if (content.includes("import ") && content.includes("from ")) {
                            language = "typescript";
                        } else {
                            language = "text";
                        }
                    }
                    console.log(`Detected language: ${language}`);

                    // Add language class if missing.
                    if (language && !codeElement.classList.contains(`language-${language}`)) {
                        codeElement.classList.add(`language-${language}`);
                    }

                    // Add a language label if it doesn't exist.
                    if (language && language !== "text") {
                        const existingLabel = preElement.querySelector(".code-language");
                        if (!existingLabel) {
                            const langLabel = document.createElement("div");
                            langLabel.className = "code-language";
                            langLabel.textContent = language;
                            preElement.appendChild(langLabel);
                        }
                    }

                    // Add a copy button if it doesn't exist.
                    const existingButton = preElement.querySelector(".code-copy-button");
                    if (!existingButton) {
                        const copyButton = document.createElement("button");
                        copyButton.className = "code-copy-button";
                        copyButton.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
                        preElement.appendChild(copyButton);

                        copyButton.addEventListener("click", () => {
                            const code = codeElement?.textContent || "";
                            navigator.clipboard.writeText(code).then(() => {
                                const textSpan = copyButton.querySelector("span");
                                if (textSpan) {
                                    const originalText = textSpan.textContent;
                                    textSpan.textContent = "Copied!";
                                    setTimeout(() => {
                                        if (textSpan) textSpan.textContent = originalText;
                                    }, 2000);
                                }
                            });
                        });
                    }
                });

                // Apply Prism highlighting.
                console.log("Applying Prism highlighting");
                Prism.highlightAllUnder(contentRef.current);
                console.log("Prism highlighting applied successfully");
            } catch (error) {
                console.error("Error processing code blocks:", error);
            }
        }
    }, [htmlContent]);

    return (
        <>
            <style>{codeStyles}</style>
            <div className="prose max-w-none">
                <div ref={contentRef} />
            </div>
        </>
    );
};

export default EnhancedContent;
