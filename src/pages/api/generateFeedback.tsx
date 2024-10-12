import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

configureGenkit({ plugins: [googleAI()] });

const Ai = async () => {
  const feedback: any = [];
  const result = await generate({
    model: gemini15Flash,
    prompt: `
        Here is a list of website feedback:
        ${feedback.map((item: any) => `- ${item}`).join("\n")}
        Analyze the feedback and give me specific tasks to improve the website in array form, with only 1 improvement task per feedback.
      `,
  });
};
