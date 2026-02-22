import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Diancie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public powers = [{
    name: 'Princess\'s Curtain',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched Basic Pokémon.'
  }];

  public attacks = [{
    name: 'Spike Draw',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Draw 2 cards.'
  }];

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Diancie';

  public fullName: string = 'Diancie ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerTargetEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.includes(this) || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target && effect.target.isStage(Stage.BASIC) && opponent.bench.some(b => b === effect.target)) {
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 2);
    }

    return state;
  }
}