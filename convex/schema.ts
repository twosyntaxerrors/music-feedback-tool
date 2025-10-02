import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analyses: defineTable({
    userId: v.string(),
    audioFileName: v.optional(v.string()),
    audioFileSize: v.optional(v.number()),
    audioUrl: v.optional(v.string()),
    analysis: v.any(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_user_created", ["userId", "createdAt"]),
});



