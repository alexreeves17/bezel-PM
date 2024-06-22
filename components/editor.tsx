"use client";
import {PartialBlock} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react"
import "@blocknote/react/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}



const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async ( file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        });

        return response.url;
    }

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile:handleUpload,
    });

    const handleOnChange = useCallback(() => {
    if (onChange) {
        setTimeout(() => {
        onChange(JSON.stringify(editor.document, null, 2));
        }, 1000);
    }
    }, [editor]);

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            onChange={handleOnChange}
        />
    );
}

export default Editor;
