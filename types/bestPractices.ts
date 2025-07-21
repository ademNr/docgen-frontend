export interface BestPracticeImprovement {
    category: string;
    suggestions: string[];
}

export interface BestPractices {
    score: number;
    summary: string;
    strengths: string[];
    improvements: BestPracticeImprovement[];
}
