"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useState } from "react";
import { useTheme } from "next-themes";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

interface IconPickerProps {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}

export const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
    const { resolvedTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const themeMap: Record<string, Theme> = {
        dark: Theme.DARK,
        light: Theme.LIGHT,
    };
    const theme = themeMap[resolvedTheme ?? "light"] ?? Theme.AUTO;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>

            <PopoverContent className="p-0 w-full border-none shadow-none">
                <EmojiPicker
                    height={350}
                    theme={theme}
                    onEmojiClick={(data) => {
                        onChange(data.emoji);
                        // Close the picker as soon as an emoji is chosen.
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};
