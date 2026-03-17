import { v } from "convex/values";
import { query } from "./_generated/server";

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
