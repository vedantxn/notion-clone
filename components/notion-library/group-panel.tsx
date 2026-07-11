"use client";

import { useState } from "react";
import { ChevronLeft, X, FileText, UserCircle2, Clock, Trash2, HelpCircle, Eye, EyeOff, GripVertical } from "lucide-react";

export const GROUP_OPTIONS = [
  { id: "none", label: "None" },
  { id: "page_name", label: "Page name", icon: "document" },
  { id: "created_by", label: "Created by", icon: "user-circle" },
  { id: "created_time", label: "Created time", icon: "clock" },
  { id: "last_edited_by", label: "Last edited by", icon: "user-circle" },
  { id: "last_edited_time", label: "Last edited time", icon: "clock" },
  { id: "last_visited_time", label: "Last visited time", icon: "clock" },
];

const DATE_BY_OPTIONS = [
  { id: "relative", label: "Relative" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

const SORT_ORDER_OPTIONS = {
  date: [
    { id: "oldest_first", label: "Oldest first" },
    { id: "newest_first", label: "Newest first" },
  ],
  text: [
    { id: "alphabetical", label: "Alphabetical" },
    { id: "reverse_alphabetical", label: "Reverse alphabetical" },
  ],
};

interface GroupPanelProps {
  selectedGroup: string;
  onClose: () => void;
  onGroupChange: (groupId: string) => void;

  dateBy: string;
  onDateByChange: (val: string) => void;
  sortOrder: string;
  onSortOrderChange: (val: string) => void;
  hideEmpty: boolean;
  onHideEmptyChange: (val: boolean) => void;
  hiddenGroups: string[];
  onHiddenGroupsChange: (val: string[]) => void;
}

export function GroupPanel({
  selectedGroup,
  onClose,
  onGroupChange,
  dateBy,
  onDateByChange,
  sortOrder,
  onSortOrderChange,
  hideEmpty,
  onHideEmptyChange,
  hiddenGroups,
  onHiddenGroupsChange,
}: GroupPanelProps) {
  const [view, setView] = useState<"main" | "select-property" | "date-by" | "sort">(
    selectedGroup === "none" ? "select-property" : "main"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeField = GROUP_OPTIONS.find((opt) => opt.id === selectedGroup);
  const isDateField = selectedGroup.includes("time");

  const filteredOptions = GROUP_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active list of group names based on field
  const getActiveGroups = () => {
    if (selectedGroup === "page_name") return ["N", "W", "T"];
    if (selectedGroup === "created_by" || selectedGroup === "last_edited_by") return ["Abhishek Sharma", "Alex Morgan"];
    if (isDateField) return ["Today", "Yesterday", "Older"];
    return [];
  };

  const activeGroups = getActiveGroups();

  const handleToggleGroupHidden = (groupName: string) => {
    const isHidden = hiddenGroups.includes(groupName);
    if (isHidden) {
      onHiddenGroupsChange(hiddenGroups.filter((g) => g !== groupName));
    } else {
      onHiddenGroupsChange([...hiddenGroups, groupName]);
    }
  };

  const handleHideAll = () => {
    onHiddenGroupsChange(activeGroups);
  };

  const handleShowAll = () => {
    onHiddenGroupsChange([]);
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "document":
        return <FileText className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />;
      case "user-circle":
        return <UserCircle2 className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />;
      case "clock":
        return <Clock className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />;
      default:
        return null;
    }
  };

  const renderHeader = (title: string, onBack: () => void) => (
    <div className="flex h-[52px] items-center justify-between border-b border-black/[0.06] px-4">
      <button
        onClick={onBack}
        className="flex h-6 w-6 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05] transition-colors"
        aria-label="Back"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </button>
      <h2 className="text-[14px] font-semibold text-[#37352F]">{title}</h2>
      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] text-[#5F5E59] hover:bg-black/[0.08] transition-colors"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );

  if (view === "select-property") {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
        <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08] shadow-[0_0_24px_rgba(0,0,0,0.12)]">
          {renderHeader("Group by", () => {
            if (selectedGroup !== "none") setView("main");
            else onClose();
          })}

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

          {/* Options */}
          <div className="flex-1 overflow-y-auto px-1 py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onGroupChange(option.id);
                  if (option.id === "none") {
                    onClose();
                  } else {
                    setView("main");
                  }
                }}
                className={`flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-left text-[14px] transition-colors ${
                  selectedGroup === option.id
                    ? "bg-black/[0.06] text-[#2C2C2B]"
                    : "text-[#37352F] hover:bg-black/[0.03]"
                }`}
              >
                <div className="flex h-4 w-4 items-center justify-center flex-shrink-0">
                  {getIcon(option.icon)}
                </div>
                <span className="flex-1 font-medium">{option.label}</span>
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
    );
  }

  if (view === "date-by") {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
        <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08] shadow-[0_0_24px_rgba(0,0,0,0.12)]">
          {renderHeader("Date by", () => setView("main"))}
          <div className="flex-1 overflow-y-auto px-1 py-1">
            {DATE_BY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onDateByChange(opt.id);
                  setView("main");
                }}
                className={`flex h-9 w-full items-center justify-between rounded-md px-3 text-left text-[14px] transition-colors ${
                  dateBy === opt.id
                    ? "bg-black/[0.06] text-[#2C2C2B]"
                    : "text-[#37352F] hover:bg-black/[0.03]"
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {dateBy === opt.id && (
                  <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "sort") {
    const sortOpts = isDateField ? SORT_ORDER_OPTIONS.date : SORT_ORDER_OPTIONS.text;
    return (
      <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
        <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08] shadow-[0_0_24px_rgba(0,0,0,0.12)]">
          {renderHeader("Sort", () => setView("main"))}
          <div className="flex-1 overflow-y-auto px-1 py-1">
            {sortOpts.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSortOrderChange(opt.id);
                  setView("main");
                }}
                className={`flex h-9 w-full items-center justify-between rounded-md px-3 text-left text-[14px] transition-colors ${
                  sortOrder === opt.id
                    ? "bg-black/[0.06] text-[#2C2C2B]"
                    : "text-[#37352F] hover:bg-black/[0.03]"
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {sortOrder === opt.id && (
                  <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // view === "main" (Group settings menu)
  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
      <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08] shadow-[0_0_24px_rgba(0,0,0,0.12)] select-none">
        
        {/* Header */}
        {renderHeader("Group", () => setView("select-property"))}

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          <div className="space-y-1">
            
            {/* Group By Row */}
            <button
              onClick={() => setView("select-property")}
              className="flex w-full items-center justify-between py-2 text-[14px] text-[#37352F] hover:bg-black/[0.03] rounded px-1.5 transition-colors"
            >
              <span className="font-medium">Group by</span>
              <span className="text-[#8A8985] font-normal flex items-center gap-1">
                {activeField?.label}
                <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
              </span>
            </button>

            {/* Date By Row */}
            {isDateField && (
              <button
                onClick={() => setView("date-by")}
                className="flex w-full items-center justify-between py-2 text-[14px] text-[#37352F] hover:bg-black/[0.03] rounded px-1.5 transition-colors"
              >
                <span className="font-medium">Date by</span>
                <span className="text-[#8A8985] font-normal flex items-center gap-1">
                  {DATE_BY_OPTIONS.find((o) => o.id === dateBy)?.label}
                  <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                </span>
              </button>
            )}

            {/* Sort Row */}
            <button
              onClick={() => setView("sort")}
              className="flex w-full items-center justify-between py-2 text-[14px] text-[#37352F] hover:bg-black/[0.03] rounded px-1.5 transition-colors"
            >
              <span className="font-medium">Sort</span>
              <span className="text-[#8A8985] font-normal flex items-center gap-1">
                {isDateField
                  ? SORT_ORDER_OPTIONS.date.find((o) => o.id === sortOrder)?.label
                  : SORT_ORDER_OPTIONS.text.find((o) => o.id === sortOrder)?.label || "Alphabetical"}
                <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
              </span>
            </button>

            {/* Hide Empty Switch */}
            <div className="flex w-full items-center justify-between py-2 text-[14px] text-[#37352F] px-1.5">
              <span className="font-medium">Hide empty groups</span>
              <button
                onClick={() => onHideEmptyChange(!hideEmpty)}
                className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hideEmpty ? "bg-[#2383E2]" : "bg-black/[0.15]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hideEmpty ? "translate-x-[16px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-black/[0.06]" />

          {/* Groups List Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1.5">
              <span className="text-[12px] font-semibold text-[#8A8985] uppercase tracking-wider">Groups</span>
              {hiddenGroups.length === activeGroups.length ? (
                <button onClick={handleShowAll} className="text-[12px] font-medium text-[#2383E2] hover:underline">
                  Show all
                </button>
              ) : (
                <button onClick={handleHideAll} className="text-[12px] font-medium text-[#2383E2] hover:underline">
                  Hide all
                </button>
              )}
            </div>

            <div className="space-y-0.5 px-0.5">
              {activeGroups.map((group) => {
                const isHidden = hiddenGroups.includes(group);
                return (
                  <div
                    key={group}
                    className="flex h-9 w-full items-center gap-2 rounded-md px-1.5 text-[14px] text-[#37352F] hover:bg-black/[0.02]"
                  >
                    {/* Drag Handle */}
                    {!isDateField && (
                      <div className="flex h-6 w-4 items-center justify-center text-[#B9B8B4] cursor-grab flex-shrink-0">
                        <GripVertical className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                    )}

                    {/* Icon / Avatar */}
                    {selectedGroup === "page_name" && (
                      <div className="flex h-5 w-5 items-center justify-center flex-shrink-0">
                        <FileText className="h-3.5 w-3.5 text-[#5F5E59]" strokeWidth={1.8} />
                      </div>
                    )}

                    {(selectedGroup === "created_by" || selectedGroup === "last_edited_by") && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.08] text-[#5F5E59] text-[10px] font-semibold flex-shrink-0">
                        {group[0]?.toUpperCase()}
                      </div>
                    )}

                    {/* Name */}
                    <span className="flex-1 font-medium">{group}</span>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggleGroupHidden(group)}
                      className="flex h-6 w-6 items-center justify-center rounded text-[#8A8985] hover:bg-black/[0.05] transition-colors"
                      aria-label={isHidden ? "Show group" : "Hide group"}
                    >
                      {isHidden ? (
                        <EyeOff className="h-4 w-4 text-[#8A8985]" strokeWidth={1.8} />
                      ) : (
                        <Eye className="h-4 w-4 text-[#37352F]" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-black/[0.06]" />

          {/* Footer actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onGroupChange("none");
                onClose();
              }}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
            >
              <Trash2 className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />
              <span className="font-medium">Remove grouping</span>
            </button>

            <button
              onClick={() => {
                window.open("https://www.notion.so/help/relations-and-rollups", "_blank");
              }}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />
              <span className="font-medium">Learn about grouping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
