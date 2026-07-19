# Changelog

## 0.4.12

- Fixed reverse status synchronization from Obsidian Bases to generated Decision, Risk, Issue, and Executive record pages.
- Fixed source-record matching so inline `s::o`, `s::d`, completion dates, and strikethrough do not prevent status updates.
- Added folder-path detection for Base edits so synchronization does not depend on metadata-cache timing.
- Base changes now update the source meeting line and regenerate the record page with canonical `Open` or `Done` status.

## 0.4.11

- Stopped writing risk records to the bottom of People pages.
- People-page risk reporting now comes from the Dataview table in the person template.
- Added cleanup of existing plugin-managed risk blocks during synchronization.
- Preserved generated risk notes, Base views, source synchronization, and risk metadata.

## 0.4.10

- Fixed Base `Sentence` values dropping tags placed at the end of a record.
- All inline and trailing tags now remain in the generated sentence as normal words without the `#` prefix.
- Preserved the separate YAML `tags` property for filtering and grouping in Bases.

## 0.4.9

- Renamed the plugin to **ACE2X Knowledge OS**.
- Changed the plugin ID and release folder to `ace2x-knowledge-os`.
- Added compact canonical source statuses: `s::o` and `s::d`.
- Accepts `s::c`, `done`, `closed`, `complete`, and related full-text values as Done inputs.
- Normalizes generated record and Base status values to plain-text `Open` or `Done`.
- Done records are written as full-line strikethrough with `s::d done::YYYY-MM-DD`.
- Set the default Base filename to `00.🎛️ Master.base` in the configured dashboard folder.
- Added first-run migration of legacy settings and indexes from former plugin folders.

## 0.4.8

- Limited documented record status values to `Open` and `Done`.
- Added inline `done:: YYYY-MM-DD` completion dates.
- Open-to-Done synchronization applies full-line strikethrough and records the local completion date.
- Reopening removes both the completion date and strikethrough.
- Repeated Done synchronization preserves the existing completion date.
- Added `completed_date` to generated record YAML when available.
- Updated the plugin-page syntax reference and README examples.

## 0.4.7

- Added inline `s::` status syntax for decisions, risks, issues and executive follow-ups.
- Supports compact source lines such as `d:: [[Owner]] Approve proposal. #Project s:: Open`.
- Base status synchronization now writes the selected status back to the source note's inline `s::` value instead of applying strikethrough.
- Source-note synchronization reads inline `s::` and writes the same value to generated record YAML and the Knowledge OS Base.
- Missing inline status defaults to `open`.
- Existing fully struck-through records remain recognized as closed for backward compatibility.
- Updated the plugin settings reference table and guidance for inline status.
- Preserved plugin ID, settings and stable installation folder.

## 0.4.6

- Fixed manual Base status synchronization reading stale values from Obsidian metadata cache.
- `Sync Knowledge OS Status Changes` now reads each record note's YAML directly from disk.
- Manual sync scans all configured Knowledge OS record folders, ensuring newly edited Base rows are included immediately.
- Preserved the stable plugin folder name `aceto-knowledge-os`.

## 0.4.5

- Packages the plugin inside a stable `aceto-knowledge-os` folder.
- Keeps the existing plugin ID unchanged to preserve plugin identity and settings compatibility.
- Retains the manual **Sync Knowledge OS Status Changes** command and all v0.4.4 functionality.

## 0.4.3

- Replaced folder path text fields with vault-backed folder selectors.
- Added automatic detection for missing People, Executive, Decisions, Risks, Issues and Dashboard folders.
- Added the `Auto-detect configured folders` command.
- Automatically updates configured folder paths when a selected folder is renamed or moved.
- Shows missing configured locations clearly in plugin settings.
- Preserves existing folder configuration during upgrade.

# 0.4.2

- Add configurable Dashboard Base filename.
- Synchronize Base status edits back to source notes and person-page mirrors.
- Use stable record IDs to identify the associated item.

# Changelog

## 0.4.12

- Fixed reverse status synchronization from Obsidian Bases to generated Decision, Risk, Issue, and Executive record pages.
- Fixed source-record matching so inline `s::o`, `s::d`, completion dates, and strikethrough do not prevent status updates.
- Added folder-path detection for Base edits so synchronization does not depend on metadata-cache timing.
- Base changes now update the source meeting line and regenerate the record page with canonical `Open` or `Done` status.

## 0.4.1

- Added a configurable Dashboard folder.
- Creates one master `Knowledge OS.base` in `01.Home/Dashboards` by default.
- Added views for open items, each record type, owner grouping, and recently closed records.
- Stopped creating folder-specific Base files.
- Existing Base files are never overwritten or deleted.


## 0.3.4

- Restored clickable People properties using short wikilinks such as `[[John Doe]]`.
- Person links no longer include folder paths.
- Generated decision, risk, and issue body text remains plain-language.

## 0.3.3

- Restored trailing record tags in generated Person-page entries as plain text without the `#` symbol.
- Kept decision, risk, and issue YAML values clean; tags remain separately captured in the `tags` property.
- Preserved reverse strikethrough synchronization for managed Person-page records.

## 0.3.2

- Store People metadata as canonical names without folder paths or wikilinks.
- Store decisions, risks and issues as clean text.
- Remove visible hashtag markers from generated text while retaining tags in properties.
- Add hidden stable IDs to generated Person-page records.
- Add controlled reverse synchronization for strikethrough status from Person pages to source notes.
- Keep Person pages excluded from normal record extraction to prevent duplication and sync loops.


## 0.3.1

- Replaced all real-person examples with `John Doe`.
- Simplified the embedded settings reference.
- Removed any suggestion of copy buttons.
- Retained native Obsidian alias resolution and manual-first synchronization.

## 0.4.4

- Added the Command Palette action **Sync Knowledge OS Status Changes**.
- The command scans all managed Knowledge OS record notes, applies status changes made through Bases to their source meeting items, and refreshes generated records and associated People pages.
- Preserved the existing plugin ID and installation folder name: `aceto-metadata-sync`.
