import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";
import { captureError } from "@/lib/monitoring";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

type BrainContext = {
    summary: string;
    recentSpecs: Array<{
        template_slug: string;
        title: string | null;
        description: string | null;
        spec_json: unknown;
    }>;
};

type SuggestionInput = {
    userId: string;
    query: string;
    templateSlug?: string;
    templateCategory?: string;
};

type SuggestionOutput = {
    templateSlug: string;
    suggestedTitle: string;
    suggestedDescription: string;
    suggestedSpecJson: Record<string, unknown>;
    reasoning: string;
};

/**
 * Fetch user's brain context - their history with sheet templates
 */
export async function getUserBrainContext(userId: string): Promise<BrainContext> {
    try {
        const supabase = supabaseServer;

        // Fetch last 20 specs for this user
        const { data: specs, error: specsError } = await supabase
            .from("sheet_specs")
            .select("template_slug, title, description, spec_json, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(20);

        if (specsError) {
            throw specsError;
        }

        const specIds = (specs || []).map((s: any) => s.id).filter(Boolean);

        // Fetch feedback for those specs
        let feedbackData: any[] = [];
        if (specIds.length > 0) {
            const { data: feedback, error: feedbackError } = await supabase
                .from("sheet_feedback")
                .select("sheet_spec_id, rating, comment")
                .in("sheet_spec_id", specIds);

            if (!feedbackError) {
                feedbackData = feedback || [];
            }
        }

        // Build summary
        const templateCounts = new Map<string, number>();
        (specs || []).forEach((spec: any) => {
            const slug = spec.template_slug;
            templateCounts.set(slug, (templateCounts.get(slug) || 0) + 1);
        });

        const positiveRatings = feedbackData.filter((f) => f.rating === "up").length;
        const totalRatings = feedbackData.length;

        const topTemplates = Array.from(templateCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([slug, count]) => `${slug} (${count}x)`)
            .join(", ");

        const summary = `
User has created ${specs?.length || 0} sheets total.
Most used templates: ${topTemplates || "none yet"}.
Positive feedback: ${positiveRatings}/${totalRatings} ratings.
`.trim();

        return {
            summary,
            recentSpecs: (specs || []) as any,
        };
    } catch (error) {
        captureError(error, { context: "getUserBrainContext", userId });

        // Return empty context on error
        return {
            summary: "New user with no history",
            recentSpecs: [],
        };
    }
}

/**
 * Use AI to suggest a template and prefilled spec based on user's query and history
 */
export async function suggestTemplateAndSpec(
    input: SuggestionInput
): Promise<SuggestionOutput> {
    const { userId, query, templateSlug, templateCategory } = input;

    try {
        const brainContext = await getUserBrainContext(userId);

        const systemPrompt = `You are the AI brain for AI Sheet Builder, a tool that helps users design and generate Google Sheets.

Your job: Given a user's description of what they want to track/automate, suggest:
1. A template slug (if not provided)
2. A concrete title for their sheet
3. A description
4. A spec_json object with fields like: fields (array of field names), tabs (array of tab names), timeHorizon (string), kpis (array), etc.

Available template slugs: budget-tracker, revenue-ops, content-calendar, project-tracker, crm-pipeline, inventory-tracker.

Return ONLY valid JSON with these exact keys:
- templateSlug (string)
- suggestedTitle (string)  
- suggestedDescription (string)
- suggestedSpecJson (object with fields, tabs, timeHorizon, kpis, etc.)
- reasoning (brief string explaining your choices)`;

        const userPrompt = `User request: "${query}"

${templateSlug ? `Template context: ${templateSlug}` : ""}
${templateCategory ? `Category: ${templateCategory}` : ""}

User history summary:
${brainContext.summary}

Recent specs (for reference):
${JSON.stringify(
            brainContext.recentSpecs.slice(0, 3).map((s) => ({
                template: s.template_slug,
                title: s.title,
                description: s.description,
            })),
            null,
            2
        )}

Generate a sheet spec that matches their request and builds on their history.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const raw = response.choices[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(raw);

        return {
            templateSlug: parsed.templateSlug || templateSlug || "budget-tracker",
            suggestedTitle: parsed.suggestedTitle || "Untitled Sheet",
            suggestedDescription: parsed.suggestedDescription || "",
            suggestedSpecJson: parsed.suggestedSpecJson || {},
            reasoning: parsed.reasoning || "AI-generated suggestion",
        };
    } catch (error) {
        captureError(error, {
            context: "suggestTemplateAndSpec",
            userId,
            query: query.substring(0, 100),
        });

        throw new Error("Failed to generate AI suggestion");
    }
}
