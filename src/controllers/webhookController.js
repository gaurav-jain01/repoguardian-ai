
export  const handleWebhook = async (req, res) => {
  const event = req.headers["x-github-event"];

  if (event !== "pull_request") {
    console.log("Ignoring non-PR event:", event);
    return res.status(200).send("Ignored");
  }

  try {
    if (!req.body) {
      console.error("❌ No body found in request. Check Content-Type header.");
      return res.status(400).send("Bad Request: Missing Body");
    }
    const { action, pull_request, repository } = req.body;

    if (pull_request && (action === "opened" || action === "synchronize")) {
      console.log(`✅ Verified PR #${pull_request.number} from ${repository.full_name}`);

      // Future Week 2/3 logic…
    }

    res.status(200).send("Webhook Received");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error processing webhook");
  }
};
