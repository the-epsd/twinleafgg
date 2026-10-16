import { PokemonCard, PokemonCardList, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pika Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Speed Bolt',
    cost: [L, C, C],
    damage: 40,
    text: 'If Pikachu evolved from Pichu during this turn, prevent all effects of an attack, including damage, done to Pikachu during your opponent\'s next turn.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Speed Bolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList)) {
        return state;
      }
      const evolvedFromPichuThisTurn = cardList.pokemonPlayedTurn === state.turn
        && cardList.getPokemons().some(p => p.name === 'Pichu');
      if (evolvedFromPichuThisTurn) {
        PREVENT_DAMAGE(store, state, effect, this);
        PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
      }
    }

    return state;
  }
}
