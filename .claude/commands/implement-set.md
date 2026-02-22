# Implement Set: $ARGUMENTS

You are the **leader agent** orchestrating the implementation of all cards in `$ARGUMENTS`. You will generate stubs, classify cards, spawn parallel implementer agents, then spawn parallel reviewer agents, and finally commit.

**Phase status file:** At the start of each phase, write the current phase name to `.claude/set-progress/$ARGUMENTS-phase.txt` so the outer bash script can display progress. Use the Write tool to overwrite the file each time. The phase names are: `starting`, `implementing`, `reviewing`, `committing`, `complete`.

---

## Phase 1: Generate Stubs

Write `starting` to `.claude/set-progress/$ARGUMENTS-phase.txt`.

Run the stub generator:

```
npx ts-node ptcg-server/src/sets/generate-set-stubs.ts $ARGUMENTS
```

Parse the summary output to get counts (vanilla, effect, reprint, skipped). If stubs already exist (all skipped), note that and move on.

---

## Phase 2: Check Progress

Read `.claude/set-progress/$ARGUMENTS.json` if it exists.

- If `"status": "complete"` → print "Set $ARGUMENTS already complete" and exit immediately.
- If it exists with partial progress → resume from where we left off (skip cards listed in `implemented`).
- If it doesn't exist → this is a fresh start.

---

## Phase 3: Classify & Divide

Scan all `.ts` files in `ptcg-server/src/sets/$ARGUMENTS/` (excluding `index.ts`, `other-prints.ts`, and `card-data.json`) for `// TODO:` comments. Only files with TODO comments need implementation. **Skip any file that has no `// TODO:` comments** — it is already implemented and must not be touched or overwritten.

**Classify each card by complexity:**

- **Tier 1 (simple):** Single-prefab Pokemon attacks — coin flip + damage, draw cards, single status condition, self-damage, heal. Also simple Item trainers (Switch, Potion, Energy Search — single prefab call). Look for: one `WAS_ATTACK_USED` block with simple text like "Flip a coin", "Draw", "is now Poisoned", "does X damage to itself".
- **Tier 2 (medium):** Multi-effect Pokemon attacks — coin flip + condition, discard energy + extra damage, "can't use X next turn", multiple attacks with effects. Also medium-complexity Items/Supporters (deck search + shuffle, discard-and-draw). Look for: multiple TODO blocks, or text combining two patterns.
- **Tier 3 (complex):** Abilities (passive or activated), Stadiums, Tools, special energy, AfterAttackEffect patterns (switching, bench damage after attack), markers, "once during your turn" abilities, complex deck/discard search effects. Look for: `WAS_POWER_USED`, trainer stubs with complex multi-step text, energy stubs.

**Divide into 3 batches**, mixing tiers evenly so no single agent gets all the hard cards. Aim for roughly equal file counts per batch.

**Create the progress file** at `.claude/set-progress/$ARGUMENTS.json`:
```json
{
  "set": "$ARGUMENTS",
  "status": "in_progress",
  "totalCards": <count>,
  "stubsGenerated": true,
  "batches": {
    "batch1": ["file1.ts", "file2.ts", ...],
    "batch2": ["file3.ts", "file4.ts", ...],
    "batch3": ["file5.ts", "file6.ts", ...]
  },
  "implemented": [],
  "reviewed": false,
  "lastUpdated": "<ISO timestamp>"
}
```

---

## Phase 4: Parallel Implementation

Write `implementing` to `.claude/set-progress/$ARGUMENTS-phase.txt`.

Spawn **3 `dev-implementer` agents** via the `Task` tool with `run_in_background: true` and `model: "sonnet"`. Each agent gets a prompt structured as follows. **All 3 agents must be spawned in a single message** (parallel tool calls).

### Agent prompt template (customize batch list per agent):

