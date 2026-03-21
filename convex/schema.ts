import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable(
    v.union(
      v.object({
        type: v.literal("multiple_choice"),
        difficulty: v.number(),
        topic: v.string(),
        prompt: v.string(),
        options: v.array(v.string()),
        correctIndex: v.number(),
      }),
      v.object({
        type: v.literal("arrange_words"),
        difficulty: v.number(),
        topic: v.string(),
        prompt: v.string(),
        correctSentence: v.string(),
        words: v.array(v.string()),
        correctOrder: v.array(v.number()),
      }),
      v.object({
        type: v.literal("match_pairs"),
        difficulty: v.number(),
        topic: v.string(),
        pairs: v.array(v.object({ teReo: v.string(), english: v.string() })),
      }),
    ),
  ),
});
