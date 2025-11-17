import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class NsZekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.NS];
  public cardType: CardType = N;
  public hp: number = 130;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shred',
    cost: [C, C, C],
    damage: 70,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Rampage Thunder',
    cost: [R, L, L, C],
    damage: 250,
    text: 'This Pokemon can\'t attack during your next turn.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'N\'s Zekrom';
  public fullName: string = 'N\'s Zekrom M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rampage Thunder - prevent attack next turn
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}



