import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
}

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
}

const supabaseAdmin: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: { persistSession: false },
    }
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type SheetColumnType =
    | "text"
    | "number"
    | "currency"
    | "date"
    | "datetime"
    | "boolean"
    | "formula"
    | "category";

export interface SheetColumn {
    name: string;
    type: SheetColumnType;
    description?: string;
    formula?: string;
    required?: boolean;
}

export interface SheetTab {
    name: string;
    kind?: "data" | "summary" | "dashboard";
    description?: string;
    primary?: boolean;
    columns?: SheetColumn[];
    summary_logic?: string;
}

export interface SheetSpec {
    title: string;
    category?: string | null;
    tags?: string[];
    sheets: SheetTab[];
    notes?: string;
}

export interface GeneratedSheetResult {
    requestId: string;
    specId: string;
    spec: SheetSpec;
}

/**
 * Log a sheet request into sheet_requests table.
 * userId can be null for now; later you can pass real user_id.
 */
export async function logSheetRequest(params: {
    userId?: string | null;
    prompt: string;
    category?: string | null;
}): Promise<string> {
    const { userId = null, prompt, category = null } = params;

    const { data, error } = await supabaseAdmin
        .from("sheet_requests")
        .insert({
            user_id: userId,
            raw_prompt: prompt,
            requested_category: category,
        })
        .select("id")
        .single();

    if (error || !data?.id) {
        console.error("[sheetBrain] Failed to log sheet request", error);
        throw new Error("Failed to log sheet request");
    }

    return data.id as string;
}

/**
 * Fetch up to N recent sheet specs with the same category
 * to use as examples in the prompt.
 */
export async function getRecentSpecsByCategory(params: {
    category?: string | null;
    limit?: number;
}): Promise<SheetSpec[]> {
    const { category = null, limit = 3 } = params;

    const query = supabaseAdmin
        .from("sheet_specs")
        .select("spec_json")
        .order("created_at", { ascending: false })
        .limit(limit);

    const { data, error } =
        category && category.trim().length > 0
            ? await query.eq("sheet_category", category)
            : await query;

    if (error) {
        console.error("[sheetBrain] Failed to fetch example specs", error);
        return [];
    }

    const specs: SheetSpec[] =
        (data ?? [])
            .map((row: any) => row.spec_json)
            .filter(Boolean) || [];

    return specs;
}

/**
 * Ask OpenAI to generate a normalized SheetSpec JSON
 * using the user prompt + a few past examples.
 */
export async function generateSheetSpecWithOpenAI(params: {
    prompt: string;
    category?: string | null;
}): Promise<SheetSpec> {
    const { prompt, category = null } = params;

    const exampleSpecs = await getRecentSpecsByCategory({ category, limit: 3 });

    const schema: any =
    {
        name: "sheet_spec",
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                title: { type: "string" },
                category: { type: "string" },
                tags: {
                    type: "array",
                    items: { type: "string" },
                },
                notes: { type: "string" },
                sheets: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            name: { type: "string" },
                            kind: {
                                type: "string",
                                enum: ["data", "summary", "dashboard"],
                            },
                            description: { type: "string" },
                            primary: { type: "boolean" },
                            summary_logic: { type: "string" },
                            columns: {
                                type: "array",
                                items: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        name: { type: "string" },
                                        type: {
                                            type: "string",
                                            enum: [
                                                "text",
                                                "number",
                                                "currency",
                                                "date",
                                                "datetime",
                                                "boolean",
                                                "formula",
                                                "category",
                                            ],
                                        },
                                        description: { type: "string" },
                                        formula: { type: "string" },
                                        required: { type: "boolean" },
                                    },
                                    required: ["name", "type"],
                                },
                            },
                        },
                        required: ["name"],
                    },
                },
            },
            required: ["title", "sheets"],
        },
        strict: true,
    };

    const systemPrompt = `
You are a senior Google Sheets architect for a product called "AI Sheet Builder".

Your job:
- Read a natural language prompt from a user
- Design a clear, normalized sheet specification in JSON
- Prefer simple, robust formulas over complex or fragile ones
- Include at least one summary or dashboard sheet when it makes sense
- Use professional naming for sheets and columns

Output MUST follow the JSON schema exactly.
Do NOT include any free-form commentary. Only valid JSON.
  `.trim();

    const exampleSpecsText =
        exampleSpecs.length > 0
            ? JSON.stringify(exampleSpecs.slice(0, 3), null, 2)
            : "[]";

    const userPrompt = `
User request:
${prompt}

Requested category (can be null): ${category ?? "null"}

Here are up to 3 previous sheet specs for inspiration (you may reuse patterns, but adapt them to this user):
${exampleSpecsText}
  `.trim();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: {
            type: "json_schema",
            json_schema: schema,
        },
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error("OpenAI did not return a sheet spec");
    }

    let parsed: SheetSpec;
    try {
        parsed = JSON.parse(content) as SheetSpec;
    } catch (err) {
        console.error("[sheetBrain] Failed to parse OpenAI JSON", err, content);
        throw new Error("Failed to parse OpenAI response as JSON");
    }

    // Basic normalization
    if (!parsed.category && category) {
        parsed.category = category;
    }
    if (!parsed.tags) {
        parsed.tags = [];
    }
    if (!Array.isArray(parsed.sheets)) {
        parsed.sheets = [];
    }

    return parsed;
}

/**
 * Save the generated spec into sheet_specs table.
 */
export async function saveGeneratedSheetSpec(params: {
    requestId: string;
    userId?: string | null;
    spec: SheetSpec;
}): Promise<string> {
    const { requestId, userId = null, spec } = params;

    const { data, error } = await supabaseAdmin
        .from("sheet_specs")
        .insert({
            request_id: requestId,
            user_id: userId,
            sheet_title: spec.title,
            sheet_category: spec.category ?? null,
            sheet_tags: spec.tags ?? [],
            spec_json: spec,
        })
        .select("id")
        .single();

    if (error || !data?.id) {
        console.error("[sheetBrain] Failed to save sheet spec", error);
        throw new Error("Failed to save sheet spec");
    }

    return data.id as string;
}

/**
 * Full pipeline: log request → call OpenAI → store spec → return result.
 * userId can be wired later when auth is fully integrated.
 */
export async function generateAndStoreSheetSpec(params: {
    prompt: string;
    category?: string | null;
    userId?: string | null;
}): Promise<GeneratedSheetResult> {
    const { prompt, category = null, userId = null } = params;

    const requestId = await logSheetRequest({
        prompt,
        category,
        userId,
    });

    const spec = await generateSheetSpecWithOpenAI({
        prompt,
        category,
    });

    const specId = await saveGeneratedSheetSpec({
        requestId,
        userId,
        spec,
    });

    return {
        requestId,
        specId,
        spec,
    };
}
