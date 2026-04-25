export interface GithubRepoMeta {
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export async function fetchGithubRepo(
  repo: string,
): Promise<GithubRepoMeta | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/ccd97/${repo}`);
    if (!res.ok) return null;
    return (await res.json()) as GithubRepoMeta;
  } catch {
    return null;
  }
}
