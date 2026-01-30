import { askBot } from "../services/bot.js";

const question = process.argv.slice(2).join(" ");

if (!question) {
  console.log("❗ Usage: node testBot.js \"your question here\"");
  process.exit(1);
}

console.log("🤖 Asking RepoGuardian AI...\n");
  
askBot(question).then((answer) => {
  console.log("🟢 Response:\n");
  console.log(answer);
});
