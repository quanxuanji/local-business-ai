export interface ModuleOverviewDto {
  module: string;
  phase: number;
  summary: string;
  nextSteps: string[];
  futureExtensions?: string[];
}
