import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";

export class MarniesImpidimp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    { name: 'Filch', cost: [C], damage: 0, text: 'Draw a card.' },
    { name: 'Corkscrew Punch', cost: [D], damage: 10, text: '' },
  ];

  public regulationMark: string = 'I';
  public set: string = 'SVOM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Marnie\'s Impidimp';
  public fullName: string = 'Marnie\'s Impidimp SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack == this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }
    return state;
  }
}