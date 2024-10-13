import type { NextApiRequest, NextApiResponse } from "next";
import genkit from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

type Data = {
  task: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    configureGenkit({ plugins: [googleAI()] });

    const result = await genkit.generate({
      model: gemini15Flash,
      prompt: `Here is feedback for the website: ${req.body.feedback}. Convert this feedback into a Task.`,
    });

    const task = result?.output || "Task not generated";

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ task: "Error generating task" });
    console.error(error);
  }
}
