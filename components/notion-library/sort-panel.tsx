"use client";

import { useState } from "react";
import { ChevronLeft, X, Plus, Trash2, Clock } from "lucide-react";

export type SortRule = {
  id: string;
  field: string;
  direction: "asc" | "desc";
};

const SORT_FIELDS = [
  "Last edited time",
  "Created time",
  "Page name",
  "Created by",
  "Last visited time",
];

interface SortPanelProps {
  sortRules: SortRule[];
  onClose: () => void;
  onAddSort: (rule: SortRule) => void;
  onRemoveSort: (id: string) => void;
  onUpdateSort: (id: string, direction: "asc" | "desc") => void;
}

export function SortPanel({
  sortRules,
  onClose,
  onAddSort,
  onRemoveSort,
  onUpdateSort,
}: SortPanelProps) {
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
          <h2 className="text-[14px] font-semibold text-[#2C2C2B]">Sort</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded bg-black/[0.04] text-[#5F5E59] hover:bg-black/[0.08]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {/* Existing Sort Rules */}
            {sortRules.map((rule) => (
              <SortRuleItem
                key={rule.id}
                rule={rule}
                onUpdateDirection={(direction) =>
                  onUpdateSort(rule.id, direction)
                }
                onRemove={() => onRemoveSort(rule.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer: Add Sort / Delete Sort */}
        <div className="border-t border-black/[0.06] p-3 space-y-2">
          <button
            onClick={() => {
              const newRule: SortRule = {
                id: Date.now().toString(),
                field: SORT_FIELDS[0],
                direction: "desc",
              };
              onAddSort(newRule);
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
          >
            <Plus className="h-5 w-5" strokeWidth={1.8} />
            <span>Add sort</span>
          </button>

          {sortRules.length > 0 && (
            <button
              onClick={() => {
                if (sortRules.length > 0) {
                  onRemoveSort(sortRules[0].id);
                }
              }}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
            >
              <Trash2 className="h-5 w-5" strokeWidth={1.8} />
              <span>Delete sort</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SortRuleItem({
  rule,
  onUpdateDirection,
  onRemove,
}: {
  rule: SortRule;
  onUpdateDirection: (direction: "asc" | "desc") => void;
  onRemove: () => void;
}) {
  const [fieldOpen, setFieldOpen] = useState(false);
  const [directionOpen, setDirectionOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="flex h-9 w-6 items-center justify-center text-[#91918E] flex-shrink-0">
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M6.25 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m1.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m6.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 16a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0" />
        </svg>
      </div>

      {/* Field Selector */}
      <div className="relative flex-1">
        <button
          onClick={() => setFieldOpen(!fieldOpen)}
          className="w-full flex items-center gap-2 rounded-md bg-black/[0.035] px-2 h-9 text-[14px] text-[#2C2C2B] hover:bg-black/[0.05] transition-colors"
        >
          <Clock className="h-4 w-4 flex-shrink-0 text-[#91918E]" strokeWidth={1.8} />
          <span className="flex-1 text-left truncate">{rule.field}</span>
          <svg
            className="h-3 w-3 flex-shrink-0 text-[#9B9A97]"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88" />
          </svg>
        </button>

        {fieldOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-black/[0.08] shadow-lg z-10">
            {SORT_FIELDS.map((field) => (
              <button
                key={field}
                onClick={() => {
                  setFieldOpen(false);
                  // Update field would require a separate handler
                }}
                className={`w-full px-3 py-2 text-left text-[14px] hover:bg-black/[0.03] first:rounded-t-md last:rounded-b-md ${
                  field === rule.field ? "bg-black/[0.06] text-[#2C2C2B]" : "text-[#5F5E59]"
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Direction Selector */}
      <div className="relative">
        <button
          onClick={() => setDirectionOpen(!directionOpen)}
          className="flex items-center gap-2 rounded-md bg-black/[0.035] px-2 h-9 text-[14px] text-[#2C2C2B] hover:bg-black/[0.05] transition-colors"
        >
          <span className="text-[#5F5E59]">
            {rule.direction === "asc" ? "Ascending" : "Descending"}
          </span>
          <svg
            className="h-3 w-3 flex-shrink-0 text-[#9B9A97]"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88" />
          </svg>
        </button>

        {directionOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-md border border-black/[0.08] shadow-lg z-10 w-max">
            <button
              onClick={() => {
                onUpdateDirection("asc");
                setDirectionOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-[14px] hover:bg-black/[0.03] rounded-t-md ${
                rule.direction === "asc" ? "bg-black/[0.06] text-[#2C2C2B]" : "text-[#5F5E59]"
              }`}
            >
              Ascending
            </button>
            <button
              onClick={() => {
                onUpdateDirection("desc");
                setDirectionOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-[14px] hover:bg-black/[0.03] rounded-b-md ${
                rule.direction === "desc" ? "bg-black/[0.06] text-[#2C2C2B]" : "text-[#5F5E59]"
              }`}
            >
              Descending
            </button>
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="flex h-9 w-9 items-center justify-center rounded-md text-[#91918E] hover:bg-black/[0.05] hover:text-[#5F5E59] transition-colors flex-shrink-0"
        aria-label="Remove sort rule"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
