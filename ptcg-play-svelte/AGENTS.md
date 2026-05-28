# Frontend Agent Notes

This is the Svelte 5 frontend for playing and testing Pokemon TCG games. The
goal is not to make a generic app shell or a demo UI. The goal is a readable,
fast, faithful play surface where the board state is obvious and the player can
act without fighting the interface.

## Keep It Simple

KISS: keep it simple. We do not like hacks. We like clean, robust code that
follows normal frontend and Svelte best practices. Dumb hacks, brittle special
cases, and clever fixes that only work for one screenshot are not acceptable.

## Build For Obviousness

Fight for obvious UI. If a card is playable, selected, attached, damaged,
hovered, or being targeted by a prompt, that state should be visually clear
without explanation. Prefer direct visual mappings over clever abstractions:
cards should look like cards, attachments should sit on the Pokemon they belong
to, and scroll/overflow affordances should appear where the player needs them.

When a visual detail feels wrong, fix the underlying layout or component rule
instead of piling on z-index tricks, magic offsets, or wrappers that only happen
to work for the current screenshot. Shadows, hover states, selected states,
masks, and overlays should have enough layout room to render cleanly.

Do not shrink important cards just to make overflow easier. Preserve card scale
and board readability unless the user explicitly asks for smaller cards. Prefer
scrolling, stable responsive tokens, and clear layout constraints.

## Svelte 5

Use Svelte 5 patterns. Prefer `$state`, `$derived`, and `$effect` for component
state and reactivity. Keep state local when it belongs to one component. Do not
introduce stores, context, or global coordination for one-off UI behavior.

Use the existing component primitives and tokens before adding new structure:
`CardTile`, `BoardSlot`, `Hand`, `SelectableCard`, `PromptPanel`, and the sizing
tokens in `TableShell.svelte` and `styles/tokens.css`.

## Rewrite Freely

We are not optimizing for extreme legacy compatibility inside this app. If a
first version of a feature needs to change a few prompts later, do not layer
compatibility slop on top of it. Remove or replace the earlier approach when
that produces simpler, clearer code.

It is fine to throw out code that no longer matches the product direction. Smart
agents can write better code than they can maintain a pile of special cases.
Prefer one clean current path over preserving several historical paths.

## Visual QA

For UI changes, reason through the actual states the player will see: active
Pokemon, benched Pokemon, hand cards, overflowing hands, prompt dialogs, hover,
selected, disabled, face-down, and attached-card states.

Watch especially for clipping, accidental shrinking, layout shifts, text
overlap, mismatched scale between active and bench views, and shadows or glows
being cut off by scroll containers.

## Checks

Do not run expensive checks reflexively after every small CSS tweak. Agents are
expected to reason carefully.

Run `npm run build` and `npm test` for larger changes, behavior changes, shared
component changes, prompt-selection logic, game-state logic, or before committing
a meaningful batch. For very small visual-only edits, a targeted inspection is
often enough.
