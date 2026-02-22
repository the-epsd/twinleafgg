import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hoopa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Evil Admonition',
    cost: [CardType.COLORLESS],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each of your opponent\'s Pokémon that has an Ability.'
  },
  {
    name: 'Mind Shock',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name = 'Hoopa';
  public fullName = 'Hoopa UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonWithUsableAbilities = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            pokemonWithUsableAbilities++;
          }
        }
      });

      effect.damage += pokemonWithUsableAbilities * 20;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }
}