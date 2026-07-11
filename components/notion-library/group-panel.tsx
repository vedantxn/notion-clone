"use client";

import { useState } from "react";
import { ChevronLeft, X, FileText, UserCircle2, Clock } from "lucide-react";

const GROUP_OPTIONS = [
  { id: "none", label: "None" },
  { id: "page_name", label: "Page name", icon: "document" },
  { id: "created_by", label: "Created by", icon: "user-circle" },
  { id: "created_time", label: "Created time", icon: "clock" },
  { id: "last_edited_by", label: "Last edited by", icon: "user-circle" },
  { id: "last_edited_time", label: "Last edited time", icon: "clock" },
  { id: "last_visited_time", label: "Last visited time", icon: "clock" },
];

interface GroupPanelProps {
  selectedGroup: string;
  onClose: () => void;
  onGroupChange: (groupId: string) => void;
}

export function GroupPanel({
  selectedGroup,
  onClose,
  onGroupChange,
}: GroupPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = GROUP_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "document":
        return (
          <FileText className="h-4 w-4" strokeWidth={1.8} style={{ marginInline: "6px 2px" }} />
        );
      case "user-circle":
        return (
          <UserCircle2 className="h-4 w-4" strokeWidth={1.8} style={{ marginInline: "6px 2px" }} />
        );
      case "clock":
        return (
          <Clock className="h-4 w-4" strokeWidth={1.8} style={{ marginInline: "6px 2px" }} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08]">
        {/* Header */}
        <div className="flex h-[52px] items-center justify-between border-b border-black/[0.06] px-4">
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05]"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <h2 className="text-[14px] font-semibold text-[#2C2C2B]">Group by</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded bg-black/[0.04] text-[#5F5E59] hover:bg-black/[0.08]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex h-7 items-center rounded-md bg-black/[0.035] px-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.10)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1px_rgba(35,131,226,0.55)]">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a property…"
              className="h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-0">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onGroupChange(option.id);
                  onClose();
                }}
                className={`flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-left text-[14px] transition-colors ${
                  selectedGroup === option.id
                    ? "bg-black/[0.06] text-[#2C2C2B]"
                    : "text-[#5F5E59] hover:bg-black/[0.03]"
                }`}
              >
                <div className="flex h-4 w-4 items-center justify-center flex-shrink-0">
                  {getIcon(option.icon)}
                </div>
                <span className="flex-1">{option.label}</span>
                {selectedGroup === option.id && (
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-[#2C2C2B]"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
