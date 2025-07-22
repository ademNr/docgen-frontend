export interface Repository {
    id: number;
    name: string;
    owner: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    updated_at: string;
    html_url: string;
    default_branch: string;
    public_repos: number;
    login: string;
    avatar_url: string;
}