# ACE2X Knowledge OS 0.4.9

Manual-first Obsidian knowledge synchronization with preview and undo.

## Core syntax

```markdown
d:: [[John Doe|JD]] approved the #Infrastructure proposal. s::d
r:: Vendor delays may impact the schedule. [[John Doe]] s::o
i:: Production deployment is blocked. s::o
e:: Confirm FY27 funding with [[John Doe]]. s::o
```

- `d::` Decision
- `r::` Risk
- `i::` Issue
- `e::` Executive follow-up
- `[[Person]]` Native person reference. Obsidian aliases are supported.
- `- [ ]` Your task
- Plain bullet ending with `[[Person]]` Another person's action
- `s::o` / `s::d` Compact inline status. `s::c`, `closed`, `complete`, and `done` are also accepted as Done inputs.
- `done::YYYY-MM-DD` Date the record was marked Done; added automatically
- `~~text~~` Legacy closed or superseded content; still recognized for compatibility

## People and aliases

A page is treated as a person when it is in the configured People folder or contains:

```yaml
type: person
aliases:
  - JD
  - John
  - John D
```

Obsidian resolves `[[JD]]` to the correct person page through aliases. Existing aliases require no custom mapping.

## Missing links

Unresolved links are shown in Preview. Automatic person-page creation is off by default because an unresolved link may represent a project, vendor, technology, or another non-person page.

## Commands

- Analyze current note
- Sync current note
- Sync current folder
- Sync entire vault
- Undo last sync

## Synchronization

Decisions and issues may be written to managed blocks on associated person pages. Risks are not written to person pages; person templates should surface them dynamically through Dataview. Existing plugin-managed risk blocks are removed during synchronization. Editing status, removing a person, or deleting a mirrored record updates previously associated person pages after the source note is synced again. Status changes made in a Base are written back to the source line. Done records receive `s::d`, `done::YYYY-MM-DD`, and full-line strikethrough. Reopened records return to `s::o` and have the date and strikethrough removed.

## Settings reference

The plugin settings page includes a concise syntax reference for decisions, risks, issues, tasks, person links, tags, aliases, and closed records. All examples use generic placeholder names.




## v0.4.9 ACE2X rename and compact status syntax

- Renamed the plugin to **ACE2X Knowledge OS**.
- Changed the plugin ID and installation folder to `ace2x-knowledge-os`.
- New source-note canonical syntax is `s::o` for Open and `s::d` for Done.
- `s::c`, `s::done`, `s::closed`, and `s::complete` are accepted as Done and normalized to `s::d`.
- Generated record YAML and Bases always display plain-text `Open` or `Done`.
- The default master Base filename is `00.🎛️ Master.base` in the configured dashboard folder. Existing legacy settings and indexes are migrated when available.

## v0.4.8 completion dates and visual closure

- Status remains intentionally limited to `Open` and `Done`.
- Changing a record from Open to Done adds `done::YYYY-MM-DD` using the local date of the status change.
- Done records are struck through across the full source line.
- Reopening a record removes the completion date and strikethrough.
- Repeated synchronization preserves the original completion date.
- Generated record YAML includes `completed_date` when the source line has a completion date.

Canonical completed format:

```markdown
~~d:: [[John Doe]] Approve the proposal. #Infrastructure s::d done::2026-07-18~~
```

## v0.4.7 inline status synchronization

- Meeting records may include an inline status at the end of the same line: `s::o` or `s::d`.
- The supported canonical format is `<type>:: [[Owner]] sentence #Tag s:: Status`.
- Generated record notes store the same value in the YAML `status` property.
- Editing `status` in the Knowledge OS Base and running **Sync Knowledge OS Status Changes** updates the corresponding source line's `s::` value.
- Editing `s::` in a source note and syncing that note updates the generated record and Base.
- Existing strikethrough records remain recognized as Done for backward compatibility.

## v0.3.2 synchronization behaviour

- YAML stores canonical names rather than full vault paths or wikilinks.
- Generated decision, risk and issue text removes visible wikilink syntax and hashtag markers.
- Tags remain available in the `tags` property without being repeated at the end of generated entries.
- Person pages remain excluded from normal capture. Managed record entries include hidden IDs.
- Striking through or restoring a managed decision or issue on a Person page updates the original source note and then refreshes all mirrors. Risks are managed through their generated records and Dataview output.
- Other edits inside managed Person-page entries are not treated as source content.


## People properties

People properties are stored as clickable short wikilinks, for example `[[John Doe]]`, without exposing the People folder path.


## v0.4.0 executive follow-ups and Bases

- `e::` creates an Executive Follow-up record in `12. 🎯 Executive` by default.
- Decisions, risks, issues, and executive follow-ups are also created as structured Markdown record notes.
- Record properties include `type`, `sentence`, `owner`, `source`, `status`, `date`, and a hidden stable `record_id`.
- Owners and source files use clickable short wikilinks without displaying vault paths.
- The plugin creates one native Obsidian Base dashboard only when missing and never overwrites it.
- The default Base filename is `00.🎛️ Master.base` in `01.Home/Dashboards`.
- The dashboard folder can be changed in plugin settings.
- The master Base includes views for All Open Items, Executive Follow-ups, Decisions, Risks, Issues, By Owner, and Recently Done.
- Views display Type, Sentence, Owner, Source File, Status, and Date.
- Record folders contain only their individual Markdown records. Existing folder-level `.base` files from v0.4.0 are not deleted automatically and may be removed manually.
- Managed record-folder paths can still be changed in plugin settings.

## v0.4.3 centralized Home dashboard

- Replaced automatic folder-level Base creation with one configurable master `Knowledge OS.base`.
- Default dashboard folder: `01.Home/Dashboards`; default Base filename: `00.🎛️ Master.base`.
- Existing custom Bases are preserved and never overwritten.

## v0.4.3

- Adds a configurable master Base filename.
- Status changes made in the Base record row synchronize to the source meeting and applicable person-page mirrors using the stable record ID. Risk tables on person pages update through Dataview.
- Closed, complete, completed, done, and resolved are treated as closed; open and other values are treated as open.


## Dynamic folder locations

Folder settings use vault-backed dropdown selectors rather than typed paths. The plugin can auto-detect likely People, Executive, Decisions, Risks, Issues and Dashboard folders when a configured folder is missing. When a selected folder is renamed or moved within Obsidian, the plugin updates its saved folder locations automatically.

## Manual status synchronization

Run **ACE2X Knowledge OS: Sync Knowledge OS Status Changes** from the Command Palette whenever you want to apply status edits made in the Knowledge OS Base. The command scans all managed record notes and updates matching source meeting items and applicable People-page mirrors. Risk views update through Dataview rather than written blocks.

The plugin ID is `ace2x-knowledge-os`. This renamed release installs as a new plugin identity. On first launch it attempts to migrate settings and indexes from the former plugin folders. Remove or disable the former Aceto Knowledge OS plugin after confirming the new installation.

## Installation folder

Install the plugin at:

```text
.obsidian/plugins/ace2x-knowledge-os/
```

The release ZIP includes this stable folder name. Future releases can replace its contents without creating a versioned plugin directory.


## Base sentence display

Tags remain visible in generated `Sentence` values as normal words without the `#` prefix and are also retained in the `tags` property.
