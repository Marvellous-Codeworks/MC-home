import { createServerFn } from "@tanstack/react-start";

export interface GithubStats {
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  latestRelease: string | null;
  latestReleaseAt: string | null;
  pushedAt: string | null;
  repoUrl: string;
  error?: string;
}

const HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "marvellous-codeworks-site",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (process.env.GITHUB_TOKEN) {
  HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export const getGithubStats = createServerFn({ method: "GET" })
  .inputValidator((data: { owner: string; repo: string }) => {
    const ok = /^[a-zA-Z0-9._-]+$/;
    if (!ok.test(data.owner) || !ok.test(data.repo)) {
      throw new Error("Invalid repo coordinates");
    }
    return data;
  })
  .handler(async ({ data }): Promise<GithubStats> => {
    const repoUrl = `https://github.com/${data.owner}/${data.repo}`;
    const empty: GithubStats = {
      stars: null,
      forks: null,
      openIssues: null,
      latestRelease: null,
      latestReleaseAt: null,
      pushedAt: null,
      repoUrl,
    };
    try {
      const [repoRes, relRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${data.owner}/${data.repo}`, {
          headers: HEADERS,
        }),
        fetch(
          `https://api.github.com/repos/${data.owner}/${data.repo}/releases/latest`,
          { headers: HEADERS },
        ),
      ]);

      if (!repoRes.ok) {
        console.error(`GitHub repo fetch ${repoRes.status} for ${repoUrl}`);
        return { ...empty, error: `GitHub API error ${repoRes.status}` };
      }
      const repo = (await repoRes.json()) as {
        stargazers_count?: number;
        forks_count?: number;
        open_issues_count?: number;
        pushed_at?: string;
      };

      let latestRelease: string | null = null;
      let latestReleaseAt: string | null = null;
      if (relRes.ok) {
        const rel = (await relRes.json()) as {
          tag_name?: string;
          name?: string;
          published_at?: string;
        };
        latestRelease = rel.tag_name ?? rel.name ?? null;
        latestReleaseAt = rel.published_at ?? null;
      }

      return {
        stars: repo.stargazers_count ?? null,
        forks: repo.forks_count ?? null,
        openIssues: repo.open_issues_count ?? null,
        latestRelease,
        latestReleaseAt,
        pushedAt: repo.pushed_at ?? null,
        repoUrl,
      };
    } catch (err) {
      console.error("GitHub fetch failed:", err);
      return { ...empty, error: "Could not reach GitHub" };
    }
  });
