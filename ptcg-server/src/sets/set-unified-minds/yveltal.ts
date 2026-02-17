import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameMessage, PlayerType, SlotType, StoreLike, State, StateUtils, ChoosePokemonPrompt } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Blow Through',
      cost: [D],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'If there is any Stadium card in play, this attack does 20 more damage.'
    },
    {
      name: 'Shadow Impact',
      cost: [D, D, C],
      damage: 120,
      text: 'Put 3 damage counters on 1 of your Pokémon.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '139';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Blow Through
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - stadium check)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        effect.damage += 20;
      }
    }

    // Attack 2: Shadow Impact
    // Ref: set-lost-thunder/giratina.ts (Shadow Impact - put damage counters on own Pokemon)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const putCountersEffect = new PutCountersEffect(effect, 30);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        });
      });
    }

    return state;
  }
}
