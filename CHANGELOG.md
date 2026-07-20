# Changelog

## [0.5.0] - 2026-07-19

### Added

- Added the ACE2X Environment Validator.
- Checks whether Dataview, Tasks, Templater, and Meta Bind are installed and enabled.
- Checks configured People, Executive, Decisions, Risks, Issues, and Dashboard folders.
- Checks the configured person template and dashboard Base name.
- Added a detailed validation modal with corrective actions.
- Added a settings summary and a Validate ACE2X environment command.
- Validation is advisory and never blocks ACE2X synchronization.
- Users remain free to select and name their own vault folders.

### Included from the v0.5.0 development cycle

- Default dashboard Base name is now `00.🎛️ Master`.
- Supports `s::o`, `s::d`, and `s::c` compact status values.
- Normalizes done, closed, complete, completed, and resolved to Done.
- Adds completion dates and strikethrough formatting for completed records.
- Synchronizes status changes from managed record pages and People pages back to source notes.
- Tracks configured folder renames and highlights missing configured folders.
- No longer writes unmanaged Risk sections to the bottom of People pages.

## [0.4.12] - 2026-07-19

### Current functionality

- Synchronizes decisions, risks, issues, and executive follow-ups.
- Creates and updates managed record notes.
- Resolves person links and aliases through Obsidian.
- Synchronizes record relationships to People pages.
- Supports compact inline status values such as `s::o` and `s::d`.
- Normalizes closed, complete, and done states to Done.
- Adds completion dates and strikethrough formatting to completed records.
- Synchronizes status changes made in record pages and People pages back to source notes.
- Generates and maintains the configured Knowledge OS Base dashboard.
- Tracks configured folders when folders are renamed.
- Provides preview, batch synchronization, auto-detection, and undo commands.

### Development foundation

- Added TypeScript source project.
- Added esbuild production and watch builds.
- Added package metadata, TypeScript configuration, version synchronization, and Git exclusions.
