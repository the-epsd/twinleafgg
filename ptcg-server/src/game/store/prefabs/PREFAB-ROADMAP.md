# Prefab Roadmap (2026-02-11)

This document captures the current prefab backlog agreed during card implementation planning.
It includes proposed prefab names, candidate reference cards, and implementation notes.

## Naming decision

- Use long, explicit prefab names.
- Favor names that mirror common card text and existing uppercase prefab style.

## Backlog table

| Need | Proposed Prefab | Candidate cards |
|---|---|---|
| Discard (up to) X Energy from this Pokemon | `DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON` | Mega Diancie ex (`PFL`), Scizor ex (`TEF`), Ethan's Magcargo (`DRI`) |
| Discard (up to) X Energy from your Pokemon | `DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON` | Groudon (`PAR`), Raging Bolt ex (`TEF`), Electrode-GX (`CES`) |
| Discard (up to) X typed Energy from your Pokemon | `DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON` | Chien-Pao ex (`PAL`), Sinistcha (`TWM`), Raichu V (`BRS`) |
| Rain Dance / Deluge pattern with type param | `AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND` | Blastoise (Rain Dance, `BS`), Blastoise (Deluge, `BCR`), Emboar (Inferno Fandango, `BLW`) |
| Attach X Energy from discard to 1 of your Pokemon | `ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON` | Dark Patch (`ASR`), Eelektrik (Dynamotor, `NVI`), Marnie's Pride (`BRS`) |
| Attach up to X Energy from deck to Y of your Pokemon | `ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON` | Mirage Gate (`LOR`), Janine's Secret Art (`SFA`), Marnie's Grimmsnarl ex (`DRI`) |
| Flip until tails and return count | `FLIP_UNTIL_TAILS_AND_COUNT_HEADS` | Jigglypuff (`PFL`), Swanna (`DEX`), Rayquaza Star (`DX`) |
| Mill yourself | `DISCARD_TOP_X_CARDS_FROM_YOUR_DECK` | Regidrago VSTAR (`SIT`), Tyranitar (`PAL`), Wo-Chien (`SSP`) |
| Check VSTAR marker | `BLOCK_IF_VSTAR_POWER_USED` | Darkrai VSTAR (`ASR`), Regidrago VSTAR (`SIT`), Raichu (`SIT`, opponent marker check case) |
| Count matching cards in discard/lost zone | `COUNT_MATCHING_CARDS_IN_ZONE` | Roaring Moon (`TEF`), Vespiquen (`AOR`), Jumpluff (`LOT`) |
| Does this Pokemon have any Energy attached | `THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED` | Dragonair (`ASC`), Zamazenta (`CRZ`), Voltorb (`RG`) |
| Protect your Benched Pokemon from damage | `PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS` | Mew (`UNB`), Manaphy (`BRS`), Mr. Mime (`PLF`) |
| Protect your Benched Pokemon from effects | `PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS` | Rabsca (`TEF`), Cloyster (`DF`), Sky Pillar (`CES`) |
| Protect from Special Conditions | `PREVENT_AND_CLEAR_SPECIAL_CONDITIONS` | Virizion-EX (`PLB`), Cobalion-GX (`TEU`), Therapeutic Energy (`PAL`) |
| Can't use this attack next turn | `THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN` | Umbreon (`DEX`), Kyurem-EX (`NXD`), Iron Moth (`PAR`) |
| Can't attack next turn | `THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN` | Koraidon ex (`SVI`), Aegislash (`M3`), Regieleki VMAX (`SIT`) |
| Recoil damage | `THIS_POKEMON_DOES_DAMAGE_TO_ITSELF` (existing) | Flareon (`PLF`), Luxray (`PAL`), Zacian VSTAR (`CRZ`) |
| Gust (including conditional gust) | `GUST_OPPONENT_BENCHED_POKEMON` | Pokemon Catcher (`SVI`), Counter Catcher (`PAR`), Ninetales (Nine Temptations, `TEU`) |
| Move X/all damage counters from Y to Z | `MOVE_DAMAGE_COUNTERS` | Reuniclus (`BLW`), Munkidori (`TWM`), Alakazam (`TWM`) |
| Look at top X, take up to Y cards to hand (configurable remainder handling) | `LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING` | Bill's Analysis (`TEU`), Metagross (`DS`), Colress's Experiment (`LOR`) |
| Look at top X, attach up to Y Energy | `LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY` | Electric Generator (`SVI`), Gloom (`MEW`), Hydreigon (Tri Howl, `PAL`) |
| Look at top X, bench up to Y Pokemon | `LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON` | Reuniclus (`TEF`), Tatsugiri ex (`SSP`), Grimsley's Move (`PFL`) |
| On damaged by attack, even if KO | `ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT` | Druddigon (`NVI`), Hitmonchan (`MEW`), Heatran (`TWM`) |

## Clarifications to preserve

- Mirage Gate behavior:
  - The 2 selected basic Energy cards must be different types.
  - They can be any basic types.
- Flip-until-tails:
  - There are multiple existing implementations; consolidate around one reusable helper.
- VSTAR marker checks:
  - Existing one-per-game enforcement already exists in many cards.
  - Keep helper focused on guard/check convenience.
- Count matching in zone:
  - Must support extra constraints such as attack-name filters for patterns like Night March / United Wings.
- Energy default behavior for new helpers:
  - Default should include all Energy.
  - Optional filtering should be supported and passed by caller.
  - Needed for cases like Thundurus-EX (`PLF`) and Crushing Hammer-style effects.

## Implementation decision (open but preferred)

- For "look at top X cards..." families, prefer:
  - one configurable core engine function, plus
  - small wrapper prefabs for common hand/attach/bench behaviors.
