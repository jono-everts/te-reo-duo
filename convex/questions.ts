import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMultipleChoice = mutation({
  args: {
    type: v.literal("multiple_choice"),
    difficulty: v.number(),
    topic: v.string(),
    prompt: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questions", args);
  },
});

export const addArrangeWords = mutation({
  args: {
    type: v.literal("arrange_words"),
    difficulty: v.number(),
    topic: v.string(),
    correctSentence: v.string(),
    words: v.array(v.string()),
    correctOrder: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questions", args);
  },
});

export const addMatchPairs = mutation({
  args: {
    type: v.literal("match_pairs"),
    difficulty: v.number(),
    topic: v.string(),
    pairs: v.array(v.object({ teReo: v.string(), english: v.string() })),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questions", args);
  },
});

export const getRandomQuestion = query({
  args: { seed: v.number(), previousIndex: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const questions = await ctx.db.query("questions").collect();
    if (questions.length === 0) return null;
    let index = Math.abs(args.seed) % questions.length;
    if (index === args.previousIndex && questions.length > 1) {
      index = (index + 1) % questions.length;
    }
    return { ...questions[index], _index: index };
  },
});
