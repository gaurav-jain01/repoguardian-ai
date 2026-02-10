import {
  getPullRequestFiles,
  extractChangedLines,
  addPRSummaryComment,
  createReview,
  clearPendingReviews
} from "../services/githubService.js";

import { generateAIComment } from "../services/bot.js";

export const handleWebhook = async (req, res) => {
  const event = req.headers["x-github-event"];
  console.log("📥 Event Received:", event);

  // -----------------------------
  // PUSH EVENT
  // -----------------------------
  if (event === "push") {
    const { ref, head_commit } = req.body;
    console.log(`🚀 Push to ${ref}`);
    console.log(`📝 Commit msg: ${head_commit?.message}`);
    return res.status(200).send("Push Webhook Received");
  }

  // -----------------------------
  // PR EVENT
  // -----------------------------
  if (event === "pull_request") {
    try {
      const { action, pull_request, repository } = req.body;

      if (!pull_request) {
        console.log("❌ No PR object");
        return res.status(400).send("Bad Request");
      }

      if (action !== "opened" && action !== "synchronize") {
        return res.status(200).send("PR event ignored");
      }

      const owner = repository.owner.login;
      const repo = repository.name;
      const pullNumber = pull_request.number;
      const commitId = pull_request.head.sha;

      console.log(`🔍 Fetching PR files for #${pullNumber}`);

      const files = await getPullRequestFiles(owner, repo, pullNumber);
      const reviewComments = [];
      const summary = [];

      summary.push(`### 🤖 RepoGuardian AI Review Summary`);
      summary.push(`**Files analyzed:**`);
      files.forEach((f) => summary.push(`- \`${f.filename}\``));
      summary.push(`\n**Results:**`);

      // Remove any previous pending review
      await clearPendingReviews(owner, repo, pullNumber);

      for (const file of files) {
        const { status, filename, patch } = file;

        // Case 1: Deleted file
        if (status === "removed") {
          summary.push(`- 🗑️ Deleted: \`${filename}\``);
          continue;
        }

        // Case 2: Renamed file
        if (status === "renamed") {
          summary.push(`- 🔄 Renamed: \`${filename}\``);
          continue;
        }

        // Case 3: Binary or no diff
        if (!patch) {
          summary.push(`- ⚪ No diff: \`${filename}\``);
          continue;
        }

        const changedLines = extractChangedLines(patch);

        // Case 4: New file
        if (status === "added") {
          summary.push(`- 🆕 New file: \`${filename}\``);

          const ai = await generateAIComment({
            code: patch,
            filename,
            line: changedLines[0],
          });

          reviewComments.push({
            path: filename,
            line: changedLines[0],
            side: "RIGHT",
            body: ai,
          });

          continue;
        }

        // Case 5: Text-only change
        const isTextOnly =
          patch.split("\n").every((line) =>
            line.startsWith("+") || line.startsWith("-")
              ? /^[+\-][\w\s.,!?;:'"()_-]+$/.test(line.trim())
              : true
          );

        if (isTextOnly) {
          summary.push(`- ✏️ Text change: \`${filename}\` (UI wording)`);

          const ai = await generateAIComment({
            code: patch,
            filename,
            line: changedLines[0],
          });

          reviewComments.push({
            path: filename,
            line: changedLines[0],
            side: "RIGHT",
            body: ai,
          });

          continue;
        }

        // Case 6: Normal code modification
        summary.push(
          `- ⚠️ Code modification: \`${filename}\` (line ${changedLines[0]})`
        );

        const ai = await generateAIComment({
          code: patch,
          filename,
          line: changedLines[0],
        });

        reviewComments.push({
          path: filename,
          line: changedLines[0],
          side: "RIGHT",
          body: ai,
        });
      }

      // -----------------------------
      // SUBMIT REVIEW
      // -----------------------------
      if (reviewComments.length > 0) {
        console.log(`🚀 Submitting review with ${reviewComments.length} comments`);
        await createReview({
          owner,
          repo,
          pullNumber,
          commitId,
          comments: reviewComments,
          body: `RepoGuardian AI found ${reviewComments.length} improvement(s).`,
        });
      } else {
        console.log("✅ No inline issues. Clean PR.");
      }

      // -----------------------------
      // SUMMARY COMMENT
      // -----------------------------
      summary.push(`\n---\n*Automated review by RepoGuardian AI 🤖*`);

      await addPRSummaryComment({
        owner,
        repo,
        pullNumber,
        body: summary.join("\n"),
      });

      console.log("📌 Summary posted");
      return res.status(200).send("PR Webhook Processed");

    } catch (err) {
      console.error("❌ Error:", err);
      return res.status(500).send("Webhook error");
    }
  }

  return res.status(200).send("Ignored Event");
};
