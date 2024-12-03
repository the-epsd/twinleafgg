import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

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

  public set: string = 'SV8a';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas SV8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.POKEMON_TERA))) {
        effect.damage += 230;
      }
    }
    return state;
  }
}