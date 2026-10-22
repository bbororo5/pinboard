import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const plan = JSON.parse(
  readFileSync(new URL("../docs/commit-plan.json", import.meta.url), "utf8"),
);
const commits = git("log", "--reverse", "--format=%H|%aI|%cI|%ae")
  .split("\n")
  .slice(0, plan.total)
  .map((line) => {
    const [sha, authorDate, committerDate, email] = line.split("|");
    return { sha, authorDate, committerDate, email };
  });
const actual = {};
let failures = [];
for (const c of commits) {
  const day = c.authorDate.slice(0, 10);
  actual[day] = (actual[day] ?? 0) + 1;
  if (!c.authorDate.endsWith("+09:00"))
    failures.push(`${c.sha}: unexpected author timezone`);
  if (!git("diff-tree", "--root", "--no-commit-id", "--name-only", "-r", c.sha))
    failures.push(`${c.sha}: empty commit`);
}
for (const [day, count] of Object.entries(plan.days))
  if (actual[day] !== count)
    failures.push(`${day}: expected ${count}, got ${actual[day] ?? 0}`);
if (
  commits.length !== plan.total ||
  Object.keys(actual).length !== Object.keys(plan.days).length
)
  failures.push("Commit total or date range differs");
const authors = [...new Set(commits.map((c) => c.email))];
const report = {
  passed: failures.length === 0,
  total: commits.length,
  counts: actual,
  authors,
  head: git("rev-parse", "HEAD"),
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
