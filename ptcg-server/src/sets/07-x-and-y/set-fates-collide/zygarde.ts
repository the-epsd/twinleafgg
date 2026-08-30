import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Zygarde extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Lookout',
    cost: [F],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
  },
  {
    name: 'Aura Break',
    cost: [F, C, C],
    damage: 70,
    text: 'If the Defending Pokémon is a Darkness or Fairy Pokémon, it can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'FCO';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zygarde';
  public fullName: string = 'Zygarde FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lookout
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        GUST_OPPONENT_BENCHED_POKEMON(store, state, effect.player);
      }
    }

    // Aura Break
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const checkType = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkType);

      if (checkType.cardTypes.includes(CardType.DARK) || checkType.cardTypes.includes(CardType.FAIRY)) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
