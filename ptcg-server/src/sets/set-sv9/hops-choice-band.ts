import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class HopsChoiceBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public tags = [CardTag.HOPS];

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public regulationMark = 'I';

  public name: string = 'Hop\'s Choice Band';

  public fullName: string = 'Hop\'s Choice Band SV9';

  public text: string =
    'When the Hop\'s Pokémon this card is attached to uses an attack, that attack costs 1 [C] Energy less and does 30 more damage to your opponent’s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
      const index = effect.cost.indexOf(CardType.COLORLESS);

      // No cost to reduce
      if (index === -1) {
        return state;
      }

      const hopsPokemon = effect.player.active.getPokemonCard();

      if (hopsPokemon && hopsPokemon.tags.includes(CardTag.HOPS)) {
        effect.cost.splice(index, 1);
      }

      return state;
    }

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.tags.includes(CardTag.HOPS)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