```
You are implementing Pokemon TCG cards for the twinleaf.gg simulator. You have been assigned a batch of card files to implement.

## MANDATORY: Read These Docs First

Before implementing ANY card, read these files in order:
1. ptcg-server/src/sets/AGENTS.md (your workflow guide)
2. ptcg-server/src/sets/AGENTS-patterns.md (card text → code mappings)
3. ptcg-server/src/sets/CLAUDE-prefabs.md (prefab function signatures)
4. ptcg-server/src/sets/CLAUDE-effects.md (effect timing reference - CRITICAL for Tier 2-3 cards)

## Your Batch

You are responsible for implementing ONLY these files in ptcg-server/src/sets/$ARGUMENTS/:

<list of files for this batch>

Do NOT edit any files outside your batch. Do NOT edit index.ts or other-prints.ts.

## Per-Card Workflow

For each card file in your batch:

1. **Read the file** - find the // TODO: comments describing the effects to implement. **If the file has no // TODO: comments, it is already implemented — SKIP IT entirely. Do not modify it.**
2. **Check for reprints** — BEFORE implementing, check if this card already exists in another set:
   - Search: `grep -r "public name.*'CardName'" ptcg-server/src/sets/ --include="*.ts" -l` (replace CardName with the card's name)
   - If you find a match in another set, read that file and compare attack names and ability names
   - If the card has the same name, same attack names, and same ability/power names → it is a **REPRINT**
   - For reprints: replace the stub file's entire content with a minimal reprint class (see Reprint Pattern below). Do NOT re-implement effects that already exist elsewhere.
3. **Search for similar effects** - this is MANDATORY before writing any code:
   - Search by card text keywords (e.g., grep for "more damage", "is now Paralyzed")
   - Search by prefab usage (e.g., grep for "FLIP_A_COIN_IF_HEADS")
   - Read 1-2 matching reference implementations
4. **Implement the effect** using prefabs from CLAUDE-prefabs.md, following the reference
5. **Replace // TODO: with // Ref:** - cite which file and attack/ability you used as reference:
   - Single ref: // Ref: set-emerging-powers/darmanitan.ts (Rock Smash)
   - Multiple refs: // Refs: set-noble-victories/stunfisk.ts (coin handling), set-noble-victories/audino.ts (self-heal)
   - EVERY implemented effect MUST have a // Ref: comment. This is non-negotiable.

## Reprint Pattern

When you identify a card as a reprint (step 2 above), replace the entire stub file with this pattern:

```typescript
import { OriginalClassName } from '../set-original-set/original-file';

export class NewClassName extends OriginalClassName {
  public set: string = 'SET_CODE';
  public setNumber: string = 'NUMBER';
  public fullName: string = 'CardName SET_CODE';
}
```

- Import the original class from its set directory
- Extend it, overriding ONLY `set`, `setNumber`, and `fullName`
- The reprint inherits all stats, attacks, abilities, and effects from the original
- Report the file as a reprint (not an implementation) in your summary

## Critical Rules

- Always return `state` from reduceEffect
- Use prefabs first — never write custom logic when a prefab exists
- Check ability locks with IS_ABILITY_BLOCKED() before any ability effect
- Energy shorthand (R, W, G) only in card properties — use CardType.FIRE etc. inside reduceEffect logic
- Every addMarker must have matching removeMarker in EndTurnEffect
- SWITCH_ACTIVE_WITH_BENCHED only in AfterAttackEffect, never in WAS_ATTACK_USED
- No Math.random() — use COIN_FLIP_PROMPT
- Special conditions (Paralyzed, Poisoned, etc.) use WAS_ATTACK_USED, not AFTER_ATTACK

## Compilation Check

After implementing every 8-12 cards, run:
```
cd ptcg-server && npm run compile
```
Fix any TypeScript errors before continuing.

## When Done

After implementing all cards in your batch, run a final `cd ptcg-server && npm run compile` and fix any remaining errors. Report the list of files you implemented.
```

**Wait for all 3 agents to complete.** Monitor their output files periodically.

After all 3 finish, run `cd ptcg-server && npm run compile` yourself. If there are errors, fix them.

**Determine which files were actually implemented:** Scan each batch file for remaining `// TODO:` comments. Files with no remaining `// TODO:` comments are considered implemented. Update the progress file's `"implemented"` array with only the files confirmed done. This is more reliable than agent self-reporting, especially if an agent crashed partway through.

---

## Phase 5: Parallel Review

Write `reviewing` to `.claude/set-progress/$ARGUMENTS-phase.txt`.

Spawn **3 `code-quality-reviewer` agents** via the `Task` tool with `run_in_background: true` and `model: "sonnet"`. Each reviewer gets the batch that was implemented by a different implementer. **All 3 agents must be spawned in a single message** (parallel tool calls).

### Reviewer prompt template:

