import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const saveAnalysis = mutationGeneric({
  args: {
    userId: v.string(),
    audioFileName: v.optional(v.string()),
    audioFileSize: v.optional(v.number()),
    audioUrl: v.optional(v.string()),
    analysis: v.any(),
  },
  handler: async (ctx, args) => {
    // Check for a very recent duplicate submission (same user + filename/size/url within ~5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recent = await ctx.db
      .query("analyses")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    const existing = recent.find((r) => {
      if (r.createdAt < fiveMinutesAgo) return false;
      const sameName = (r.audioFileName || "") === (args.audioFileName || "");
      const sameSize = (r.audioFileSize || 0) === (args.audioFileSize || 0);
      const sameUrl = (r.audioUrl || "") === (args.audioUrl || "");
      return sameName && sameSize && sameUrl;
    });

    if (existing) {
      return { id: existing._id };
    }

    const doc = {
      userId: args.userId,
      audioFileName: args.audioFileName,
      audioFileSize: args.audioFileSize,
      audioUrl: args.audioUrl,
      analysis: args.analysis,
      createdAt: Date.now(),
    };
    const id = await ctx.db.insert("analyses", doc);
    return { id };
  },
});

export const getAnalyses = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("analyses")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
    return results;
  },
});

export const getAnalysisById = queryGeneric({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    return doc;
  },
});


