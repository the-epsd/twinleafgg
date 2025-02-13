import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG } from '../../game/store/prefabs/prefabs';

export class Regigigas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 160;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Jewel Breaker',
      cost: [C, C, C, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Tera Pokémon, this attack does 230 more damage.',
    }
  ];

  public set: string = 'PRE';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 230, CardTag.POKEMON_TERA);
    }
    return state;
  }
}