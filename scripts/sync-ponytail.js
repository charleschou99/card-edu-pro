#!/usr/bin/env node
/**
 * Sync vendored Ponytail Cursor adapters from upstream.
 * Custom files (ponytail-local.mdc, teach/grilling patches) are never touched.
 *
 * Usage: node scripts/sync-ponytail.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const REPO = "https://github.com/DietrichGebert/ponytail.git";
const TAG = "v4.8.3";
const ROOT = path.resolve(__dirname, "..");

const COPY_MAP = [
  [".cursor/rules/ponytail.mdc", ".cursor/rules/ponytail.mdc"],
  ["skills/ponytail/SKILL.md", ".cursor/skills/ponytail/SKILL.md"],
  ["skills/ponytail-review/SKILL.md", ".cursor/skills/ponytail-review/SKILL.md"],
  ["skills/ponytail-audit/SKILL.md", ".cursor/skills/ponytail-audit/SKILL.md"],
  ["skills/ponytail-debt/SKILL.md", ".cursor/skills/ponytail-debt/SKILL.md"],
];

function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ponytail-sync-"));

  try {
    console.log(`Cloning ${REPO} @ ${TAG}...`);
    execSync(`git clone --depth 1 --branch ${TAG} ${REPO} "${tmp}"`, {
      stdio: "inherit",
    });

    for (const [srcRel, destRel] of COPY_MAP) {
      const src = path.join(tmp, srcRel);
      const dest = path.join(ROOT, destRel);

      if (!fs.existsSync(src)) {
        throw new Error(`Missing upstream file: ${srcRel}`);
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`  ${destRel}`);
    }

    const versionFile = path.join(ROOT, ".cursor", "PONYTAIL-VERSION");
    fs.writeFileSync(
      versionFile,
      [
        `source: ${REPO}`,
        `tag: ${TAG}`,
        `synced: ${new Date().toISOString()}`,
        `license: MIT`,
        "",
        "Vendored files are overwritten by scripts/sync-ponytail.js.",
        "Local customizations: .cursor/rules/ponytail-local.mdc",
        "",
      ].join("\n")
    );
    console.log(`  .cursor/PONYTAIL-VERSION`);
    console.log("Done.");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main();
