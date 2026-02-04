import octokit from "./octokit.js";

export const getPullRequestFiles = async (owner, repo, pullNumber) => {
    const {data} = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
    })

    return data;
}

export const getFileContent = async (owner, repo, filePath, ref) =>{
     const {data} = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref,
     })

    const content = Buffer.from(data.content, "base64").toString("utf8");
    return content;
}

export const addReviewComment = async ({
  owner,
  repo,
  pullNumber,
  body,
  commitId,
  filePath,
  line,
}) => {
  return await octokit.rest.pulls.createReviewComment({
    owner,
    repo,
    pull_number: pullNumber,
    body, 
    commit_id: commitId, 
    path: filePath,
    line, 
  });
};


export const extractChangedLines = (patch) => {
  const lines = [];
  const patchLines = patch.split("\n");

  let currentNewLineNumber = null;

  for (const line of patchLines) {
    // Match @@ -oldStart,oldCount +newStart,newCount @@
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+),?/);
      if (match) currentNewLineNumber = parseInt(match[1], 10);
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      lines.push(currentNewLineNumber);
    }

    if (!line.startsWith("-")) {
      currentNewLineNumber++;
    }
  }

  return lines;
};
