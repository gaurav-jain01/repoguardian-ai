import octokit from "./octokit.js";

export const getPullRequestFile = async (owner, repo, pullNumber) => {
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
  return await octokit.pulls.createReviewComment({
    owner,
    repo,
    pull_number: pullNumber,
    body, 
    commit_id: commitId, 
    path: filePath,
    line, 
  });
};