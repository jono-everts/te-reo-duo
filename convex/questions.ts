import { v } from "convex/values";
import { query } from "./_generated/server";

export const getRandomQuestion = query({
  args: { seed: v.number() },
  handler: async (ctx, args) => {
    const questions = await ctx.db.query("questions").collect();
    if (questions.length === 0) return null;
    const index = Math.abs(args.seed) % questions.length;
    return questions[index];
  },
});
