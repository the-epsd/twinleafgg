import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rescue',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for up to 2 Pokémon, show them to your opponent, and put them into your hand.'
  },
  {
    name: 'Scratch',
    cost: [P, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina MT';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.POKEMON }, { min: 0, max: 2 }, this.attacks[0]);
    }

    return state;
  }
}
