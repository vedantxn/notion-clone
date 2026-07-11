"use client"

import { useMutation } from "convex/react"
import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebouncedSave } from "@/hooks/use-debounced-save"

interface TitleProps {
    initialData: Doc<"documents">
};

export const Title = ({
    initialData
}: TitleProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const update = useMutation(api.documents.update);

    const [title, setTitle] = useState(initialData.title || "Untitled")
    const [isEditing, setIsEditing] = useState(false)

    // Debounced save so the sidebar title doesn't write on every keystroke.
    const { schedule: saveTitle } = useDebouncedSave<string>(
        (value) => update({ id: initialData._id, title: value || "Untitled" }),
        600
    );

    const enableInput = () => {
        setIsEditing(true);
        setTitle(initialData.title);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0);
    };

    const disableInput =  () => {
        setIsEditing(false);
    };

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(e.target.value);
        saveTitle(e.target.value);
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            disableInput();
        }
    };
 
    return (
        <div className="flex items-center gap-x-1">
          {!!initialData.icon && <p>{initialData.icon}</p>}
          {isEditing ? (
            <Input 
              ref={inputRef}
              value={title}
              onClick={enableInput}
              onBlur={disableInput}
              onChange={onChange}
              onKeyDown={onKeyDown}  
              className="h-7 px-2 focus-visible:ring-transparent"
            />
          ): (
            <Button
              onClick={enableInput}
              variant="ghost"
              size="sm"
              className="font-normal h-auto p-1"
            >
              <span className="truncate">
                {initialData.title}
              </span>
            </Button>
          )}
        </div>
    )
};

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-20 rounded-md" />
    );
};