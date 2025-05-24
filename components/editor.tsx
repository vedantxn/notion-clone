"use client";

import {
    BlockNoteEditor,
    PartialBlock
} from "@blocknote/core";
import {
    BlockNoteView
} from "@blocknote/mantine";
import {
    useCreateBlockNote
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes"

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
};

export const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {
    
    const { resolvedTheme } = useTheme();
    
    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined
    })

    return (
        <BlockNoteView 
          editor={editor} 
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          onChange={onChange ? () => {onChange(JSON.stringify(editor.document))}: () => {}} 
          editable = {editable}
        />
    )
};