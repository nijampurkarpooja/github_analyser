import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const outputSchema = z.object({
  summary: z.string(),
  cool_facts: z.array(z.string()),
});

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  modelKwargs: {
    response_format: { type: "json_object" },
  },
}).withStructuredOutput(outputSchema);

const promptTemplate = ChatPromptTemplate.fromTemplate(
  "Summarize this GitHub repository from this README content:\n\n{readmeContent}\n\nRespond with a JSON object containing 'summary' (string) and 'cool_facts' (array of strings)."
);

const chain = RunnableSequence.from([
  promptTemplate,
  model,
]);

export async function summarizeRepository(readmeContent: string) {
  return chain.invoke({ readmeContent });
}
