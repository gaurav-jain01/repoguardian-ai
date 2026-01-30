import crypto from "crypto";

export const verifySignature = (req, res, next) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const secret = process.env.WEBHOOK_SECRET;

    if (!signature) {
      console.log("🟡 No signature found in headers. Allowing for ping/test.");
      return next();
    }

    if (!secret) {
      console.error("❌ WEBHOOK_SECRET is not defined in .env");
      return res.status(500).send("Server configuration error");
    }

    if (!req.rawBody) {
      console.error("❌ req.rawBody is missing. Body parser might be misconfigured.");
      return res.status(500).send("Internal Server Error: Missing Body");
    }

    // Calculate HMAC digest
    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");

    console.log("🟣 GITHUB SIGNATURE:", signature);
    console.log("🟣 OUR DIGEST:     ", digest);

    // Use timingSafeEqual to prevent timing attacks
    // Both must be buffers of the same length for timingSafeEqual
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (
      signatureBuffer.length !== digestBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
    ) {
      console.log("❌ SIGNATURE MISMATCH");
      return res.status(401).send("Invalid Signature");
    }

    console.log("✅ SIGNATURE VERIFIED");
    next();
  } catch (err) {
    console.error("Signature verification error:", err);
    res.status(500).send("Internal Server Error");
  }
};
