# Implementing Card Effects from Auto-Generated Stubs

You are working with auto-generated card stubs. All card stats (HP, type, weakness, resistance, retreat, attacks, cost, damage) are already filled in. Your job is to implement the game logic inside `reduceEffect()` for cards marked with TODO comments.

---

## Your Workflow

### 1. Find the TODO

Look for `// TODO:` comments inside `reduceEffect()`. The card text describing the effect is right there:

```typescript
// Attack 1: Flare
// TODO: Flip a coin. If heads, this attack does 30 more damage.
if (WAS_ATTACK_USED(effect, 0, this)) {
  // Implement effect here   <-- YOUR JOB
}
```

### 2. Search for Similar Effects (MANDATORY)

**Before writing ANY code**, search the codebase for cards with similar effects. This is the single most important step. The codebase has hundreds of implemented cards — your effect has almost certainly been done before.

**Search by card text:**
```bash
grep -r "more damage" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "is now Paralyzed" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "damage to.*Benched" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "Discard.*Energy" ptcg-server/src/sets/ --include="*.ts" -l
```

**Search by prefab usage:**
```bash
grep -r "FLIP_A_COIN_IF_HEADS" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "SWITCH_ACTIVE_WITH_BENCHED" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "THIS_POKEMON_DOES_DAMAGE_TO_ITSELF" ptcg-server/src/sets/ --include="*.ts" -l
```

**Search by effect type:**
```bash
grep -r "AfterAttackEffect" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "BetweenTurnsEffect" ptcg-server/src/sets/ --include="*.ts" -l
grep -r "DealDamageEffect" ptcg-server/src/sets/ --include="*.ts" -l
```

Read the matching files. Use them as your reference implementation.

**Cite your references.** When you implement an effect based on a reference card, replace the `// TODO:` comment with a `// Ref:` comment citing the file and attack name you used:

```typescript
// Single reference:
// Ref: set-emerging-powers/darmanitan.ts (Rock Smash)

// Multiple references (when combining patterns):
// Refs: set-noble-victories/stunfisk.ts (coin handling), set-noble-victories/audino.ts (self-heal)
```

This is **required** for every implemented effect. It helps reviewers verify correctness and helps future agents find examples. The `// Ref:` comment replaces the `// TODO:` line — do not leave both.

### 3. Check Text-to-Code Patterns

Read **AGENTS-patterns.md** in this directory. It maps common card text phrases directly to code, covering drawing, special conditions, coin flips, damage, healing, switching, energy, searching, and more.

### 4. Implement Using Prefabs

Always prefer prefab functions over custom logic. Read **CLAUDE-prefabs.md** for the complete list of available prefabs with signatures.

### 4.5 Public vs Private Knowledge (Search Rules)

This is a core rules concept and must be handled correctly:

- **Private knowledge zones** (usually the deck): if card text asks you to find a specific subset (for example, "a Pokemon", "2 Basic Energy"), the player may select fewer than requested or fail, because the opponent cannot verify deck contents.
- **Public knowledge zones** (discard, in-play, etc.): required counts are mandatory unless text says "up to".
- **Known guaranteed target in private zone**: if text is broad enough that a legal target is guaranteed when the zone is non-empty (for example, "search your deck for a card"), do not allow failing.

Examples:
- `Computer Search` ("a card") should be mandatory when the deck has cards.
- `Ultra Ball` style Pokemon search can fail, because deck contents are private.
- Discard-pile retrieval should follow exact counts unless the card says "up to".

### 5. Verify Compilation

After implementing cards, run:
```bash
cd ptcg-server && npx tsc --noEmit
```

---

## Critical Effect Timing

**This is the #1 source of bugs.** Use the correct effect type based on WHEN the effect occurs:

| Effect Type | When It Fires | Use For |
|-------------|---------------|---------|
| `AttackEffect` / `WAS_ATTACK_USED` | **Before** damage | Modifying damage, paying costs, setting flags |
| `AfterAttackEffect` | **After** damage | Switching Pokemon, effects that happen post-damage |

### WRONG (switches before damage is dealt):
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent); // BUG!
}
```

### CORRECT (switches after damage):
```typescript
public usedMyAttack = false;

if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedMyAttack = true;
}

if (effect instanceof AfterAttackEffect && this.usedMyAttack) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
}

