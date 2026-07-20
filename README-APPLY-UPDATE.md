# ACE2X Knowledge OS v0.5.0 Update Package

This package updates the local `ace2x-knowledge-os` repository from v0.4.12 to v0.5.0.

## What it adds

- ACE2X Environment Validator command and modal
- Required plugin checks for Dataview, Tasks, Templater, and Meta Bind
- Configured folder checks
- Person template check
- Dashboard Base configuration check
- Advisory warnings that do not block synchronization
- v0.5.0 version updates
- Updated README and changelog
- Packaged release output under `release/ace2x-knowledge-os`

## Apply the update

Place `apply-v0.5.0.mjs` in the root of your local repository, beside `package.json`.

Run:

```bash
node apply-v0.5.0.mjs
npm run build
```

Test the files in:

```text
release/ace2x-knowledge-os/
```

The folder should contain:

```text
main.js
manifest.json
styles.css
```

## Commit and push

```bash
git add .
git commit -m "Release ACE2X Knowledge OS v0.5.0"
git push
```

## Create the release

```bash
git tag -a 0.5.0 -m "ACE2X Knowledge OS v0.5.0"
git push origin 0.5.0

gh release create 0.5.0   main.js   manifest.json   styles.css   --title "ACE2X Knowledge OS v0.5.0"   --notes-file CHANGELOG.md
```

Review and test the plugin in Obsidian before creating the Git tag and GitHub release.
