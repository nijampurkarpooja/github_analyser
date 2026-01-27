export interface RepositoryMetadata {
  stars: number;
  latestVersion: string | null;
  lastUpdated: string;
  languages: string[];
  openIssues: number;
  closedIssues: number;
  lastCommitDate: string | null;
}
