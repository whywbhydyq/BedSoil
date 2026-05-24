const currentSha = process.env.VERCEL_GIT_COMMIT_SHA;
const ref = process.env.VERCEL_GIT_COMMIT_REF;
const owner = process.env.VERCEL_GIT_REPO_OWNER;
const repo = process.env.VERCEL_GIT_REPO_SLUG;

if (!currentSha || !ref || !owner || !repo) {
  console.log('Missing Vercel Git environment variables. Continue build.');
  process.exit(1);
}

try {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'skip-old-vercel-builds',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    console.log(`GitHub API check failed with ${res.status}. Continue build.`);
    process.exit(1);
  }

  const data = await res.json();
  const latestSha = data?.sha;

  if (latestSha && latestSha !== currentSha) {
    console.log(`Skip old Vercel build. Current: ${currentSha}. Latest: ${latestSha}.`);
    process.exit(0);
  }

  console.log('Current commit is latest. Continue build.');
  process.exit(1);
} catch (error) {
  console.log('Skip-old-build check failed. Continue build.', error);
  process.exit(1);
}
