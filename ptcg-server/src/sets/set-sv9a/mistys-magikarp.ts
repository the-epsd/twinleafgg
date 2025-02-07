import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class MistysMagikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.MISTYS];
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Storehouse Hideaway',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks ' +
      'from your opponent\'s Pokémon done to this Pokémon.'
  }];

  public attacks = [{ name: 'Splash', cost: [W], damage: 10, text: '' }];

  public set: string = 'SV9a';
  public name: string = 'Misty\'s Magikarp';
  public fullName: string = 'Misty\'s Magikarp SV9a';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {

        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }

}