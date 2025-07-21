import { BestPractices } from "./bestPractices";

// types/documentation.ts
export interface Badge {
    label: string;
    status: string;
    color: string;
}

export interface TechStackItem {
    name: string;
    icon: string;
}

export interface Installation {
    requirements: string[];
    steps: string[];
}

export interface Usage {
    basic: string;
    advanced: string;
}

export interface ApiParameter {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    default?: string;
    enum?: string[];
}

export interface ApiEndpoint {
    endpoint: string;
    method: string;
    description: string;
    parameters: ApiParameter[];
    example: string;
}

export interface FileStructureItem {
    path: string;
    description: string;
}

export interface Contributing {
    setup: string;
    guidelines: string;
    process: string;
}

export interface Documentation {
    title: string;
    description: string;
    tagline: string;
    badges: Badge[];
    features: string[];
    techStack: TechStackItem[];
    installation: Installation;
    usage: Usage;
    api: ApiEndpoint[];
    fileStructure: FileStructureItem[];
    contributing: Contributing;
    license: string;
    author: string;
    bestPractices: BestPractices;
}

export interface DocumentationResponse {
    documentation: Documentation;
}


