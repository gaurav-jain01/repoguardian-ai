import octokit from "./octokit.js";

// Fetch PR files
export const getPullRequestFiles = async (owner, repo, pullNumber) => {
  const { data } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });
  return data;
};

// Extract changed lines in diff
export const extractChangedLines = (patch) => {
  const lines = [];
  const patchLines = patch.split("\n");
  let currentNew = null;

  for (const line of patchLines) {
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+),?/);
      if (match) currentNew = parseInt(match[1], 10);
      continue;
    }
    if (line.startsWith("+") && !line.startsWith("+++")) {
      lines.push(currentNew);
    }
    if (!line.startsWith("-")) currentNew++;
  }
  return lines;
};

// Summary comment (Conversation tab)
export const addPRSummaryComment = async ({ owner, repo, pullNumber, body }) => {
  return await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });
};

// Delete any pending review
export const clearPendingReviews = async (owner, repo, pullNumber) => {
  const { data: reviews } = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pull_number: pullNumber,
  });

  const pending = reviews.filter((r) => r.state === "PENDING");

  for (const r of pending) {
    console.log(`🧹 Removing pending review #${r.id}`);
    await octokit.rest.pulls.deletePendingReview({
      owner,
      repo,
      pull_number: pullNumber,
      review_id: r.id,
    });
  }
};

// Submit final batched review
export const createReview = async ({
  owner,
  repo,
  pullNumber,
  comments,
  commitId,
  body = "RepoGuardian AI Review",
  event = "COMMENT",
}) => {
  return await octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    commit_id: commitId,
    body,
    event,
    comments,
  });
};