```
You are reviewing Pokemon TCG card implementations for the twinleaf.gg simulator. You have been assigned a batch of recently-implemented card files to review and fix.

## MANDATORY: Read These Docs First

Before reviewing, read these files:
1. ptcg-server/src/sets/AGENTS.md (implementation workflow)
2. ptcg-server/src/sets/AGENTS-patterns.md (card text → code mappings)
3. ptcg-server/src/sets/CLAUDE-prefabs.md (prefab function signatures)
4. ptcg-server/src/sets/CLAUDE-effects.md (effect timing reference)

## Your Batch to Review

Review ONLY these files in ptcg-server/src/sets/$ARGUMENTS/:

<list of files for this batch>

## Review Checklist

For each file, verify:

1. **No remaining // TODO: comments** — every effect must be implemented
2. **Every effect has // Ref: comment** — citing the specific reference file and attack/ability name (e.g., // Ref: set-noble-victories/stunfisk.ts (Rumble))
3. **Marker cleanup** — every addMarker has matching removeMarker in EndTurnEffect
4. **Correct AfterAttackEffect usage** — SWITCH_ACTIVE_WITH_BENCHED only in AfterAttackEffect blocks, never in WAS_ATTACK_USED
5. **No Math.random()** — must use COIN_FLIP_PROMPT or MULTIPLE_COIN_FLIPS_PROMPT
6. **No energy shorthand in logic** — no R, W, G etc. inside reduceEffect; must use CardType.FIRE, CardType.WATER, etc.
7. **No raw instanceof AttackEffect** — must use WAS_ATTACK_USED prefab
8. **IS_ABILITY_BLOCKED check** before every ability effect
9. **state is always returned** from reduceEffect
10. **Special conditions in WAS_ATTACK_USED** — not in AFTER_ATTACK
11. **Prefab usage** — custom logic should not duplicate what a prefab already does
12. **cannotUseAttacksNextTurnPending** — no manual cleanup for "can't use X next turn" (system handles it)

## Fix Issues Directly

You have edit access. When you find issues, fix them directly in the file. Do not just report — fix.

## Review Notes

After reviewing all files, write a brief summary to a **batch-specific file** — `.claude/set-progress/$ARGUMENTS-review-notes-batchN.md` (where N is your batch number: 1, 2, or 3) — containing:
- Common mistakes found across your batch (with examples)
- New patterns that should be documented for future sets
- Missing prefabs or documentation gaps
- Any cards that were particularly tricky or might need manual attention

Each reviewer writes to their own file to avoid conflicts.
```

**Wait for all 3 reviewers to complete.** Then run `cd ptcg-server && npm run compile` yourself. Fix any remaining errors.

---

## Phase 5.5: Update Documentation

Read all review notes files (`.claude/set-progress/$ARGUMENTS-review-notes-batch1.md`, `-batch2.md`, `-batch3.md`) and incorporate learnings:

- **Recurring mistakes** → add gotcha to `ptcg-server/src/sets/AGENTS.md` under "Gotchas & Learnings" or similar section
- **New patterns** → add to `ptcg-server/src/sets/AGENTS-patterns.md`
- **New prefab usage** → update `ptcg-server/src/sets/CLAUDE-prefabs.md` with example
- **Skill-specific learnings** → update the twinleaf-card-implementer skill if applicable

This feedback loop improves docs for future sets.

---

## Phase 6: Commit & Finalize

Write `committing` to `.claude/set-progress/$ARGUMENTS-phase.txt`.

1. Run `cd ptcg-server && npm run compile` — **must pass clean with ZERO errors. If compilation fails, fix ALL errors before proceeding. Do NOT commit if there are any TypeScript errors. Repeat compile-fix cycles until clean.**
2. Stage the set's files: `git add ptcg-server/src/sets/$ARGUMENTS/`
3. Check for modified docs with `git diff --name-only ptcg-server/src/sets/AGENTS.md ptcg-server/src/sets/AGENTS-patterns.md ptcg-server/src/sets/CLAUDE-prefabs.md` — stage only files that appear in the output
4. Commit with message: `Implement $ARGUMENTS card effects`
5. Update `.claude/set-progress/$ARGUMENTS.json`: set `"status": "complete"`, `"reviewed": true`, update `"lastUpdated"`

Write `complete` to `.claude/set-progress/$ARGUMENTS-phase.txt`.

Done! Print a summary: total cards, vanilla, effects implemented, reprints, any issues found during review.
