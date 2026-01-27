import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { RepositoryMetadata } from "./types";

const outputSchema = z.object({
  summary: z.string(),
  cool_facts: z.array(z.string()),
  stars: z.number(),
  latest_version: z.string().nullable(),
  is_active: z.boolean(),
  maintenance_status: z.enum([
    "active",
    "maintained",
    "archived",
    "deprecated",
  ]),
  programming_languages: z.array(z.string()),
  open_issues: z.number(),
  closed_issues: z.number(),
  total_issues: z.number(),
});

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  modelKwargs: {
    response_format: { type: "json_object" },
  },
}).withStructuredOutput(outputSchema);

const promptTemplate = ChatPromptTemplate.fromTemplate(
  `Summarize this GitHub repository with the following information:

Repository Metadata:
- Stars: {stars}
- Latest Version: {latestVersion}
- Last Updated: {lastUpdated}
- Programming Languages: {languages}
- Open Issues: {openIssues}
- Closed Issues: {closedIssues}

README Content:
{readmeContent}

Analyze the repository and determine:
1. If it's active (based on recent commits and updates)
2. Maintenance status (active/maintained/archived/deprecated)
3. Basic facts about the repository

Respond with a JSON object containing all required fields.`
);

const chain = RunnableSequence.from([promptTemplate, model]);

export async function summarizeRepository(
  readmeContent: string,
  repositoryMetadata: RepositoryMetadata
) {
  return chain.invoke({
    readmeContent,
    stars: repositoryMetadata.stars,
    latestVersion: repositoryMetadata.latestVersion || "No releases",
    lastUpdated: repositoryMetadata.lastUpdated,
    lastCommitDate: repositoryMetadata.lastCommitDate || "Unknown",
    languages: repositoryMetadata.languages.join(", "),
    openIssues: repositoryMetadata.openIssues,
    closedIssues: repositoryMetadata.closedIssues,
  });
}
