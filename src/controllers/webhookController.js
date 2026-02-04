import { 
  getPullRequestFiles, 
  getFileContent, 
  addReviewComment, 
  extractChangedLines 
} from "../services/githubService.js";

export const handleWebhook = async (req, res) => {
  const event = req.headers["x-github-event"];

  console.log("📥 Event Received:", event);

  // --- PUSH EVENT -------------------------------------------------
  if (event === "push") {
    const { ref, head_commit } = req.body;

    console.log(`🚀 Push received on ${ref}`);
    console.log(`📝 Commit msg: ${head_commit?.message}`);
    
    return res.status(200).send("Push Webhook Received");
  }

  // --- PULL REQUEST EVENT ------------------------------------------
  if (event === "pull_request") {
    try {
      const { action, pull_request, repository } = req.body;

      if (!pull_request) {
        console.error("❌ Missing pull request object");
        return res.status(400).send("Bad Request");
      }

      if (action === "opened" || action === "synchronize") {

        const owner = repository.owner.login;
        const repo = repository.name;
        const pullNumber = pull_request.number;

        console.log(`🔍 Fetching PR files for #${pullNumber}`);

        const files = await getPullRequestFiles(owner, repo, pullNumber);

        for (const file of files) {
          console.log("📄 File:", file.filename);
          console.log("📝 Patch:", file.patch);

          // Skip if no patch available
          if (!file.patch) {
            console.log("⏭️ No patch found, skipping file");
            continue;
          }

          // Extract changed line numbers from patch
          const changedLines = extractChangedLines(file.patch);

          console.log("📌 Changed lines:", changedLines);

          // Fetch file content (optional)
          const content = await getFileContent(
            owner,
            repo,
            file.filename,
            pull_request.head.sha
          );

          // Post comment on each changed line
          for (const lineNumber of changedLines) {
            const resp = await addReviewComment({
              owner,
              repo,
              pullNumber,
              body: "⚠️ Potential issue detected here.",
              commitId: pull_request.head.sha,
              filePath: file.filename,
              line: lineNumber,
            });

            console.log("💬 Comment posted:", resp?.id);
          }
        }
      }

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
