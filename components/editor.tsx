"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { useMemo } from "react";

import { parseInitialContent, serializeContent } from "@/lib/blocknote-content";

interface EditorProps {
    onChange?: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export const Editor = ({
    onChange,
    initialContent,
    editable = true,
}: EditorProps) => {
    const { resolvedTheme } = useTheme();

    // Parse once for the lifetime of this mount. The parent remounts the editor
    // (via `key`) when the document changes, so we never re-feed content and the
    // cursor never jumps.
    const parsedContent = useMemo<PartialBlock[] | undefined>(
        () => parseInitialContent(initialContent),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // useCreateBlockNote memoizes the instance — it is NOT recreated on re-render.
    const editor = useCreateBlockNote({
        initialContent: parsedContent,
    });

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            onChange={
                onChange
                    ? () => onChange(serializeContent(editor.document))
                    : undefined
            }
        />
    );
};
