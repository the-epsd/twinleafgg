import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class LilliesCutiefly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public tags = [ CardTag.LILLIES ];
  public hp: number = 30;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [ ];

  public attacks = [
    { name: 'Stay Still', cost: [CardType.PSYCHIC], damage: 0, text: 'Heal 10 damage from this Pokemon.' }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';

  public name: string = 'Lillie\'s Cutiefly';
  public fullName: string = 'Lillie\'s Cutiefly SV9';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 10);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }
  
}