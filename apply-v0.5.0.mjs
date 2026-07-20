import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetVersion = "0.5.0";

function filePath(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const full = filePath(rel);
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(full, "utf8");
}

function write(rel, value) {
  fs.writeFileSync(filePath(rel), value, "utf8");
  console.log(`Updated ${rel}`);
}

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Could not locate ${label}. Confirm this is the ACE2X Knowledge OS v0.4.12 source tree.`);
  }
  return source.replace(search, replacement);
}

function replaceRegexOnce(source, regex, replacement, label) {
  if (!regex.test(source)) {
    throw new Error(`Could not locate ${label}. Confirm this is the ACE2X Knowledge OS v0.4.12 source tree.`);
  }
  return source.replace(regex, replacement);
}

function updateJson(rel, mutate) {
  const data = JSON.parse(read(rel));
  mutate(data);
  write(rel, JSON.stringify(data, null, 2) + "\n");
}

let main = read("src/main.ts");

// -----------------------------------------------------------------------------
// 1. Environment Validator
// -----------------------------------------------------------------------------

if (!main.includes("class EnvironmentValidationModal extends Modal")) {
  const validatorCode = `const REQUIRED_PLUGINS = [
  { id: "dataview", name: "Dataview" },
  { id: "obsidian-tasks-plugin", name: "Tasks" },
  { id: "templater-obsidian", name: "Templater" },
  { id: "obsidian-meta-bind-plugin", name: "Meta Bind" }
];

