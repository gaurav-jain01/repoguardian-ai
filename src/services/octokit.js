import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
dotenv.config();

console.log("Octokit: Token Loaded:", process.env.GITHUB_TOKEN ? "Yes" : "No");
if (process.env.GITHUB_TOKEN) {
    console.log("Octokit: Token Prefix:", process.env.GITHUB_TOKEN.substring(0, 10));
}

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export default octokit;
