import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType } from "../../../game";
import { ApplyWeaknessEffect } from "../../../game/store/effects/attack-effects";
import { CheckPokemonTypeEffect, CheckPokemonStatsEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_ABILITY_BLOCKED } from "../../../game/store/prefabs/prefabs";

export class Illumise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Supereffective Pheromones',
    powerType: PowerType.ABILITY,
    text: 'If you have Volbeat in play, apply Weakness for both Active Pokémon as x3.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Illumise';
  public fullName: string = 'Illumise 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Supereffective Pheromones
    if (effect instanceof ApplyWeaknessEffect) {
      // Only one Illumise applies (no stacking); first qualifying in play order wins
      let applicator: PokemonCard | undefined;

      for (const player of state.players) {
        let hasVolbeat = false;
        const illumises: PokemonCard[] = [];

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (cardList.getPokemonCard() !== card) {
            return;
          }
          if (card.name === 'Volbeat') {
            hasVolbeat = true;
          }
          if (card.name === 'Illumise' && card.powers.some(p => p.name === 'Supereffective Pheromones')) {
            illumises.push(card);
          }
        });

        if (!hasVolbeat) {
          continue;
        }

        for (const illumise of illumises) {
          if (!IS_ABILITY_BLOCKED(store, state, player, illumise)) {
            applicator = illumise;
            break;
          }
        }

        if (applicator) {
          break;
        }
      }

      if (applicator !== this) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
      store.reduceEffect(state, checkPokemonStats);

      const hasWeakness = !effect.ignoreWeakness && checkPokemonStats.weakness.some(w =>
        w.value === undefined && checkPokemonType.cardTypes.includes(w.type)
      );

      if (hasWeakness) {
        // ×2 from engine × 1.5 here = ×3 
        effect.damage = effect.damage * 1.5;
      }
    }

    return state;
  }
}