class EnvironmentValidationModal extends Modal {
  constructor(app, results) {
    super(app);
    this.results = results;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("aceto-environment-validation");
    contentEl.createEl("h2", { text: "ACE2X Environment Validator" });

    const issueCount = this.results.filter((result) => !result.ok).length;
    contentEl.createEl("p", {
      text: issueCount
        ? \`ACE2X found \${issueCount} item\${issueCount === 1 ? "" : "s"} requiring attention.\`
        : "ACE2X environment is ready."
    });

    const list = contentEl.createDiv({ cls: "aceto-validation-results" });
    for (const result of this.results) {
      const row = list.createDiv({
        cls: \`aceto-validation-result \${result.ok ? "is-ready" : "needs-attention"}\`
      });
      row.createEl("strong", { text: \`\${result.ok ? "✓" : "⚠"} \${result.label}\` });
      row.createEl("div", { text: result.detail });
      if (!result.ok && result.action) {
        row.createEl("div", {
          cls: "aceto-validation-action",
          text: \`Action: \${result.action}\`
        });
      }
    }

    const actions = contentEl.createDiv({ cls: "aceto-preview-actions" });
    const close = actions.createEl("button", { cls: "mod-cta", text: "Close" });
    close.onclick = () => this.close();
  }

  onClose() {
    this.contentEl.empty();
  }
}

`;

  main = replaceOnce(
    main,
    "class MetadataPreviewModal extends Modal {",
    validatorCode + "class MetadataPreviewModal extends Modal {",
    "MetadataPreviewModal"
  );
}

if (!main.includes('id: "validate-ace2x-environment"')) {
  const anchor = `    this.addCommand({ id: "auto-detect-folders", name: "Auto-detect configured folders", callback: async () => {
      const changed = await this.autoDetectFolders();
      new Notice(changed ? "Knowledge OS folder locations updated." : "No better folder matches were found.");
    }});`;

  const replacement = anchor + `
    this.addCommand({
      id: "validate-ace2x-environment",
      name: "Validate ACE2X environment",
      callback: () => this.showEnvironmentValidation()
    });
    this.addCommand({
      id: "remove-legacy-person-page-sections",
      name: "Remove legacy person-page sections",
      callback: async () => {
        const changed = await this.removeLegacyPersonPageSections();
        new Notice(
          changed
            ? \`Removed legacy ACE2X blocks from \${changed} person page\${changed === 1 ? "" : "s"}.\`
            : "No legacy ACE2X person-page blocks were found."
        );
      }
    });`;

  main = replaceOnce(main, anchor, replacement, "auto-detect command");
}

// -----------------------------------------------------------------------------
// 2. Person pages become user-owned
// -----------------------------------------------------------------------------

// Do not react to Person page edits.
main = main.replace(
`      if (this.isPersonFile(file)) {
        this.personStatusDebounced(file);
        return;
      }`,
`      if (this.isPersonFile(file)) return;`
);

// Remove the Person page status debounce setup.
main = main.replace(
`    this.personStatusDebounced = debounce(async (file) => {
      if (file instanceof TFile) await this.syncPersonStatusesToSources(file);
    }, this.settings.debounceMs, true);

`,
""
);

// Remove the Person page debounce cleanup.
main = main.replace(
`    if (this.personStatusDebounced?.cancel) this.personStatusDebounced.cancel();
`,
""
);

// Stop source synchronization from writing record blocks to Person pages.
main = replaceOnce(
  main,
  `      const personFiles = await this.syncRecordBlocksToPeople(analysis.records, file.path, sourceLink, sourceDate);
      await this.syncRecordNotes(analysis.records, file, sourceLink, sourceDate);`,
  `      const personFiles = 0;
      await this.syncRecordNotes(analysis.records, file, sourceLink, sourceDate);`,
  "Person-page record synchronization call"
);

// Update visible notices so they no longer imply Person pages are updated.
main = main.replace(
  / and \$\{result\.personFiles\} person pages\./g,
  "."
);
main = main.replace(
  /      let changed = 0;\n      for \(const analysis of analyses\) \{\n        const result = await this\.applyAnalysis\(analysis\);\n        changed \+= result\.personFiles;\n      \}\n      await this\.persist\(\);\n      new Notice\(`Sync complete: \$\{analyses\.length\} notes and \$\{changed\} person-page updates\.`\);/,
`      for (const analysis of analyses) {
        await this.applyAnalysis(analysis);
      }
      await this.persist();
      new Notice(\`Sync complete: \${analyses.length} notes processed.\`);`
);

// Replace the old writer with a no-op safety method and add a migration cleanup.
main = replaceRegexOnce(
  main,
  /  async syncRecordBlocksToPeople\(records, sourcePath, sourceLink, date\) \{[\s\S]*?\n  \}\n\n  async syncKnowledgeOSStatusChanges\(\) \{/,
`  async syncRecordBlocksToPeople() {
    // v0.5.0: Person pages are user-owned. ACE2X never writes Decisions,
    // Risks, Issues or Executive Follow-ups into Person page bodies.
    return 0;
  }

  removeLegacyManagedBlocks(content) {
    let updated = String(content || "");

    // Remove current ACE2X source-scoped managed blocks.
    updated = updated.replace(
      /<!-- aceto-knowledge-os:[^\\n:]+:(?:decisions|risks|issues|executive_follow_ups):start -->[\\s\\S]*?<!-- aceto-knowledge-os:[^\\n:]+:(?:decisions|risks|issues|executive_follow_ups):end -->\\n?/g,
      ""
    );

    // Remove older ACE2X metadata-sync blocks.
    updated = updated.replace(
      /<!-- aceto-metadata-sync:[^\\n:]+:start -->[\\s\\S]*?<!-- aceto-metadata-sync:[^\\n:]+:end -->\\n?/g,
      ""
    );

    // Remove an orphaned generated heading only when it contains no content.
    updated = updated.replace(
      /^#{1,6}\\s+(Decisions|Risks|Issues|Executive Follow-ups)\\s*\\n(?=\\s*(?:#{1,6}\\s|$))/gim,
      ""
    );

    return updated.replace(/\\n{3,}/g, "\\n\\n").trimEnd() + "\\n";
  }

  async removeLegacyPersonPageSections() {
    let changed = 0;
    const peopleFiles = this.app.vault.getMarkdownFiles().filter((file) => this.isPersonFile(file));

    for (const personFile of peopleFiles) {
      const original = await this.app.vault.cachedRead(personFile);
      const updated = this.removeLegacyManagedBlocks(original);
      if (updated === original) continue;

      await this.captureBefore(personFile);
      this.processingPaths.add(personFile.path);
      try {
        await this.app.vault.modify(personFile, updated);
      } finally {
        this.processingPaths.delete(personFile.path);
      }
      changed++;
    }

    return changed;
  }

  async syncKnowledgeOSStatusChanges() {`,
  "syncRecordBlocksToPeople method"
);

// Replace Person-page status sync with an inert compatibility method.
main = replaceRegexOnce(
  main,
  /  async syncPersonStatusesToSources\(personFile\) \{[\s\S]*?\n  \}\n\}\n\nclass ACE2XKnowledgeOSSettingTab/,
`  async syncPersonStatusesToSources() {
    // Retained for compatibility only. Person pages are no longer a write-back surface.
    return false;
  }
}

class ACE2XKnowledgeOSSettingTab`,
  "syncPersonStatusesToSources method"
);

// -----------------------------------------------------------------------------
// 3. Validator methods
// -----------------------------------------------------------------------------

if (!main.includes("  validateEnvironment() {")) {
  const anchor = `  folderSettingKeys() {
    return ["peopleFolder", "executiveFolder", "decisionsFolder", "risksFolder", "issuesFolder", "dashboardFolder"];
  }`;

  const replacement = `  validateEnvironment() {
    const manifests = this.app.plugins?.manifests || {};
    const enabled = this.app.plugins?.enabledPlugins || new Set();
    const results = [];

    for (const plugin of REQUIRED_PLUGINS) {
      const installed = Boolean(manifests[plugin.id]);
      const active = enabled.has(plugin.id);
      results.push({
        label: plugin.name,
        ok: installed && active,
        detail: !installed
          ? "Required community plugin is not installed."
          : active
            ? "Installed and enabled."
            : "Installed but disabled.",
        action: !installed
          ? \`Install \${plugin.name} from Community plugins.\`
          : active
            ? ""
            : \`Enable \${plugin.name} in Community plugins.\`
      });
    }

    const folderLabels = {
      peopleFolder: "People folder",
      executiveFolder: "Executive Follow-ups folder",
      decisionsFolder: "Decisions folder",
      risksFolder: "Risks folder",
      issuesFolder: "Issues folder",
      dashboardFolder: "Dashboard folder"
    };

    for (const key of this.folderSettingKeys()) {
      const configured = normalizePath(this.settings[key] || "");
      const exists = configured && this.app.vault.getAbstractFileByPath(configured) instanceof TFolder;
      results.push({
        label: folderLabels[key] || key,
        ok: Boolean(exists),
        detail: exists
          ? \`Configured: \${configured}\`
          : configured
            ? \`Configured folder is missing: \${configured}\`
            : "No folder is configured.",
        action: exists ? "" : "Select an existing folder or run Auto-detect configured folders."
      });
    }

    const templatePath = normalizePath(this.settings.personTemplatePath || "");
    const template = templatePath ? this.app.vault.getAbstractFileByPath(templatePath) : null;
    results.push({
      label: "Person template",
      ok: template instanceof TFile,
      detail: template instanceof TFile
        ? \`Configured: \${templatePath}\`
        : templatePath
          ? \`Configured template is missing: \${templatePath}\`
          : "No Person template is configured.",
      action: template instanceof TFile ? "" : "Select an existing Person template."
    });

    const dashboardName = String(this.settings.dashboardBaseName || "").trim().replace(/\\.base$/i, "");
    results.push({
      label: "Dashboard Base name",
      ok: Boolean(dashboardName),
      detail: dashboardName
        ? \`Configured: \${dashboardName}.base\`
        : "No dashboard Base name is configured.",
      action: dashboardName ? "" : "Enter a dashboard Base name."
    });

    return results;
  }

  showEnvironmentValidation() {
    const results = this.validateEnvironment();
    new EnvironmentValidationModal(this.app, results).open();
    return results;
  }

${anchor}`;

  main = replaceOnce(main, anchor, replacement, "folderSettingKeys method");
}

// Add validator and cleanup controls to Settings.
if (!main.includes('.setName("Environment validation")')) {
  const anchor = `    new Setting(containerEl)
      .setName("Auto-detect folders")
      .setDesc("Find likely People, Executive, Decisions, Risks, Issues and Dashboard folders when a configured location is missing.")
      .addButton((button) => button.setButtonText("Detect folders").onClick(async () => {
        const changed = await this.plugin.autoDetectFolders();
        new Notice(changed ? "Folder locations updated." : "No better folder matches were found.");
        this.display();
      }));`;

  const replacement = anchor + `

    const validationResults = this.plugin.validateEnvironment();
    const validationIssues = validationResults.filter((result) => !result.ok).length;

    new Setting(containerEl)
      .setName("Environment validation")
      .setDesc(
        validationIssues
          ? \`\${validationIssues} configuration item\${validationIssues === 1 ? "" : "s"} require attention. Validation is advisory and does not block ACE2X.\`
          : "Required plugins and configured locations are ready."
      )
      .addButton((button) => button
        .setButtonText("Validate environment")
        .setCta()
        .onClick(() => this.plugin.showEnvironmentValidation()));

    new Setting(containerEl)
      .setName("Remove legacy Person-page blocks")
      .setDesc("Remove only ACE2X-generated Decisions, Risks, Issues and Executive Follow-up blocks. User content and Dataview queries are preserved.")
      .addButton((button) => button
        .setButtonText("Remove legacy blocks")
        .onClick(async () => {
          const changed = await this.plugin.removeLegacyPersonPageSections();
          new Notice(
            changed
              ? \`Removed legacy ACE2X blocks from \${changed} person page\${changed === 1 ? "" : "s"}.\`
              : "No legacy ACE2X person-page blocks were found."
          );
        }));`;

  main = replaceOnce(main, anchor, replacement, "Auto-detect folders setting");
}

write("src/main.ts", main);

// -----------------------------------------------------------------------------
// 4. Version and build files
// -----------------------------------------------------------------------------

updateJson("package.json", (pkg) => {
  pkg.version = targetVersion;
  pkg.scripts = pkg.scripts || {};
  if (!pkg.scripts.version) pkg.scripts.version = "node version-bump.mjs";
});

if (fs.existsSync(filePath("package-lock.json"))) {
  updateJson("package-lock.json", (lock) => {
    lock.version = targetVersion;
    if (lock.packages?.[""]) lock.packages[""].version = targetVersion;
  });
}

updateJson("manifest.json", (manifest) => {
  manifest.version = targetVersion;
});

updateJson("versions.json", (versions) => {
  const manifest = JSON.parse(read("manifest.json"));
  versions[targetVersion] = manifest.minAppVersion || "1.5.0";
});

let esbuild = read("esbuild.config.mjs");
esbuild = esbuild.replace(/ACE2X Knowledge OS v[0-9.]+/g, `ACE2X Knowledge OS v${targetVersion}`);
write("esbuild.config.mjs", esbuild);

// -----------------------------------------------------------------------------
// 5. Release notes
// -----------------------------------------------------------------------------

if (fs.existsSync(filePath("CHANGELOG.md"))) {
  let changelog = read("CHANGELOG.md");
  if (!changelog.includes("## [0.5.0]")) {
    const entry = `## [0.5.0] - 2026-07-19

### Breaking changes

- ACE2X no longer writes Decisions, Risks, Issues or Executive Follow-ups into Person page bodies.
- Person pages are now user-owned after optional creation.
- Relationship views should be rendered through Dataview.

### Added

- Environment Validator for required plugins, folders, Person template and dashboard Base configuration.
- Command: Validate ACE2X environment.
- Command: Remove legacy person-page sections.
- Safe migration cleanup for ACE2X-generated managed blocks.

### Retained

- Optional Person page creation from the configured template.
- Knowledge Object creation and synchronization.
- Status synchronization between source notes and managed record notes.
- Compact status values: s::o, s::d and s::c.
- Done-date and strikethrough behavior.

`;
    changelog = changelog.replace(/^# Changelog\s*/i, "# Changelog\n\n" + entry);
    write("CHANGELOG.md", changelog);
  }
}

console.log(`
ACE2X Knowledge OS v${targetVersion} source update applied successfully.

Next steps:
  npm install
  npm run build

Then test the plugin before committing:
  git add .
  git commit -m "Release ACE2X Knowledge OS v${targetVersion}"
  git push
`);
