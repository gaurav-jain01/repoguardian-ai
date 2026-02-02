import { getPullRequestFile, getFileContent, addReviewComment } from "../services/githubService.js";

export const handleWebhook = async (req, res) => {
  const event = req.headers["x-github-event"];

  console.log("📥 Event Received:", event);

  // --- PUSH EVENT -------------------------------------------------
  if (event === "push") {
    const { ref, repository, head_commit } = req.body;

    console.log(`🚀 Push received on ${ref}`);
    console.log(`📝 Commit msg: ${head_commit?.message}`);
    
    return res.status(200).send("Push Webhook Received");
  }

  // --- PULL REQUEST EVENT ------------------------------------------
  if (event === "pull_request") {
    try {
      const { action, pull_request, repository } = req.body;

      if (!req.body) {
        console.error("❌ Missing body");
        return res.status(400).send("Bad Request");
      }

      if (pull_request && (action === "opened" || action === "synchronize")) {
       const owner = repository.owner.login;
  const repo = repository.name;
  const pullNumber = pull_request.number;

  console.log(`🔍 Fetching PR files for #${pullNumber}`);

  const files = await getPullRequestFile(owner, repo, pullNumber);

  for (const file of files) {
    console.log("📄 File:", file.filename);
    console.log("📝 Patch:", file.patch);

    // Example: Fetch full file content
    const content = await getFileContent(owner, repo, file.filename, pull_request.head.sha);

    // Example: add a comment on line 5
    await addReviewComment({
      owner,
      repo,
      pullNumber,
      body: "⚠️ Potential issue detected here.",
      commitId: pull_request.head.sha,
      filePath: file.filename,
      line: 5,
    });
      }}

      return res.status(200).send("PR Webhook Received");
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).send("Error processing webhook");
    }
  }

  // --- IGNORE OTHER EVENTS -----------------------------------------
  console.log("ℹ️ Ignored event:", event);
  return res.status(200).send("Ignored Event");
};
