import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

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
  public set: string = 'DRI';
  public setNumber: string = '134';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Impidimp';
  public fullName: string = 'Marnie\'s Impidimp DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 1);
      return state;
    }
    return state;
  }
}