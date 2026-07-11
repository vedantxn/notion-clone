import type { PartialBlock } from "@blocknote/core";

/**
 * Parse a document's stored `content` string into BlockNote blocks.
 *
 * Handles three cases safely:
 *  1. Empty / missing content            -> `undefined` (editor renders a blank paragraph).
 *  2. Valid serialized BlockNote JSON    -> the parsed block array.
 *  3. Legacy plain-text content          -> converted into paragraph blocks so nothing is lost.
 */
export function parseInitialContent(
    content?: string | null
): PartialBlock[] | undefined {
    if (!content) {
        return undefined;
    }

    const trimmed = content.trim();
    if (!trimmed) {
        return undefined;
    }

    // Only attempt JSON parsing when it looks like a JSON array — legacy plain
    // text that happens to start with "[" is still safely caught below.
    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed as PartialBlock[];
            }
            // Parsed to an empty array — treat as empty document.
            if (Array.isArray(parsed)) {
                return undefined;
            }
        } catch {
            // Not valid JSON: fall through to legacy conversion.
        }
    }

    return legacyTextToBlocks(content);
}

/** Convert raw text into one paragraph block per line. */
function legacyTextToBlocks(text: string): PartialBlock[] {
    const lines = text.replace(/\r\n/g, "\n").split("\n");

    return lines.map((line) => ({
        type: "paragraph",
        content: line.length > 0 ? [{ type: "text", text: line, styles: {} }] : [],
    })) as PartialBlock[];
}

/** Serialize BlockNote blocks back into the string stored in Convex. */
export function serializeContent(blocks: unknown): string {
    return JSON.stringify(blocks);
}
