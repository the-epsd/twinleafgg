import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Electivire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electabuzz';
  public cardType: CardType[] = [L];
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Short-Circuit Knuckle',
    cost: [C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If your opponent has any Water Pokémon in play, this attack does 120 more damage.'
  },
  {
    name: 'Electroslug',
    cost: [L, L, C, C],
    damage: 140,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Electivire';
  public fullName: string = 'Electivire TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Short-Circuit Knuckle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasWaterPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(W)) {
          hasWaterPokemon = true;
        }
      });

      if (hasWaterPokemon) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
