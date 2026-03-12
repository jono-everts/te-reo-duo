import { v } from "convex/values";
import { query } from "./_generated/server";

export const getRandomQuestion = query({
  args: { seed: v.number() },
  handler: async (ctx, _args) => {
    const questions = await ctx.db.query("questions").collect();
    if (questions.length === 0) return null;
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
  },
});