if (effect instanceof EndTurnEffect) {
  this.usedMyAttack = false;
}
```

For the full effect timing reference, read **CLAUDE-effects.md**.

---

## When to Restructure the Stub

The generated stub uses `WAS_ATTACK_USED` and `WAS_POWER_USED` as starting points. These are correct for most cases, but some effects need restructuring:

### Passive Abilities (between turns, damage interception)

The stub generates:
```typescript
if (WAS_POWER_USED(effect, 0, this)) {
  // Implement ability here
}
```

But `WAS_POWER_USED` only works for **activated** abilities (player clicks to use). Passive abilities that trigger automatically need a different approach:

- **"Between turns" abilities** (e.g., "heal 10 damage between turns") → Intercept `BetweenTurnsEffect`
- **Damage modification abilities** (e.g., "reduce damage by 20") → Intercept `DealDamageEffect`
- **Always-on type changes** → Intercept `CheckProvidedEnergyEffect`

**Delete the `WAS_POWER_USED` block and replace it** with the appropriate effect intercept. Search for similar abilities in the codebase for the right pattern.

### Post-Damage Attack Effects

If the attack text says something happens **after** damage (switching, healing based on damage dealt), restructure to use the `AfterAttackEffect` flag pattern shown above.

---

## Self-Attack Restrictions

For "can't use [Attack] next turn" — use the built-in system (NO cleanup needed):
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.active.cannotUseAttacksNextTurnPending.push('Attack Name');
}
```

For "can't attack next turn":
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  player.active.cannotAttackNextTurnPending = true;
}
```

---

## Marker Cleanup

Every marker you add MUST be cleaned up in `EndTurnEffect`:
```typescript
if (effect instanceof EndTurnEffect) {
  effect.player.marker.removeMarker(this.MY_MARKER, this);
}
```

## "Once During Your Turn" Abilities

Use the dedicated prefab for activated abilities:
```typescript
if (WAS_POWER_USED(effect, 0, this)) {
  const player = effect.player;
  // card-specific validation first...
  USE_ABILITY_ONCE_PER_TURN(player, this.MY_ABILITY_MARKER, this);
  ABILITY_USED(player, this);
  // ability effect...
}

REMOVE_MARKER_AT_END_OF_TURN(effect, this.MY_ABILITY_MARKER, this);
```

---

## Key Prefabs Quick Reference

### Detection (Type Guards)
```typescript
WAS_ATTACK_USED(effect, index, this)   // Returns typed AttackEffect
WAS_POWER_USED(effect, index, this)    // Returns typed PowerEffect
AFTER_ATTACK(effect, index, this)      // Returns typed AfterAttackEffect
WAS_TRAINER_USED(effect, this)         // Returns typed TrainerEffect
```

### Drawing
```typescript
DRAW_CARDS(player, count)
DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, count)
```

### Searching
```typescript
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, filter?, options?)
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, filter?, options?)
SHUFFLE_DECK(store, state, player)
```

### Damage
```typescript
THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, amount)
HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage)
```

### Switching
```typescript
SWITCH_ACTIVE_WITH_BENCHED(store, state, player)
```

### Coin Flips
```typescript
COIN_FLIP_PROMPT(store, state, player, callback)
MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, amount, callback)
FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, damage)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads)
```

### Blocking / Checks
```typescript
IS_ABILITY_BLOCKED(store, state, player, card)
BLOCK_IF_DECK_EMPTY(player)
USE_ABILITY_ONCE_PER_TURN(player, marker, source)
```

### Energy
```typescript
DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, amount, type?)
DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect)
```

For the complete prefab reference with all signatures and imports, read **CLAUDE-prefabs.md**.

---

## Important Rules

1. **Always return `state`** from `reduceEffect()`
2. **Use prefabs first** — search before writing custom logic
3. **Check ability locks** with `IS_ABILITY_BLOCKED()` before ability effects
4. **Energy shorthand in properties, `CardType.TYPE` in logic** — Use `G`, `R`, `W` in card properties (already in stubs). Use `CardType.GRASS`, `CardType.FIRE`, `CardType.WATER` inside `reduceEffect()` logic.
5. **Clean up markers** on `EndTurnEffect` — every marker must be removed
6. **`effect.preventDefault = true`** to block effects
7. **Never modify state directly** — use `store.reduceEffect()` to dispatch sub-effects
8. **Energy symbols in text** — Use `[G]`, `[R]`, `[W]`, `[L]`, `[P]`, `[F]`, `[D]`, `[M]` instead of "Grass", "Fire", etc.
9. **Cite your references** — Replace `// TODO:` with `// Ref: set-name/file.ts (Attack Name)` for every implemented effect

---

## Detailed Reference Files

Read these files in this directory (`ptcg-server/src/sets/`) for in-depth documentation:

| File | Read When |
|------|-----------|
| **AGENTS-patterns.md** | Translating card text to code — maps text phrases to prefab calls |
| **CLAUDE-prefabs.md** | You need exact prefab function signatures and import paths |
| **CLAUDE-effects.md** | You need to understand effect timing or use advanced effect patterns |
| **CLAUDE-state.md** | You need to access PokemonCardList, Player, or StateUtils properties |
| **CLAUDE-enums.md** | You need CardTag, GameMessage, SpecialCondition, or other enum values |
| **CLAUDE-examples.md** | You want complete working card implementations to reference |
| **CLAUDE.md** | General card development overview and gotchas |
