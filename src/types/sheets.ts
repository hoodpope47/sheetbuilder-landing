// ======================================================
// FILE: src/types/sheets.ts
// Canonical "sheet spec" schema for AI-generated sheets
// ======================================================

/**
 * High-level category of a tab.
 * - "data"    → raw input rows
 * - "summary" → rollups, KPIs, dashboards
 * - "config"  → settings, lookup values, assumptions
 * - "lookup"  → reference tables (e.g. products, regions)
 * - "dashboard" → visual overview with charts & KPIs
 */
export type SheetTabType = "data" | "summary" | "config" | "lookup" | "dashboard";

/**
 * Core data type for each column.
 * "formula" means the cell value is driven by a formula template.
 */
export type ColumnType =
    | "text"
    | "number"
    | "integer"
    | "currency"
    | "percentage"
    | "date"
    | "datetime"
    | "boolean"
    | "formula"
    | "enum"
    | "lookup";

/**
 * Simple validation rule model.
 * This can be expanded later, but keeps things structured.
 */
export type ValidationKind =
    | "none"
    | "number_range"
    | "one_of"
    | "non_empty"
    | "email"
    | "url"
    | "custom_formula";

export interface ValidationRule {
    kind: ValidationKind;
    /**
     * Optional human-readable message, e.g. "Must be between 0 and 100".
     */
    message?: string;
    /**
     * For number_range: [min, max]
     * For one_of:       list of allowed values
     * For custom_formula: formula string like "=ISNUMBER(A2)"
     */
    args?: number[] | string[] | string | null;
}

/**
 * Basic conditional formatting rule.
 * This is intentionally simple to start; we can enrich it later.
 */
export type ConditionalFormatKind =
    | "greater_than"
    | "less_than"
    | "equals"
    | "not_equals"
    | "between"
    | "text_contains"
    | "is_blank"
    | "is_not_blank"
    | "custom_formula";

export interface ConditionalFormatRule {
    kind: ConditionalFormatKind;
    /**
     * Range selector within the tab (e.g. "D2:D100").
     * The renderer can interpret this and apply it via Sheets API.
     */
    range?: string;
    /**
     * Values / thresholds for the rule.
     * e.g. ["0"] for greater_than, ["0", "100"] for between, etc.
     */
    args?: string[] | null;
    /**
     * Simple styling for matched cells.
     */
    style?: {
        backgroundColor?: string; // hex or named color
        textColor?: string;
        bold?: boolean;
        italic?: boolean;
    };
}

/**
 * How a column should be formatted visually.
 */
export interface ColumnFormat {
    numberFormat?:
    | "plain"
    | "number"
    | "integer"
    | "currency"
    | "percentage"
    | "date"
    | "datetime"
    | "time"
    | "duration";
    /**
     * More specific pattern, e.g. "MM/dd/yyyy" or "$#,##0.00"
     */
    pattern?: string;
    align?: "left" | "center" | "right";
    /**
     * Optional color for header cells like "#0f172a" or named.
     */
    headerBackgroundColor?: string;
    headerTextColor?: string;
}

/**
 * Single column definition inside a tab.
 *
 * `key` is an internal, stable identifier (snake_case or camelCase)
 * that your code can rely on across versions, independent of the
 * human-visible `name`.
 */
export interface SheetColumn {
    /**
     * Internal unique ID within the spec, e.g. "col_sales_amount".
     */
    id: string;
    /**
     * Human-facing label for the column header (e.g. "Revenue").
     */
    name: string;
    /**
     * Stable machine-friendly key (e.g. "revenue", "created_at").
     */
    key: string;
    /**
     * Short explanation of the column for tooltips/docs.
     */
    description?: string;
    type: ColumnType;
    required?: boolean;
    /**
     * For enum / lookup types, this can list allowed values.
     */
    allowedValues?: string[];
    /**
     * For formula columns, the base formula for the first data row (e.g. "=D2-E2").
     * The renderer can auto-fill downwards.
     */
    formulaTemplate?: string;
    /**
     * Example of the formula in context, purely for debugging / docs.
     */
    exampleFormula?: string;
    /**
     * Default value to put in the column when a row is created.
     */
    defaultValue?: string | number | boolean | null;
    validation?: ValidationRule | null;
    format?: ColumnFormat;
    /**
     * Conditional formatting rules tied to this column.
     */
    conditionalFormats?: ConditionalFormatRule[];
}

