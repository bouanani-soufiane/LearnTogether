import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"

/**
 * Utility function to inspect HTML content for debugging
 * @param htmlContent The HTML content to inspect
 */
export const debugHtmlContent = (htmlContent: string): void => {
    console.log("HTML Content Length:", htmlContent.length)
    console.log("Contains <pre> tags:", htmlContent.includes("<pre"))
    console.log("Contains <code> tags:", htmlContent.includes("<code"))

    // Extract and log code blocks for debugging
    const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/g
    let match
    let count = 0

    while ((match = preRegex.exec(htmlContent)) !== null) {
        count++
        console.log(`Code block #${count}:`, match[1].substring(0, 100) + (match[1].length > 100 ? "..." : ""))
    }

    console.log(`Found ${count} code blocks in HTML content`)
}

/**
 * Utility function to check if Prism is properly initialized
 */
export const checkPrismInitialization = (): void => {
    if (typeof Prism === "undefined") {
        console.error("Prism is not defined! Make sure it's properly imported.")
        return
    }

    console.log("Prism version:", Prism)
    console.log(
        "Prism languages loaded:",
        Object.keys(Prism.languages).filter(
            (lang) =>
                typeof Prism.languages[lang] === "object" && lang !== "extend" && lang !== "insertBefore" && lang !== "DFS",
        ),
    )
}

/**
 * Utility function to manually apply Prism highlighting to code elements
 * @param element The parent element containing code blocks
 */
export const manuallyApplyPrismHighlighting = (element: HTMLElement): void => {
    const codeElements = element.querySelectorAll("pre code")
    console.log(`Manually highlighting ${codeElements.length} code elements`)

    codeElements.forEach((codeElement, index) => {
        const language =
            Array.from(codeElement.classList)
                .find((cls) => cls.startsWith("language-"))
                ?.replace("language-", "") || "text"

        console.log(`Highlighting code element #${index + 1} with language: ${language}`)

        try {
            if (language !== "text" && Prism.languages[language]) {
                const code = codeElement.textContent || ""
                codeElement.innerHTML = Prism.highlight(code, Prism.languages[language], language)
                console.log(`Successfully highlighted code element #${index + 1}`)
            } else {
                console.warn(`Language '${language}' not supported by Prism or is 'text'`)
            }
        } catch (error) {
            console.error(`Error highlighting code element #${index + 1}:`, error)
        }
    })
}

