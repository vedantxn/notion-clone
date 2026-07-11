"use client";

import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { useCoverImage } from "@/hooks/use-cover-image";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { getCoverImage } from "@/lib/utils";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);
  const coverImage = useCoverImage();

  // Debounced title save — no Convex write per keystroke; empty -> "Untitled".
  const { schedule: saveTitle } = useDebouncedSave<string>(
    (title) => update({ id: initialData._id, title: title || "Untitled" }),
    600
  );

  // Keep the local value in sync if the document changes underneath us.
  useEffect(() => {
    setValue(initialData.title);
  }, [initialData._id, initialData.title]);

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (next: string) => {
    setValue(next);
    saveTitle(next);
  };

  const focusEditor = () => {
    // BlockNote's editable region is the `.bn-editor` element itself
    // (it carries contenteditable=true), so there is no descendant to target.
    const el = document.querySelector<HTMLElement>(
      ".bn-editor[contenteditable='true']"
    );
    el?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
      focusEditor();
    }
  };

  const onIconSelect = (icon: string) => {
    update({ id: initialData._id, icon });
  };

  const onIconRemove = () => {
    removeIcon({ id: initialData._id });
  };

  const hasCover = !!getCoverImage(initialData);

  return (
    <div className="pl-6 md:pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center group/icon pt-6 gap-x-2">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>

          <Button
            onClick={onIconRemove}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs hover:opacity-75 transition"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {!hasCover && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs hover:opacity-75 transition"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          className="text-5xl font-bold outline-none bg-transparent break-words text-[#3F3F3F] dark:text-[#CFCFCF] resize-none w-full"
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(event) => onInput(event.target.value)}
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title || "Untitled"}
        </div>
      )}
    </div>
  );
};
