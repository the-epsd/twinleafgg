# Noble Victories (NVI) Set

Black & White era expansion featuring several complex ability and attack patterns.

## Notable Implementations

### Complex Abilities
| Card | Ability | Pattern |
|------|---------|---------|
| `hydreigon.ts` | Dark Aura | Energy type conversion via `CheckProvidedEnergyEffect` |
| `leavanny.ts` | Leaf Tailor | Weakness modification via `CheckPokemonStatsEffect` |
| `druddigon.ts` | Rough Skin | Damage reflection via `AfterDamageEffect` |
| `jellicent.ts` | Cursed Body | Energy discard on damage via `AfterDamageEffect` |
| `cofagrigus-2.ts` | Chuck into the Chest | Prize manipulation + turn ending |
| `eelektrik.ts` | Dynamotor | Energy attachment from discard (repeatable) |
| `chandelure.ts` | Cursed Shadow | Damage counter placement ability |
| `garbodor.ts` | Garbotoxin | Ability lock when Tool attached |
| `reuniclus.ts` | Damage Swap | Move damage counters between own Pokemon |

### Complex Attacks
| Card | Attack | Pattern |
|------|--------|---------|
| `accelgor.ts` | Deck and Cover | Self-shuffle with paralysis/poison (uses `SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK` prefab) |
| `virizion.ts` | Leaf Wallop | Next turn bonus damage with markers |
| `cofagrigus.ts` | Damagriiigus | Move damage counters from own to opponent |
| `karrablast.ts` / `shelmet.ts` | Mysterious Evolution | Conditional evolution requiring partner in play |
| `volcarona.ts` | Fiery Dance | Attach energy from discard |
| `kyurem.ts` | Glaciate | Spread damage to all opponent's Pokemon |
| `durant.ts` | Devour | Mill cards from opponent's deck |

## Key Patterns to Reference

### Energy Type Conversion (hydreigon.ts)
```typescript
if (effect instanceof CheckProvidedEnergyEffect) {
  effect.energyMap.forEach(em => {
    if (em.card.energyType === EnergyType.BASIC) {
      em.provides = em.provides.map(() => CardType.DARK);
    }
  });
}
```

### Damage Retaliation (druddigon.ts)
```typescript
if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
  if (effect.damage <= 0 || state.phase !== GamePhase.ATTACK) return state;
  // Must be active and hit by opponent
  effect.source.damage += 20;
}
```

### Conditional Evolution (karrablast.ts)
```typescript
// Check all players for partner Pokemon
state.players.forEach(p => {
  p.forEachPokemon(PlayerType.BOTTOM_PLAYER, ...);
  p.forEachPokemon(PlayerType.TOP_PLAYER, ...);
});
```

## Gotchas Discovered

- **AfterDamageEffect timing**: Check `state.phase !== GamePhase.ATTACK` to avoid triggering on poison/burn
- **Marker cleanup for "next turn"**: Remove from opponent's perspective in `EndTurnEffect`
- **Prize cards**: Set `isSecret = true` when moving cards to prizes
- **Self-shuffle attacks**: Use `SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK` prefab in `AFTER_ATTACK`. Reference: `set-brilliant-stars/lumineon-v.ts`

## Evolution Lines
- Tynamo -> Eelektrik -> Eelektross
- Litwick -> Lampent -> Chandelure
- Deino -> Zweilous -> Hydreigon
- Karrablast -> Escavalier (needs Shelmet in play)
- Shelmet -> Accelgor (needs Karrablast in play)
- Sewaddle -> Swadloon -> Leavanny
- Yamask -> Cofagrigus (two variants: NVI 46, NVI 47)