/**
 * Basic chart types your engine can support.
 */
export type ChartType =
    | "line"
    | "bar"
    | "column"
    | "area"
    | "pie"
    | "donut"
    | "scatter";

export type AggregationKind = "sum" | "avg" | "min" | "max" | "count";

/**
 * How a single data series in a chart is defined.
 */
export interface ChartSeries {
    label: string;
    /**
     * Column key from the source tab, e.g. "revenue".
     */
    columnKey: string;
    /**
     * Optional aggregation to apply when summarizing rows.
     */
    aggregation?: AggregationKind;
}

/**
 * High-level chart specification linked to a tab’s data.
 */
export interface ChartSpec {
    id: string;
    title: string;
    type: ChartType;
    /**
     * Which tab the chart reads from.
     */
    sourceTabId: string;
    /**
     * Column key used for the x-axis (e.g. "date", "week", "category").
     */
    xAxisKey?: string;
    /**
     * One or more data series.
     */
    series: ChartSeries[];
    /**
     * Optional layout info (approximate position & size).
     * The concrete renderer can interpret this however it wants.
     */
    layout?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };
}

/**
 * Single tab (sheet) definition inside the workbook.
 */
export interface SheetTab {
    id: string;
    name: string;
    type: SheetTabType;
    /**
     * Short description of what this tab is for.
     */
    purpose?: string;
    /**
     * For summary/dashboard tabs, which tab(s) they summarize.
     */
    sources?: string[]; // list of tab IDs
    /**
     * Columns in this tab (for "data" or "config" types).
     */
    columns?: SheetColumn[];
    /**
     * Charts attached to this tab (for summary/dashboard tabs).
     */
    charts?: ChartSpec[];
    /**
     * How many top rows should be frozen (usually 1 for headers).
     */
    frozenHeaderRows?: number;
    /**
     * Notes for the tab (could be used to insert a note or comment).
     */
    notes?: string;
}

/**
 * Top-level spec for the entire Google Sheet "design".
 */
export interface SheetSpec {
    /**
     * Internal ID for the spec. This can later be linked to Supabase
     * rows (e.g. generated_sheets.id).
     */
    id: string;
    /**
     * Human-facing title (e.g. "Side Hustle Sales Tracker").
     */
    title: string;
    /**
     * Brief description of the use case.
     */
    useCase?: string;
    /**
     * e.g. "en", "es", "en-US"
     */
    language?: string;
    /**
     * e.g. "USD", "EUR"
     */
    currencyCode?: string;
    /**
     * e.g. "en-US", "es-ES"
     */
    locale?: string;
    /**
     * High-level tags used for retrieval / categorization
     * (e.g. ["sales", "pipeline", "crm"]).
     */
    tags?: string[];
    /**
     * Version for this spec. You can bump this whenever you revise templates.
     */
    version: string;
    /**
     * ISO timestamp strings.
     */
    createdAt: string;
    updatedAt: string;
    /**
     * Where this spec came from.
     * - "ai"           → generated on-the-fly from a user prompt
     * - "template"     → came from a curated template
     * - "user_migrated"→ imported from an existing sheet
     */
    source: "ai" | "template" | "user_migrated";
    /**
     * Core set of tabs (worksheets) in this design.
     */
    tabs: SheetTab[];
    /**
     * Raw user request this spec was generated from.
     * Optional, but great for debugging and retrieval.
     */
    originalPrompt?: string;
    /**
     * Free-form metadata for future expansion (e.g. `plan`, `industry`, etc.).
     */
    metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Convenience helper for creating a minimal new SheetSpec.
 * You can use this when wiring OpenAI in step 2.
 */
export function createEmptySheetSpec(params: {
    id: string;
    title: string;
    source: SheetSpec["source"];
    useCase?: string;
    originalPrompt?: string;
}): SheetSpec {
    const now = new Date().toISOString();

    return {
        id: params.id,
        title: params.title,
        useCase: params.useCase,
        language: "en",
        currencyCode: "USD",
        locale: "en-US",
        tags: [],
        version: "1.0.0",
        createdAt: now,
        updatedAt: now,
        source: params.source,
        tabs: [],
        originalPrompt: params.originalPrompt,
        metadata: {},
    };
}
