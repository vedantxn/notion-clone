"use client";

import { useState } from "react";
import { ChevronLeft, X, Plus, RotateCcw, MoreHorizontal, FileText, ChevronDown, Trash2, User, Globe, SlidersHorizontal, Clock } from "lucide-react";

export type FilterRule = 
  | {
      type: "simple";
      id: string;
      field: "title" | "source" | "createdBy" | "lastEdited" | "lastVisited";
      operator: "contains" | "does_not_contain" | "is_empty" | "is_not_empty";
      value: string;
    }
  | {
      type: "advanced";
      id: string;
      conjunction: "and" | "or";
      rules: {
        id: string;
        field: "title" | "source" | "createdBy" | "lastEdited" | "lastVisited";
        operator: "contains" | "does_not_contain" | "is_empty" | "is_not_empty";
        value: string;
      }[];
    };

export const FILTER_FIELDS = [
  { value: "title", label: "Page name", icon: FileText },
  { value: "source", label: "Source", icon: Globe },
  { value: "createdBy", label: "Created by", icon: User },
  { value: "lastEdited", label: "Last edited time", icon: Clock },
  { value: "lastVisited", label: "Last visited time", icon: Clock },
];

const OPERATORS = [
  { value: "contains", label: "Contains" },
  { value: "does_not_contain", label: "does not contain" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
];

interface FilterPanelProps {
  filterRules: FilterRule[];
  onClose: () => void;
  onAddFilter: (rule: FilterRule) => void;
  onRemoveFilter: (id: string) => void;
  onUpdateFilter: (id: string, updates: Partial<FilterRule>) => void;
  onResetFilters: () => void;
  onAddAdvancedFilter?: () => void;
}

export function FilterPanel({
  filterRules,
  onClose,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter,
  onResetFilters,
  onAddAdvancedFilter,
}: FilterPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    filterRules.length > 0 ? filterRules[filterRules.length - 1].id : null
  );
  // Controls which advanced filter group card is open
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleAddDefaultFilter = () => {
    const newRule: FilterRule = {
      type: "simple",
      id: Date.now().toString(),
      field: "title",
      operator: "contains",
      value: "",
    };
    onAddFilter(newRule);
    setExpandedId(newRule.id);
    setActiveCardId(null);
  };

  const handleAddAdvancedFilterClick = () => {
    if (onAddAdvancedFilter) {
      onAddAdvancedFilter();
    } else {
      const newRule: FilterRule = {
        type: "advanced",
        id: Date.now().toString(),
        conjunction: "and",
        rules: [
          {
            id: Date.now().toString() + "-nested",
            field: "title",
            operator: "contains",
            value: "",
          }
        ]
      };
      onAddFilter(newRule);
      setActiveCardId(newRule.id);
      setExpandedId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 animate-fade-in">
      <div className="fixed bottom-0 right-0 top-0 w-[380px] flex flex-col bg-white border-l border-black/[0.08] shadow-[0_0_24px_rgba(0,0,0,0.12)]">
        
        {/* Header */}
        <div className="flex h-[52px] items-center justify-between border-b border-black/[0.06] px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05] transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <h2 className="text-[14px] font-semibold text-[#37352F]">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] text-[#5F5E59] hover:bg-black/[0.08] transition-colors"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filterRules.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[200px]">
              <span className="text-[14px] text-[#7D7A75]">No filters applied to this view</span>
            </div>
          ) : (
            <div className="py-2 space-y-1">
              {filterRules.map((rule) => {
                if (rule.type === "simple") {
                  const isExpanded = expandedId === rule.id;
                  return (
                    <FilterRuleItem
                      key={rule.id}
                      rule={rule}
                      isExpanded={isExpanded}
                      onToggleExpand={() => {
                        setExpandedId(isExpanded ? null : rule.id);
                        setActiveCardId(null);
                      }}
                      onUpdateField={(field) => onUpdateFilter(rule.id, { field })}
                      onUpdateOperator={(operator) => onUpdateFilter(rule.id, { operator })}
                      onUpdateValue={(value) => onUpdateFilter(rule.id, { value })}
                      onRemove={() => {
                        onRemoveFilter(rule.id);
                        if (expandedId === rule.id) setExpandedId(null);
                      }}
                      onConvertToAdvanced={() => {
                        onUpdateFilter(rule.id, {
                          type: "advanced",
                          conjunction: "and",
                          rules: [
                            {
                              id: Date.now().toString() + "-nested",
                              field: rule.field,
                              operator: rule.operator,
                              value: rule.value,
                            }
                          ]
                        });
                        setActiveCardId(rule.id);
                        setExpandedId(null);
                      }}
                    />
                  );
                } else {
                  // Advanced group filter
                  const isCardOpen = activeCardId === rule.id;
                  return (
                    <AdvancedFilterItem
                      key={rule.id}
                      rule={rule}
                      isCardOpen={isCardOpen}
                      onToggleCard={() => {
                        setActiveCardId(isCardOpen ? null : rule.id);
                        setExpandedId(null);
                      }}
                      onCloseCard={() => setActiveCardId(null)}
                      onUpdateRule={(updatedRules) => onUpdateFilter(rule.id, { rules: updatedRules })}
                      onRemove={() => {
                        onRemoveFilter(rule.id);
                        if (activeCardId === rule.id) setActiveCardId(null);
                      }}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-black/[0.06] p-3 space-y-1 bg-white">
          <button
            onClick={handleAddDefaultFilter}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
            <span>Add filter</span>
          </button>

          <button
            onClick={handleAddAdvancedFilterClick}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
            <span>Add advanced filter</span>
          </button>

          <div className="h-[1px] bg-black/[0.06] my-2" />

          <button
            onClick={() => {
              onResetFilters();
              setExpandedId(null);
              setActiveCardId(null);
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
            <span>Reset filters</span>
          </button>

          <button
            onClick={() => {}}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
            <span>More options</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple rule item component
function FilterRuleItem({
  rule,
  isExpanded,
  onToggleExpand,
  onUpdateField,
  onUpdateOperator,
  onUpdateValue,
  onRemove,
  onConvertToAdvanced,
}: {
  rule: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateField: (field: any) => void;
  onUpdateOperator: (operator: any) => void;
  onUpdateValue: (value: string) => void;
  onRemove: () => void;
  onConvertToAdvanced: () => void;
}) {
  const [fieldMenuOpen, setFieldMenuOpen] = useState(false);
  const [opMenuOpen, setOpMenuOpen] = useState(false);
  const [optsMenuOpen, setOptsMenuOpen] = useState(false);

  const activeField = FILTER_FIELDS.find((f) => f.value === rule.field) || FILTER_FIELDS[0];
  const FieldIcon = activeField.icon;

  const activeOp = OPERATORS.find((op) => op.value === rule.operator) || OPERATORS[0];
  const hasValueInput = rule.operator !== "is_empty" && rule.operator !== "is_not_empty";

  const isDirty = rule.value.length > 0;

  return (
    <div className="flex flex-col gap-1.5 px-3 py-1.5 select-none hover:bg-black/[0.01]">
      <div className="flex items-center gap-2">
        {/* Grip Handle */}
        <div className="flex h-7 w-6 items-center justify-center text-[#91918E] flex-shrink-0 cursor-grab">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M6.25 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m1.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m6.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 16a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0" />
          </svg>
        </div>

        {/* Field Button */}
        <div className="relative">
          <button
            onClick={() => setFieldMenuOpen(!fieldMenuOpen)}
            className="flex items-center gap-1.5 px-2 h-7 rounded-[4px] bg-black/[0.04] hover:bg-black/[0.08] active:bg-black/[0.12] text-[14px] text-[#37352F] transition-colors relative"
          >
            <FieldIcon className="h-3.5 w-3.5 text-[#7D7A75]" strokeWidth={1.8} />
            <span className="font-normal">{activeField.label}</span>
            <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#E28026] ml-0.5" />
            )}
          </button>

          {fieldMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setFieldMenuOpen(false)} />
              <div className="absolute left-0 top-8 z-40 min-w-[140px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                {FILTER_FIELDS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      onUpdateField(f.value);
                      setFieldMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[14px] text-[#37352F] hover:bg-black/[0.05]"
                  >
                    <f.icon className="h-3.5 w-3.5 text-[#7D7A75]" />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onToggleExpand}
          className="ml-auto text-[12px] text-[#8A8985] hover:text-[#37352F] px-1.5 py-0.5 rounded hover:bg-black/[0.04] transition-colors"
        >
          {isExpanded ? "Collapse" : "Configure"}
        </button>
      </div>

      {isExpanded && (
        <div className="ml-8 mr-3 rounded-lg border border-black/[0.08] bg-[#F7F7F5] p-2.5 space-y-2 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setOpMenuOpen(!opMenuOpen)}
                className="flex items-center gap-1 px-2 h-6 rounded hover:bg-black/[0.05] text-[13px] font-medium text-[#37352F] transition-colors"
              >
                <span>{activeField.label} {activeOp.label}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
              </button>

              {opMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpMenuOpen(false)} />
                  <div className="absolute left-0 top-7 z-40 min-w-[160px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                    {OPERATORS.map((op) => (
                      <button
                        key={op.value}
                        onClick={() => {
                          onUpdateOperator(op.value);
                          setOpMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05]"
                      >
                        <span>{op.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOptsMenuOpen(!optsMenuOpen)}
                className="flex h-6 w-6 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {optsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOptsMenuOpen(false)} />
                  <div className="absolute right-0 top-7 z-40 min-w-[180px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                    <button
                      onClick={() => {
                        onRemove();
                        setOptsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05]"
                    >
                      <Trash2 className="h-4 w-4 text-[#5F5E59]" />
                      <span>Delete filter</span>
                    </button>
                    <button
                      onClick={() => {
                        onConvertToAdvanced();
                        setOptsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05]"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-[#5F5E59]" />
                      <span>Add to advanced filter</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {hasValueInput && (
            <div className="relative w-full">
              <input
                type="text"
                value={rule.value}
                onChange={(e) => onUpdateValue(e.target.value)}
                placeholder={rule.field === "createdBy" ? "Search for one or more people..." : "Type a value..."}
                className="w-full h-8 px-2.5 rounded border border-black/[0.12] bg-white text-[14px] text-[#2C2C2B] placeholder:text-[#9B9A97] focus:outline-none focus:border-[#2383E2] focus:ring-[3px] focus:ring-[#2383E2]/15 transition-all"
              />
              {rule.field === "createdBy" && rule.value === "" && (
                <div className="mt-1.5 rounded-lg border border-black/[0.08] bg-white p-1.5 space-y-1 shadow-md">
                  <div className="px-2 py-0.5 text-[11px] font-semibold text-[#8A8985]">Me</div>
                  <button
                    onClick={() => onUpdateValue("Abhishek Sharma")}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05] transition-colors"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E28026] text-white text-[10px] font-semibold">
                      A
                    </div>
                    <span className="font-medium">Abhishek Sharma</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Advanced rule item component (filter groups)
function AdvancedFilterItem({
  rule,
  isCardOpen,
  onToggleCard,
  onCloseCard,
  onUpdateRule,
  onRemove,
}: {
  rule: any;
  isCardOpen: boolean;
  onToggleCard: () => void;
  onCloseCard: () => void;
  onUpdateRule: (updatedRules: any[]) => void;
  onRemove: () => void;
}) {
  // Select active field/operator lists for dropdowns
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<{ type: "field" | "operator" | "nested-opts"; index: number } | null>(null);

  // Check if any rules in group contain search values (dirty)
  const isDirty = rule.rules.some((r: any) => r.value.length > 0);

  const handleUpdateNestedRule = (nestedId: string, fieldName: string, val: any) => {
    const updated = rule.rules.map((r: any) => {
      if (r.id === nestedId) {
        return { ...r, [fieldName]: val };
      }
      return r;
    });
    onUpdateRule(updated);
  };

  const handleAddNestedRule = () => {
    const newNested = {
      id: Date.now().toString() + "-nested",
      field: "title" as const,
      operator: "contains" as const,
      value: "",
    };
    onUpdateRule([...rule.rules, newNested]);
  };

  const handleRemoveNestedRule = (nestedId: string) => {
    const updated = rule.rules.filter((r: any) => r.id !== nestedId);
    if (updated.length === 0) {
      onRemove();
    } else {
      onUpdateRule(updated);
    }
  };

  return (
    <div className="relative flex flex-col gap-1.5 px-3 py-1.5 select-none">
      <div className="flex items-center gap-2">
        {/* Grip Handle */}
        <div className="flex h-7 w-6 items-center justify-center text-[#91918E] flex-shrink-0 cursor-grab">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M6.25 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m1.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m6.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 16a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0" />
          </svg>
        </div>

        {/* Rule Group pill (blue themed) */}
        <button
          onClick={onToggleCard}
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-[#E2F0FD] hover:bg-[#D5EAFD] text-[#2383E2] text-[13.5px] font-semibold transition-colors relative"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{rule.rules.length} {rule.rules.length === 1 ? "rule" : "rules"}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#2383E2]" strokeWidth={2.5} />
          
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E28026] ml-0.5" />
          )}
        </button>
      </div>

      {/* Advanced Filter Card Popup */}
      {isCardOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onCloseCard} />
          <div className="absolute left-9 top-9 z-40 w-[335px] rounded-lg border border-black/[0.08] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] p-2.5 space-y-2.5 animate-slide-down">
            
            {/* Rules list in group */}
            <div className="space-y-2">
              {rule.rules.map((nested: any, idx: number) => {
                const activeFld = FILTER_FIELDS.find(f => f.value === nested.field) || FILTER_FIELDS[0];
                const FldIcon = activeFld.icon;
                const activeOpr = OPERATORS.find(op => op.value === nested.operator) || OPERATORS[0];
                const inputNeeded = nested.operator !== "is_empty" && nested.operator !== "is_not_empty";

                return (
                  <div key={nested.id} className="flex items-center gap-1.5">
                    {/* Prefix label */}
                    <span className="text-[12px] font-semibold text-[#8A8985] w-[42px] text-right pr-1 flex-shrink-0">
                      {idx === 0 ? "Where" : "And"}
                    </span>

                    {/* Field selector */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownIndex(activeDropdownIndex?.type === "field" && activeDropdownIndex.index === idx ? null : { type: "field", index: idx })}
                        className="flex items-center gap-1 h-7 px-1.5 rounded border border-black/[0.08] bg-black/[0.02] text-[13px] font-normal hover:bg-black/[0.06] transition-colors"
                      >
                        <FldIcon className="h-3.5 w-3.5 text-[#7D7A75]" />
                        <span className="truncate max-w-[70px]">{activeFld.label}</span>
                        <ChevronDown className="h-3 w-3 text-[#9B9A97]" />
                      </button>

                      {activeDropdownIndex?.type === "field" && activeDropdownIndex.index === idx && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownIndex(null)} />
                          <div className="absolute left-0 top-8 z-50 min-w-[130px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                            {FILTER_FIELDS.map((f) => (
                              <button
                                key={f.value}
                                onClick={() => {
                                  handleUpdateNestedRule(nested.id, "field", f.value);
                                  setActiveDropdownIndex(null);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05]"
                              >
                                <f.icon className="h-3.5 w-3.5 text-[#7D7A75]" />
                                <span>{f.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Operator selector */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownIndex(activeDropdownIndex?.type === "operator" && activeDropdownIndex.index === idx ? null : { type: "operator", index: idx })}
                        className="flex items-center gap-1 h-7 px-1.5 rounded border border-black/[0.08] bg-black/[0.02] text-[13px] font-normal hover:bg-black/[0.06] transition-colors"
                      >
                        <span className="truncate max-w-[65px]">{activeOpr.label}</span>
                        <ChevronDown className="h-3 w-3 text-[#9B9A97]" />
                      </button>

                      {activeDropdownIndex?.type === "operator" && activeDropdownIndex.index === idx && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownIndex(null)} />
                          <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                            {OPERATORS.map((op) => (
                              <button
                                key={op.value}
                                onClick={() => {
                                  handleUpdateNestedRule(nested.id, "operator", op.value);
                                  setActiveDropdownIndex(null);
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05]"
                              >
                                <span>{op.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Input box */}
                    {inputNeeded ? (
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={nested.value}
                          onChange={(e) => handleUpdateNestedRule(nested.id, "value", e.target.value)}
                          placeholder={nested.field === "createdBy" ? "Search for one or more people..." : "Value"}
                          className="w-full h-7 px-2 rounded border border-black/[0.10] bg-white text-[13px] text-[#2C2C2B] placeholder:text-[#9B9A97] focus:outline-none focus:border-[#2383E2] focus:ring-[3px] focus:ring-[#2383E2]/15 transition-all"
                        />
                        {nested.field === "createdBy" && nested.value === "" && (
                          <div className="absolute left-0 top-8 z-50 w-full rounded-lg border border-black/[0.08] bg-white shadow-lg p-1.5 space-y-1">
                            <div className="px-2 py-0.5 text-[10px] font-semibold text-[#8A8985]">Me</div>
                            <button
                              onClick={() => handleUpdateNestedRule(nested.id, "value", "Abhishek Sharma")}
                              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-[#37352F] hover:bg-black/[0.05] transition-colors"
                            >
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E28026] text-white text-[10px] font-semibold">
                                A
                              </div>
                              <span className="font-medium">Abhishek Sharma</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 h-7 bg-black/[0.02] border border-black/[0.04] rounded" />
                    )}

                    {/* Three-dots menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownIndex(activeDropdownIndex?.type === "nested-opts" && activeDropdownIndex.index === idx ? null : { type: "nested-opts", index: idx })}
                        className="flex h-7 w-6 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05] flex-shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {activeDropdownIndex?.type === "nested-opts" && activeDropdownIndex.index === idx && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownIndex(null)} />
                          <div className="absolute right-0 top-8 z-50 min-w-[120px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-lg">
                            <button
                              onClick={() => {
                                handleRemoveNestedRule(nested.id);
                                setActiveDropdownIndex(null);
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-[#EB5757] hover:bg-[#EB5757]/[0.06]"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-[#EB5757]" />
                              <span>Delete filter</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add rule to group */}
            <div className="pl-[48px]">
              <button
                onClick={handleAddNestedRule}
                className="flex h-7 items-center gap-1.5 rounded px-1.5 text-left text-[13px] font-medium text-[#7D7A75] hover:bg-black/[0.04] hover:text-[#37352F] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add filter rule</span>
                <ChevronDown className="h-3 w-3 text-[#9B9A97]" />
              </button>
            </div>

            <div className="h-[1px] bg-black/[0.06] my-2" />

            {/* Delete entire group */}
            <button
              onClick={() => {
                onRemove();
                onCloseCard();
              }}
              className="flex h-7 w-full items-center gap-2 rounded px-1.5 text-left text-[13px] text-[#EB5757] hover:bg-[#EB5757]/[0.06] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete filter</span>
            </button>

          </div>
        </>
      )}
    </div>
  );
}
