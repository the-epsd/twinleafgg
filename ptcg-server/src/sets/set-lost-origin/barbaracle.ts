import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Barbaracle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Binacle';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Lost Block',
      powerType: PowerType.ABILITY,
      text: 'Your opponent puts any Prize cards they would take in the Lost Zone instead of into their hand.'
    }
  ];

  public attacks = [
    {
      name: 'Dynamic Chop',
      cost: [F, C, C],
      damage: 100,
      text: ''
    }
  ];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '107';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Barbaracle';
  public fullName: string = 'Barbaracle LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPrizesDestinationEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      // Ensure that Barbaracle is in play and has an owner.
      const opponent = effect.player; // Since it's the opponent that draws the prizes
      const player = StateUtils.getOpponent(state, opponent);
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // If the DrawPrizesEffect is triggering on the opponent's prize draw, override the destination.
      if (effect.player.id === opponent.id) {
        effect.destination = opponent.lostzone;
      }
    }
    return state;
  }
}